import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

// Routes that require a logged-in user
const PROTECTED_PATHS = ["/dashboard", "/expenses/add", "/expenses/manage", "/profile"];

// Routes a logged-in user shouldn't see again (redirect to dashboard instead)
const AUTH_ONLY_PATHS = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSessionFromRequest(req);

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname === p);

  if (isProtected && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnly && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/add",
    "/expenses/manage/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
