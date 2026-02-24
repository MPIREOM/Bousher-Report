import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

const BLOB_KEY = "mpire-dashboard.json";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, limit: 1 });
    if (!blobs.length) return NextResponse.json(null);
    const res = await fetch(blobs[0].url);
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Remove old blob if it exists
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length) await del(blobs.map((b) => b.url));
    // Store new data
    await put(BLOB_KEY, JSON.stringify(body), {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length) await del(blobs.map((b) => b.url));
  } catch {}
  return NextResponse.json({ ok: true });
}
