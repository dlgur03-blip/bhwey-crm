import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // 디버깅: 쿠키 상태 확인
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log("[auth/callback] cookies:", allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
  console.log("[auth/callback] code exists:", !!code);
  console.log("[auth/callback] all params:", Object.fromEntries(searchParams.entries()));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[auth/callback] exchangeCodeForSession:", {
      success: !error,
      error: error?.message,
      status: error?.status,
      userId: data?.user?.id,
    });

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
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
