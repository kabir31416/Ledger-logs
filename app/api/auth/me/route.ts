import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/auth";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import type { PublicUser } from "@/types";

export async function GET() {
  return withErrorHandling(async () => {
    const session = await requireAuth();
    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) {
      return fail("Session is no longer valid", 401);
    }

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    return ok(publicUser);
  });
}
