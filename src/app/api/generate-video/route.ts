import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min — Veo can take up to 6 min

/**
 * POST /api/generate-video
 * Generate an AI video for a ticket NFT using Google Gemini Veo.
 *
 * Body: { eventName, venue, date, tierName, category, imageBase64?, imageMimeType? }
 *
 * If imageBase64 is provided, uses image-to-video (animates the AI-generated ticket artwork).
 * Otherwise uses text-to-video.
 *
 * Returns: { success: true, videoUrl: string, prompt: string }
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Get one at https://aistudio.google.com/apikey" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const prompt = buildVideoPrompt(body);
    const imageBase64 = body.imageBase64;
    const imageMimeType = body.imageMimeType || "image/png";

    const ai = new GoogleGenAI({ apiKey });

    // Build the generation request
    const generateParams: any = {
      model: "veo-3.1-generate-preview",
      prompt,
      config: {
        aspectRatio: "1:1",
        numberOfVideos: 1,
      },
    };

    // If we have the AI-generated image, use image-to-video
    if (imageBase64) {
      generateParams.image = {
        imageBytes: imageBase64,
        mimeType: imageMimeType,
      };
    }

    // Submit generation (returns a long-running operation)
    let operation = await ai.models.generateVideos(generateParams);

    // Poll until done (every 10s, up to ~5 min)
    const maxPolls = 30;
    for (let i = 0; i < maxPolls && !operation.done; i++) {
      await new Promise((r) => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (!operation.done) {
      return NextResponse.json(
        { error: "Video generation timed out. Please try again." },
        { status: 504 }
      );
    }

    // Extract the generated video
    const generatedVideos = operation.response?.generatedVideos || [];
    if (generatedVideos.length === 0) {
      return NextResponse.json(
        { error: "No video returned from Gemini Veo. Try a different prompt." },
        { status: 500 }
      );
    }

    const videoFile = generatedVideos[0].video;

    let videoBase64 = "";
    if (videoFile?.uri) {
      const dlUrl = videoFile.uri.includes("?")
        ? `${videoFile.uri}&key=${apiKey}`
        : `${videoFile.uri}?key=${apiKey}`;
      const dlRes = await fetch(dlUrl);
      if (!dlRes.ok) {
        return NextResponse.json(
          { error: `Failed to download video: ${dlRes.status}` },
          { status: 500 }
        );
      }
      const buffer = Buffer.from(await dlRes.arrayBuffer());
      videoBase64 = buffer.toString("base64");
    } else if (videoFile?.videoBytes) {
      videoBase64 = typeof videoFile.videoBytes === "string"
        ? videoFile.videoBytes
        : Buffer.from(videoFile.videoBytes).toString("base64");
    } else {
      return NextResponse.json(
        { error: "Video generated but no download URI available." },
        { status: 500 }
      );
    }

    const videoUrl = `data:video/mp4;base64,${videoBase64}`;

    return NextResponse.json({
      success: true,
      videoUrl,
      prompt,
    });
  } catch (err: any) {
    console.error("Video generation error:", err);
    return NextResponse.json(
      { error: err.message || "Video generation failed" },
      { status: 500 }
    );
  }
}

/**
 * Builds a cinematic video prompt from event metadata.
 */
function buildVideoPrompt(data: Record<string, any>): string {
  const eventName = data.eventName || "Live Event";
  const venue = data.venue || "";
  const tierName = data.tierName || "General";
  const category = data.category || "concert";

  const visualMap: Record<string, string> = {
    concert: "pulsing neon lights, bass drops visualised as energy waves, crowd silhouettes, laser beams cutting through fog",
    sports: "slow-motion action, stadium lights flaring, confetti explosion, dynamic camera movement, triumphant energy",
    theater: "velvet curtain rising, spotlight sweeping stage, dramatic shadows, golden particles floating, orchestral energy",
    conference: "holographic data streams, futuristic cityscape, digital particles converging, tech-forward atmosphere",
    festival: "fireworks blooming, festival grounds at golden hour, colour smoke bombs, spinning lights, euphoric crowd energy",
  };

  const visualPalette = visualMap[category] || visualMap.concert;

  return [
    `Cinematic short animation for "${eventName}" — a unique collectible ticket moment.`,
    `${visualPalette}.`,
    venue ? `Set at ${venue}.` : "",
    `${tierName} tier — premium, exclusive feel.`,
    `Abstract digital art coming to life, particle effects, smooth camera movement.`,
    `4K cinematic quality, shallow depth of field, dramatic lighting, luxury collectible aesthetic.`,
    `5 seconds, seamless loop.`,
  ].filter(Boolean).join(" ");
}
