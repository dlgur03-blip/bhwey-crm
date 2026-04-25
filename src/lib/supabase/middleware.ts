import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { pathname } = request.nextUrl;

  // OAuth 콜백 경로는 미들웨어에서 세션 체크하지 않음
  // getUser()가 PKCE code_verifier 쿠키를 소비할 수 있으므로 스킵
  if (pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 안 된 상태에서 보호된 경로 접근 시 → 로그인 페이지로
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/pipeline") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/alimtalk") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/mypage") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/guide");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 로그인 된 상태에서 로그인/회원가입 페이지 접근 시 → 대시보드로
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
