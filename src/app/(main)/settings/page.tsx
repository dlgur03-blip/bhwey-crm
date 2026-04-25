"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings2,
  Users,
  Building,
  Save,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/stores/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserRole } from "@/types";

interface ProfileRow {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  profile_img: string | null;
  created_at: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: "관리자", color: "bg-red-100 text-red-800" },
  manager: { label: "매니저", color: "bg-blue-100 text-blue-800" },
  staff: { label: "상담사", color: "bg-green-100 text-green-800" },
  viewer: { label: "뷰어", color: "bg-gray-100 text-gray-600" },
};

export default function SettingsPage() {
  const { profile } = useProfile();
  const [companyName, setCompanyName] = useState("BH WEY");
  const [contactDays, setContactDays] = useState("7");
  const [saved, setSaved] = useState(false);
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAdmin = profile?.role === "admin";

  const loadUsers = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setUsers(data);
    setLoadingUsers(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    if (!isAdmin) return;
    setUpdatingId(userId);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
    setUpdatingId(null);
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
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
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">미연락 알림 기준</label>
            <Select value={contactDays} onValueChange={(v) => setContactDays(v ?? "7")}>
              <SelectTrigger className="w-full sm:w-48">
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
            <Badge variant="secondary" className="text-xs">
              {loadingUsers ? "..." : `${users.length}명`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!isAdmin && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mb-4">
              <Shield className="w-4 h-4" />
              관리자만 사용자 역할을 변경할 수 있습니다
            </div>
          )}

          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              등록된 사용자가 없습니다
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">사용자</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 hidden sm:table-cell">이메일</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">역할</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.staff;
                    const isCurrentUser = user.id === profile?.id;
                    return (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                              {user.profile_img && (
                                <AvatarImage src={user.profile_img} alt={user.name} />
                              )}
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {(user.name || "?")[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">
                                {user.name}
                                {isCurrentUser && (
                                  <span className="text-[10px] text-muted-foreground ml-1">(나)</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground truncate sm:hidden">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                          {user.email}
                        </td>
                        <td className="px-3 py-3">
                          {isAdmin && !isCurrentUser ? (
                            <Select
                              value={user.role}
                              onValueChange={(v) => v && handleRoleChange(user.id, v)}
                              disabled={updatingId === user.id}
                            >
                              <SelectTrigger className="h-8 w-28 text-xs">
                                <SelectValue>
                                  {updatingId === user.id ? "변경 중..." : roleInfo.label}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(ROLE_LABELS).map(([value, { label }]) => (
                                  <SelectItem key={value} value={value} className="text-xs">
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="secondary" className={cn("text-xs", roleInfo.color)}>
                              {roleInfo.label}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
