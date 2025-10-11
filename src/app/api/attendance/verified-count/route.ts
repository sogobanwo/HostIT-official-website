import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toIsoDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export async function GET(req: NextRequest) {
  try {
    const url = "https://hostit-backend-v2.onrender.com/api/attendance";
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || res.statusText }, { status: res.status });
    }
    const payload = await res.json();
    const entries = Array.isArray(payload?.data) ? payload.data : [];

    const today = toIsoDate(new Date());
    const verifiedToday = entries.filter((e: any) => {
      const createdDate = toIsoDate(new Date(e?.createdAt));
      return createdDate === today && e?.isPresent === true;
    }).length;

    return NextResponse.json({ count: verifiedToday });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}