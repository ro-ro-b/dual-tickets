import { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data-provider";
import { getAuthenticatedClient } from "@/lib/dual-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { ticketId: string } }) {
  try {
    const { ticketId } = params;

    // Step 1: Read-only on-chain verification via data provider (no auth required)
    const provider = getDataProvider();
    const ticket = await provider.getTicket(ticketId);

    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: "Ticket not found on DUAL Network",
        verified: false,
      }, { status: 404 });
    }

    // Ticket exists on-chain — build verification response
    const verificationResult: Record<string, any> = {
      success: true,
      verified: true,
      ticketId: ticket.id,
      objectId: ticket.objectId || ticket.id,
      contentHash: ticket.contentHash,
      blockchainTxHash: ticket.blockchainTxHash,
      status: ticket.status,
      owner: ticket.ownerId,
      event: ticket.ticketData?.eventName,
      tier: ticket.ticketData?.tier,
      timestamp: new Date().toISOString(),
    };

    // Step 2: If authenticated, also write a verify action on-chain (optional enhancement)
    try {
      const client = await getAuthenticatedClient();
      if (client) {
        const result = await client.ebus.execute({
          action: {
            custom: {
              name: "verify_ticket",
              object_id: ticketId,
              data: {
                custom: {
                  ticketStatus: "scanned",
                  verifiedAt: new Date().toISOString(),
                  verifiedBy: "venue_scanner",
                },
              },
            },
          },
        });
        verificationResult.actionId = result.action_id;
        verificationResult.onChainVerified = true;
      }
    } catch {
      // Auth write failed — that's fine, read-only verification still succeeded
      verificationResult.onChainVerified = false;
    }

    return NextResponse.json(verificationResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Verification failed" }, { status: err.status || 500 });
  }
}
