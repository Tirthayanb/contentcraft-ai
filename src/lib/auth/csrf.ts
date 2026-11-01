import { NextRequest, NextResponse } from "next/server";

function getExpectedOrigin(req: NextRequest): string | null {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const host = req.headers.get("host");
  if (!host) return null;
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.includes("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}

export function validateCsrfOrigin(
  req: NextRequest,
): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) {
    return NextResponse.json(
      { error: "Forbidden: Origin header required" },
      { status: 403 },
    );
  }

  const expected = getExpectedOrigin(req);
  if (!expected || origin !== expected) {
    return NextResponse.json(
      { error: "Forbidden: Origin mismatch" },
      { status: 403 },
    );
  }

  return null;
}
