import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { ok, withErrorHandling } from "@/lib/api-utils";

export async function POST() {
  return withErrorHandling(async () => {
    const res = ok(null, 200, "Logged out");
    res.cookies.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return res;
  });
}
