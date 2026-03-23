import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/generate-image
 * Generate a unique AI ticket artwork using Google Gemini.
 *
 * Body: { eventName, venue, date, tierName, category }
 *
 * Returns: { success: true, imageUrl: string, imageBase64: string, mimeType: string, prompt: string }
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
    const prompt = buildImagePrompt(body);

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "1:1", // Square — ideal for NFT ticket artwork
          imageSize: "1K",
        },
      },
    });

    // Extract image from response
    let imageBase64 = "";
    let mimeType = "image/png";

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
        mimeType = part.inlineData.mimeType || "image/png";
        break;
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image returned from Gemini. Try again." },
        { status: 500 }
      );
    }

    const imageUrl = `data:${mimeType};base64,${imageBase64}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      imageBase64,
      mimeType,
      prompt,
    });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json(
      { error: err.message || "Image generation failed" },
      { status: 500 }
    );
  }
}

/**
 * Builds a unique NFT ticket artwork prompt from event metadata.
 */
function buildImagePrompt(data: Record<string, any>): string {
  const eventName = data.eventName || "Live Event";
  const venue = data.venue || "";
  const date = data.date || "";
  const tierName = data.tierName || "General";
  const category = data.category || "concert";

  const styleMap: Record<string, string> = {
    concert: "neon lights, electric energy, vibrant stage lighting, music waves, abstract sound visualisation, synthwave palette",
    sports: "dynamic motion, stadium atmosphere, powerful energy, bold geometric shapes, championship gold accents",
    theater: "dramatic stage curtains, spotlight beam, elegant masks, theatrical gold and crimson, art deco patterns",
    conference: "futuristic holographic display, digital grid, tech-forward aesthetic, circuit patterns, clean geometric design",
    festival: "cosmic explosion of colour, psychedelic patterns, festival lights, kaleidoscopic energy, bohemian vibes",
  };

  const style = styleMap[category] || styleMap.concert;

  return [
    `Create a unique, collectible digital ticket artwork for "${eventName}".`,
    `${style}.`,
    venue ? `Inspired by the atmosphere of ${venue}.` : "",
    `Tier: ${tierName} — make it feel exclusive and premium.`,
    `Abstract digital art style, suitable as an NFT collectible.`,
    `Bold composition, rich colours, high contrast, no text or words in the image.`,
    `Square format, museum-quality digital art, cinematic lighting.`,
  ].filter(Boolean).join(" ");
}
