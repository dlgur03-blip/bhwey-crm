"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(searchParams.get("error") ? "로그인에 실패했습니다. 다시 시도해주세요." : "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError("Google 로그인에 실패했습니다.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* 로고 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white text-xl font-bold mb-4 shadow-lg shadow-primary/25">
          BH
        </div>
        <h1 className="text-2xl font-bold text-foreground">BH WEY 고객관리</h1>
        <p className="text-sm text-muted-foreground mt-1">계정에 로그인하세요</p>
      </div>

      <Card className="border-border/40 shadow-xl shadow-black/[0.03] glass">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-foreground">로그인</h2>
        </CardHeader>
        <CardContent>
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Google 로그인 */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 mb-4 h-11"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {googleLoading ? "연결 중..." : "Google로 로그인"}
          </Button>

          {/* 구분선 */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">또는 이메일로 로그인</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">이메일</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">비밀번호</label>
                <button type="button" className="text-xs text-primary hover:underline">
                  비밀번호 찾기
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 회원가입 링크 */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        계정이 없으신가요?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
