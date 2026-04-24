"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: NextAuth signIn 연동 — 현재는 데모 로그인
    if (email === "admin@bhwey.com" && password === "admin1234") {
      router.push("/dashboard");
      return;
    }

    setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    setLoading(false);
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* 로고 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white text-xl font-bold mb-4">
          BH
        </div>
        <h1 className="text-2xl font-bold text-foreground">BH WEY 고객관리</h1>
        <p className="text-sm text-muted-foreground mt-1">계정에 로그인하세요</p>
      </div>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-foreground">로그인</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* 이메일 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">이메일</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
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

            {/* 데모 계정 안내 */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-800 mb-1">데모 계정</p>
              <p className="text-xs text-blue-600">
                이메일: admin@bhwey.com<br />
                비밀번호: admin1234
              </p>
            </div>
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
