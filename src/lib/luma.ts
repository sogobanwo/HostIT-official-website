export interface LumaGuest {
  name?: string;
  email: string;
  ticket_type?: string;
  checked_in?: boolean;
  answers?: Record<string, unknown>;
}

const LUMA_BASE = "https://public-api.luma.com/v1";

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_LUMA_API_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_LUMA_API_KEY");
  }
  return key;
}

export async function fetchLumEventGuests(
  eventApiId: string,
  limit = 5000
): Promise<LumaGuest[]> {
  if (!eventApiId) {
    throw new Error("Missing Luma event_api_id");
  }
  const url = new URL(`${LUMA_BASE}/event/get-guests`);
  url.searchParams.set("event_api_id", eventApiId);
  url.searchParams.set("pagination_limit", String(limit));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-luma-api-key": getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`Luma error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const entries = (data?.entries ?? []) as any[];
  return entries.map((e) => ({
    name: e?.name ?? e?.full_name ?? undefined,
    email: e?.email,
    ticket_type: e?.ticket_type ?? e?.ticketName ?? undefined,
    checked_in: e?.checked_in ?? false,
    answers: e?.answers ?? undefined,
  }));
}

export async function fetchLumGuestByEmail(
  eventApiId: string,
  email: string
): Promise<LumaGuest | null> {
  if (!eventApiId) {
    throw new Error("Missing Luma event_api_id");
  }
  const url = new URL(`${LUMA_BASE}/event/get-guest`);
  url.searchParams.set("event_api_id", eventApiId);
  url.searchParams.set("email", email);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-luma-api-key": getApiKey(),
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const g = data?.guest;
  if (!g) return null;
  return {
    name: g?.name ?? g?.full_name ?? undefined,
    email: g?.email,
    ticket_type: g?.ticket_type ?? g?.ticketName ?? undefined,
    checked_in: g?.checked_in ?? false,
    answers: g?.answers ?? undefined,
  };
}