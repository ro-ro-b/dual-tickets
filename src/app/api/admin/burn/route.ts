import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/lib/dual-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/burn
 * Burns ticket objects on the DUAL Network.
 * Body: { objectIds: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const client = await getAuthenticatedClient();
    if (!client) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { objectIds } = await req.json();
    if (!objectIds || !Array.isArray(objectIds) || objectIds.length === 0) {
      return NextResponse.json({ error: "objectIds array required" }, { status: 400 });
    }

    const results: Array<{ id: string; status: string; error?: string }> = [];

    for (const objId of objectIds) {
      try {
        const result = await client.ebus.execute({
          action: {
            burn: {
              object_id: objId,
            },
          },
        });
        results.push({ id: objId, status: 'burned' });
      } catch (err: any) {
        const detail = err.body ? JSON.stringify(err.body) : err.message;
        results.push({ id: objId, status: 'error', error: `${err.status || '?'}: ${detail}` });
      }
    }

    return NextResponse.json({
      success: true,
      total: objectIds.length,
      burned: results.filter(r => r.status === 'burned').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
