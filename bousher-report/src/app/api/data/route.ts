import { NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "dashboard.json");

async function ensureDir() {
  const { mkdir } = await import("fs/promises");
  await mkdir(join(process.cwd(), "data"), { recursive: true });
}

export async function GET() {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await ensureDir();
    await writeFile(DATA_PATH, JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await unlink(DATA_PATH);
  } catch {}
  return NextResponse.json({ ok: true });
}
