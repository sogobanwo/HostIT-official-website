import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Extract subdomain: "roadmap.hostit.event" → "roadmap"
  const subdomain = hostname.split(".")[0];

  // If accessing via roadmap subdomain, rewrite to /roadmap path
  if (subdomain === "roadmap" && pathname === "/") {
    return NextResponse.rewrite(new URL("/roadmap", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
