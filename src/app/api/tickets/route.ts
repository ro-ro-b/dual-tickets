import { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data-provider";
import { getAuthenticatedClient } from "@/lib/dual-auth";

export const dynamic = "force-dynamic";

// GET /api/tickets — List all tickets
export async function GET() {
  try {
    const provider = getDataProvider();
    const tickets = await provider.listTickets();
    return NextResponse.json({ tickets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/tickets — Mint a new ticket
export async function POST(req: NextRequest) {
  try {
    const client = await getAuthenticatedClient();
    if (!client) {
      return NextResponse.json(
        { error: "Not authenticated. Login first via /api/auth/otp and /api/auth/login." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const templateId = body.templateId || process.env.DUAL_TICKETS_TEMPLATE_ID || '';
    const num = body.num || 1;
    const rawData = body.data || {};

    if (!templateId) {
      return NextResponse.json({ error: "Tickets template ID not configured" }, { status: 400 });
    }

    const mintData: Record<string, any> = {};

    // Build metadata block with ERC-721 standard fields (name, description, image)
    const metadataBlock: Record<string, any> = {};
    if (rawData.name) metadataBlock.name = rawData.name;
    if (rawData.description) metadataBlock.description = rawData.description;
    if (rawData.imageUrl) metadataBlock.image = { url: rawData.imageUrl };

    if (Object.keys(metadataBlock).length > 0) {
      mintData.metadata = metadataBlock;
    }

    const { name: _n, description: _d, ...customFields } = rawData;
    const custom: Record<string, any> = { ...customFields };
    if (rawData.name) custom.name = rawData.name;
    if (rawData.description) custom.description = rawData.description;

    if (Object.keys(custom).length > 0) {
      mintData.custom = custom;
    }

    const actionPayload: any = {
      action: {
        mint: {
          template_id: templateId,
          num,
          ...(Object.keys(mintData).length > 0 ? { data: mintData } : {}),
        },
      },
    };

    const result = await client.ebus.execute(actionPayload);
    const objectIds = result.steps?.[0]?.output?.ids || [];

    // Post-mint: set full metadata on each minted object for DUAL console + Blockscout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dual-tickets.vercel.app';
    for (const objId of objectIds) {
      try {
        const postMintMeta: Record<string, any> = {
          token_uri: `${appUrl}/api/metadata/${objId}`,
        };
        if (rawData.name) postMintMeta.name = rawData.name;
        if (rawData.description) postMintMeta.description = rawData.description;
        if (rawData.imageUrl) postMintMeta.image = { url: rawData.imageUrl };

        await client.objects.updateObject(objId, { metadata: postMintMeta });
      } catch {
        // Non-critical — metadata endpoint still works via data provider lookup
      }
    }

    return NextResponse.json({
      success: true,
      actionId: result.action_id,
      steps: result.steps,
      objectIds,
    }, { status: 201 });
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.body?.message || err.message || "Ticket mint failed";
    return NextResponse.json({ error: message }, { status });
  }
}
