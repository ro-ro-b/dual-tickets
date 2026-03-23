import { NextResponse } from "next/server";
import { getJwtToken } from "@/lib/dual-auth";
import { getDataProvider } from "@/lib/data-provider";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_DUAL_API_URL || 'https://gateway-48587430648.europe-west6.run.app';
const API_KEY = process.env.DUAL_API_KEY || '';

/**
 * POST /api/admin/backfill-metadata
 *
 * Updates all existing ticket objects with proper metadata fields
 * (name, description, image) so the DUAL console and Blockscout display them correctly.
 *
 * Requires admin authentication. Tries PUT then PATCH then POST to find the right method.
 */
export async function POST() {
  try {
    const token = getJwtToken();
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const provider = getDataProvider();
    const tickets = await provider.listTickets();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dual-tickets.vercel.app';

    const results: Array<{ id: string; name: string; status: string; error?: string; method?: string }> = [];

    for (const ticket of tickets) {
      const td = ticket.ticketData;
      const name = td?.name || `${td?.eventName || 'Event Ticket'} - ${(td?.tier || 'general').toUpperCase()}`;
      const description = td?.description || `On-chain verified ticket for ${td?.eventName || 'event'}`;

      const metadataUpdate: Record<string, any> = {
        name,
        description,
        token_uri: `${appUrl}/api/metadata/${ticket.id}`,
      };

      if (td?.imageUrl) {
        metadataUpdate.image = { url: td.imageUrl };
      }

      const body = JSON.stringify({ metadata: metadataUpdate });
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      if (API_KEY) headers['X-Api-Key'] = API_KEY;

      // Try multiple HTTP methods to find the one the gateway accepts
      let success = false;
      for (const method of ['PUT', 'PATCH', 'POST']) {
        try {
          const res = await fetch(`${BASE_URL}/objects/${ticket.id}`, {
            method,
            headers,
            body,
          });
          if (res.ok) {
            results.push({ id: ticket.id, name, status: 'updated', method });
            success = true;
            break;
          }
          // If 405, try next method
          if (res.status === 405) continue;
          // Other error — report it
          const errData = await res.text();
          results.push({ id: ticket.id, name, status: 'error', error: `${method} ${res.status}: ${errData}` });
          success = true; // stop trying other methods
          break;
        } catch (fetchErr: any) {
          results.push({ id: ticket.id, name, status: 'error', error: `${method} fetch error: ${fetchErr.message}` });
          success = true;
          break;
        }
      }
      if (!success) {
        results.push({ id: ticket.id, name, status: 'error', error: 'All methods (PUT/PATCH/POST) returned 405' });
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
