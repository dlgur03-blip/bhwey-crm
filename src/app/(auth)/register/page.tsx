"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPw: "", phone: "", role: "STAFF" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    // TODO: API 연동 — 현재는 데모
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }

  const roleLabels: Record<string, string> = {
    ADMIN: "관리자",
    MANAGER: "매니저",
    STAFF: "스태프",
    VIEWER: "열람자",
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* 로고 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white text-xl font-bold mb-4">
          BH
        </div>
        <h1 className="text-2xl font-bold text-foreground">BH WEY 고객관리</h1>
        <p className="text-sm text-muted-foreground mt-1">새 계정을 만드세요</p>
      </div>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-foreground">회원가입</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* 이름 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">이름</label>
              <Input
                placeholder="홍길동"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* 이메일 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">이메일</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>

            {/* 연락처 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">연락처</label>
              <Input
                type="tel"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>

            {/* 역할 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">역할</label>
              <Select value={form.role} onValueChange={(v) => update("role", v ?? "STAFF")}>
                <SelectTrigger>
                  <SelectValue>
                    {roleLabels[form.role] ?? "스태프"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                  <SelectItem value="MANAGER">매니저</SelectItem>
                  <SelectItem value="STAFF">스태프</SelectItem>
                  <SelectItem value="VIEWER">열람자</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">비밀번호</label>
              <Input
                type="password"
                placeholder="6자 이상 입력하세요"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">비밀번호 확인</label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={form.confirmPw}
                onChange={(e) => update("confirmPw", e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "가입 처리 중..." : "회원가입"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-4">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
