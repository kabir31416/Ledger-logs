import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import type { PublicUser } from "@/types";

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    await connectDB();


    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return fail("Invalid email or password", 401);
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return fail("Invalid email or password", 401);
    }

    const token = await signToken({ userId: user.id, email: user.email });

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    const res = ok(publicUser, 200, "Logged in successfully");
    res.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
    return res;
  });
}
