import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { createUser, findUserByEmail, toSafeUser } from "@/models/User";
import { signSession, getSessionCookieName } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    // New signups strictly receive customer role and inactive subscription
    const user = await createUser({
      email,
      name,
      passwordHash,
    });

    const token = signSession({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    const safeUser = toSafeUser(user as unknown as Record<string, unknown>);
    const res = NextResponse.json({ user: safeUser }, { status: 201 });
    res.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
