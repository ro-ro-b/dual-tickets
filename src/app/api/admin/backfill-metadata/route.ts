import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/lib/dual-auth";
import { getDataProvider } from "@/lib/data-provider";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/backfill-metadata
 *
 * Updates all existing ticket objects with proper metadata fields
 * (name, description, image) so the DUAL console and Blockscout display them correctly.
 *
 * Requires admin authentication.
 */
export async function POST() {
  try {
    const client = await getAuthenticatedClient();
    if (!client) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const provider = getDataProvider();
    const tickets = await provider.listTickets();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dual-tickets.vercel.app';

    const results: Array<{ id: string; name: string; status: string; error?: string }> = [];

    for (const ticket of tickets) {
      const td = ticket.ticketData;
      const name = td?.name || `${td?.eventName || 'Event Ticket'} - ${(td?.tier || 'general').toUpperCase()}`;
      const description = td?.description || `On-chain verified ticket for ${td?.eventName || 'event'}`;

      const metadataUpdate: Record<string, any> = {
        name,
        description,
        token_uri: `${appUrl}/api/metadata/${ticket.id}`,
      };

      // Set image if we have one
      if (td?.imageUrl) {
        metadataUpdate.image = { url: td.imageUrl };
      }

      try {
        await client.objects.updateObject(ticket.id, {
          metadata: metadataUpdate,
        });
        results.push({ id: ticket.id, name, status: 'updated' });
      } catch (err: any) {
        results.push({ id: ticket.id, name, status: 'error', error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      total: tickets.length,
      updated: results.filter(r => r.status === 'updated').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
