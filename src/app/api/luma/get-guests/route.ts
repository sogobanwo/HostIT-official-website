import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LUMA_BASE = "https://public-api.luma.com/v1";

function getApiKey(): string {
  const key = process.env.LUMA_API_KEY || process.env.NEXT_PUBLIC_LUMA_API_KEY;
  if (!key) throw new Error("Missing Luma API key (LUMA_API_KEY)");
  return key;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventApiId =
      searchParams.get("event_api_id") ||
      process.env.LUMA_EVENT_ID ||
      process.env.NEXT_PUBLIC_LUMA_EVENT_ID ||
      "";

    if (!eventApiId) {
      return NextResponse.json({ error: "Missing event_api_id" }, { status: 400 });
    }

    const paginationLimit = searchParams.get("pagination_limit") || "100";
    const approvalStatus = searchParams.get("approval_status") || undefined;
    const sortColumn = searchParams.get("sort_column") || undefined;
    const sortDirection = searchParams.get("sort_direction") || undefined;
    const all = ["1", "true"].includes((searchParams.get("all") || "").toLowerCase());

    const headers = {
      Accept: "application/json",
      "x-luma-api-key": getApiKey(),
    } as const;

    if (!all) {
      const url = new URL(`${LUMA_BASE}/event/get-guests`);
      url.searchParams.set("event_api_id", eventApiId);
      url.searchParams.set("pagination_limit", paginationLimit);
      if (approvalStatus) url.searchParams.set("approval_status", approvalStatus);
      if (sortColumn) url.searchParams.set("sort_column", sortColumn);
      if (sortDirection) url.searchParams.set("sort_direction", sortDirection);

      const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text || res.statusText }, { status: res.status });
      }
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Auto-paginate until no next_cursor
    const entries: any[] = [];
    let nextCursor: string | null = searchParams.get("pagination_cursor");
    let page = 0;

    while (true) {
      const url = new URL(`${LUMA_BASE}/event/get-guests`);
      url.searchParams.set("event_api_id", eventApiId);
      url.searchParams.set("pagination_limit", paginationLimit);
      if (approvalStatus) url.searchParams.set("approval_status", approvalStatus);
      if (sortColumn) url.searchParams.set("sort_column", sortColumn);
      if (sortDirection) url.searchParams.set("sort_direction", sortDirection);
      if (nextCursor) url.searchParams.set("pagination_cursor", nextCursor);

      const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text || res.statusText }, { status: res.status });
      }
      const data = await res.json();
      const pageEntries = Array.isArray(data?.entries) ? data.entries : [];
      entries.push(...pageEntries);
      nextCursor = data?.next_cursor || null;
      page += 1;
      if (!nextCursor || page > 100) break; // safety cap
    }

    return NextResponse.json({ entries, count: entries.length, next_cursor: nextCursor });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}