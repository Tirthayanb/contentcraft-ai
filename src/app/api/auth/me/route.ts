import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findUserById, toSafeUser } from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      // Unauthenticated requests are treated as visitor without requiring a database user record
      return NextResponse.json(
        { user: null, role: "visitor" },
        { status: 200 }
      );
    }

    const user = await findUserById(session.userId);
    if (!user) {
      // Session references deleted/invalid user
      return NextResponse.json(
        { user: null, role: "visitor" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { user: toSafeUser(user as unknown as Record<string, unknown>) },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
