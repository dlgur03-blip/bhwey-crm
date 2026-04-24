"use client";

import { useState } from "react";
import {
  Settings2,
  Users,
  Building,
  Palette,
  Globe,
  Shield,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: "user-1", name: "박팀장", email: "admin@bhwey.com", role: "ADMIN", status: "active" },
  { id: "user-2", name: "이대리", email: "staff@bhwey.com", role: "STAFF", status: "active" },
  { id: "user-3", name: "김사원", email: "kim@bhwey.com", role: "STAFF", status: "active" },
  { id: "user-4", name: "최인턴", email: "choi@bhwey.com", role: "VIEWER", status: "inactive" },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN: { label: "관리자", color: "bg-red-100 text-red-800" },
  MANAGER: { label: "매니저", color: "bg-blue-100 text-blue-800" },
  STAFF: { label: "스태프", color: "bg-green-100 text-green-800" },
  VIEWER: { label: "열람자", color: "bg-gray-100 text-gray-600" },
};

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("BH WEY");
  const [contactDays, setContactDays] = useState("7");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">설정</h1>
        <p className="text-sm text-muted-foreground mt-1">애플리케이션 설정을 관리합니다</p>
      </div>

      {/* 회사 정보 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">회사 정보</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">회사명</label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">로고</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                  BH
                </div>
                <Button variant="outline" size="sm">로고 변경</Button>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {saved ? "저장됨!" : "저장"}
          </Button>
        </CardContent>
      </Card>

      {/* 시스템 설정 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">시스템 설정</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">미연락 알림 기준</label>
              <Select value={contactDays} onValueChange={(v) => setContactDays(v ?? "7")}>
                <SelectTrigger>
                  <SelectValue>{contactDays}일</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3일</SelectItem>
                  <SelectItem value="5">5일</SelectItem>
                  <SelectItem value="7">7일</SelectItem>
                  <SelectItem value="14">14일</SelectItem>
                  <SelectItem value="30">30일</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">설정한 기간 이상 미연락 고객을 대시보드에 표시</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">권한 모드</label>
              <Select value="self" onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue>셀프 설정</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">셀프 설정 (마이페이지에서 역할 선택)</SelectItem>
                  <SelectItem value="admin">관리자 승인 (관리자가 역할 부여)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">사용자가 직접 역할을 선택하거나 관리자 승인 필요</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 관리 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">사용자 관리</h2>
            </div>
            <Badge variant="secondary" className="text-xs">{MOCK_USERS.length}명</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">이름</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">이메일</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">역할</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">상태</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 w-[100px]">액션</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {user.name[0]}
                        </div>
                        <span className="text-sm font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className={cn("text-xs", ROLE_LABELS[user.role].color)}>
                        {ROLE_LABELS[user.role].label}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-xs",
                        user.status === "active" ? "text-green-600" : "text-muted-foreground"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          user.status === "active" ? "bg-green-500" : "bg-gray-300"
                        )} />
                        {user.status === "active" ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Button variant="ghost" size="sm" className="text-xs h-7">
                        편집
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
