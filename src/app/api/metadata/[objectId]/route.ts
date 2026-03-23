import { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data-provider";

export const dynamic = "force-dynamic";

/**
 * ERC-721 Metadata Endpoint
 *
 * Serves standard ERC-721 JSON metadata for each ticket NFT.
 * Blockscout and other explorers read this via the contract's tokenURI().
 *
 * GET /api/metadata/:objectId
 *
 * Returns:
 * {
 *   name: "Event Name - TIER",
 *   description: "...",
 *   image: "https://...",
 *   external_url: "https://dual-tickets.vercel.app/tickets/:id",
 *   attributes: [...]
 * }
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { objectId: string } }
) {
  try {
    const { objectId } = params;
    const provider = getDataProvider();
    const ticket = await provider.getTicket(objectId);

    if (!ticket) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      );
    }

    const td = ticket.ticketData;
    const tierLabel = (td?.tier || "general").toUpperCase();
    const name = td?.name || `${td?.eventName || "Event Ticket"} - ${tierLabel}`;
    const description =
      td?.description ||
      `On-chain verified ${tierLabel} ticket for ${td?.eventName || "event"} at ${td?.venue || "venue"} on ${td?.eventDate || "TBD"}. Secured by the DUAL Network with anti-scalp protection.`;

    // Build ERC-721 standard attributes
    const attributes: Array<{ trait_type: string; value: string | number; display_type?: string }> = [];

    if (td?.eventName) attributes.push({ trait_type: "Event", value: td.eventName });
    if (td?.eventDate) attributes.push({ trait_type: "Date", value: td.eventDate });
    if (td?.eventTime) attributes.push({ trait_type: "Time", value: td.eventTime });
    if (td?.venue) attributes.push({ trait_type: "Venue", value: td.venue });
    if (td?.category) attributes.push({ trait_type: "Category", value: td.category });
    if (td?.tier) attributes.push({ trait_type: "Tier", value: tierLabel });
    if (td?.section) attributes.push({ trait_type: "Section", value: td.section });
    if (td?.seat) attributes.push({ trait_type: "Seat", value: td.seat });
    if (td?.price) attributes.push({ trait_type: "Price (USD)", value: td.price, display_type: "number" });
    if (td?.maxResalePrice) attributes.push({ trait_type: "Max Resale (USD)", value: td.maxResalePrice, display_type: "number" });

    // ERC-721 metadata JSON
    const metadata = {
      name,
      description,
      image: td?.imageUrl || undefined,
      external_url: `https://dual-tickets.vercel.app/tickets/${ticket.id}`,
      attributes,
      properties: {
        contract: "0x41Cf00E593c5623B00F812bC70Ee1A737C5aFF06",
        chain: "DUAL Network",
        standard: "ERC-721",
        content_hash: ticket.contentHash || undefined,
        blockchain_tx: ticket.blockchainTxHash || undefined,
      },
    };

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
