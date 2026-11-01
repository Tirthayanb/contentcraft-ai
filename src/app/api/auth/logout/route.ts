import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth/session";
import { validateCsrfOrigin } from "@/lib/auth/csrf";

export async function POST(req: NextRequest) {
  const csrf = validateCsrfOrigin(req);
  if (csrf) return csrf;

  try {
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set(getSessionCookieName(), "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
