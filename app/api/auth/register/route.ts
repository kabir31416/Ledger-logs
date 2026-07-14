import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import type { PublicUser } from "@/types";

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    await connectDB();

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return fail("An account with that email already exists", 409);
    }

    const user = await User.create({ name, email, password });

    const token = await signToken({ userId: user.id, email: user.email });

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    const res = ok(publicUser, 201, "Account created successfully");
    res.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
    return res;
  });
}
