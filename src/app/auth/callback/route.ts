import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const debug = searchParams.get("debug");

  // 디버깅 모드: JSON으로 상태 반환
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieNames = allCookies.map((c) => c.name);
  const codeVerifierCookie = allCookies.find((c) =>
    c.name.includes("code-verifier")
  );

  if (!code) {
    if (debug) {
      return NextResponse.json({
        error: "no_code",
        params: Object.fromEntries(searchParams.entries()),
        cookieNames,
      });
    }
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (debug) {
    return NextResponse.json({
      success: !error,
      error: error
        ? { message: error.message, status: error.status, code: error.code }
        : null,
      userId: data?.user?.id,
      email: data?.user?.email,
      cookieNames,
      hasCodeVerifier: !!codeVerifierCookie,
      codeVerifierLength: codeVerifierCookie?.value?.length ?? 0,
    });
  }

  if (!error) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent(error.message)}`
  );
}
