import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { Resend } from "resend";
import type { ParsedData } from "@/lib/parser";
import { buildEmailHtml } from "@/lib/email";

const BLOB_KEY = "mpire-dashboard.json";

export async function GET(req: Request) {
  // Auth: require a secret token to prevent unauthorized triggers
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const expectedToken = process.env.REPORT_SECRET;
  if (expectedToken && token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read dashboard data from Vercel Blob
  let data: ParsedData;
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, limit: 1 });
    if (!blobs.length) {
      return NextResponse.json({ error: "No dashboard data found. Upload an Excel file first." }, { status: 404 });
    }
    const res = await fetch(blobs[0].url);
    data = await res.json();
    if (!data?.dashboard) {
      return NextResponse.json({ error: "Dashboard data is incomplete" }, { status: 404 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to read data: " + e.message }, { status: 500 });
  }

  // Build email HTML
  const html = buildEmailHtml(data);

  // Send via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.REPORT_EMAIL_TO;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }
  if (!emailTo) {
    return NextResponse.json({ error: "REPORT_EMAIL_TO not configured" }, { status: 500 });
  }

  try {
    const resend = new Resend(resendKey);
    const cm = data.dashboard!.months[data.dashboard!.months.length - 1];
    const { error } = await resend.emails.send({
      from: process.env.REPORT_EMAIL_FROM || "MPIRE Reports <reports@resend.dev>",
      to: emailTo.split(",").map((e) => e.trim()),
      subject: `MPIRE Weekly Report — ${cm} · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      html,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, sentTo: emailTo });
  } catch (e: any) {
    return NextResponse.json({ error: "Send failed: " + e.message }, { status: 500 });
  }
}
