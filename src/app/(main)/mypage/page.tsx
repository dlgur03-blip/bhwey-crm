"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Lock,
  Save,
  Camera,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ROLE_CONFIG = {
  ADMIN: { label: "관리자", desc: "모든 기능 접근 가능", color: "bg-red-100 text-red-800" },
  MANAGER: { label: "매니저", desc: "팀 전체 고객 관리", color: "bg-blue-100 text-blue-800" },
  STAFF: { label: "스태프", desc: "본인 담당 고객만", color: "bg-green-100 text-green-800" },
  VIEWER: { label: "열람자", desc: "읽기 전용", color: "bg-gray-100 text-gray-600" },
};

export default function MypagePage() {
  const [profile, setProfile] = useState({
    name: "박팀장",
    email: "admin@bhwey.com",
    phone: "010-9876-5432",
    role: "ADMIN" as keyof typeof ROLE_CONFIG,
  });

  const [notifications, setNotifications] = useState({
    inApp: true,
    email: true,
    taskReminder: true,
    customerAlert: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPw: "",
    confirmPw: "",
  });

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
        <p className="text-sm text-muted-foreground mt-1">개인 정보 및 계정을 관리합니다</p>
      </div>

      {/* 프로필 카드 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">프로필 정보</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 프로필 이미지 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {profile.name[0]}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">{profile.name}</div>
              <Badge variant="secondary" className={ROLE_CONFIG[profile.role].color}>
                {ROLE_CONFIG[profile.role].label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 이름 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">이름</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">연락처</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {saved ? "저장됨!" : "프로필 저장"}
          </Button>
        </CardContent>
      </Card>

      {/* 역할/권한 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">역할 및 권한</h2>
          </div>
          <p className="text-xs text-muted-foreground">현재는 셀프 설정 모드입니다. 추후 관리자 승인 방식으로 전환됩니다.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={profile.role} onValueChange={(v) => setProfile({ ...profile, role: (v ?? "STAFF") as keyof typeof ROLE_CONFIG })}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue>{ROLE_CONFIG[profile.role].label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <span className="font-medium">{cfg.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">{cfg.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
              <div
                key={key}
                className={cn(
                  "p-3 rounded-lg border text-sm",
                  profile.role === key ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <Badge variant="secondary" className={cn("mb-1", cfg.color)}>{cfg.label}</Badge>
                <p className="text-xs text-muted-foreground">{cfg.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">알림 설정</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            label="인앱 알림"
            desc="앱 내 알림 수신"
            checked={notifications.inApp}
            onChange={(v) => setNotifications({ ...notifications, inApp: v })}
          />
          <ToggleRow
            label="이메일 알림"
            desc="이메일로 알림 수신"
            checked={notifications.email}
            onChange={(v) => setNotifications({ ...notifications, email: v })}
          />
          <ToggleRow
            label="업무 리마인더"
            desc="마감일 전 알림"
            checked={notifications.taskReminder}
            onChange={(v) => setNotifications({ ...notifications, taskReminder: v })}
          />
          <ToggleRow
            label="고객 미연락 알림"
            desc="7일 이상 미연락 시 알림"
            checked={notifications.customerAlert}
            onChange={(v) => setNotifications({ ...notifications, customerAlert: v })}
          />
        </CardContent>
      </Card>

      {/* 비밀번호 변경 */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">비밀번호 변경</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">현재 비밀번호</label>
            <Input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="현재 비밀번호 입력"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">새 비밀번호</label>
              <Input
                type="password"
                value={passwords.newPw}
                onChange={(e) => setPasswords({ ...passwords, newPw: e.target.value })}
                placeholder="6자 이상"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">새 비밀번호 확인</label>
              <Input
                type="password"
                value={passwords.confirmPw}
                onChange={(e) => setPasswords({ ...passwords, confirmPw: e.target.value })}
                placeholder="비밀번호 재입력"
              />
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Lock className="w-4 h-4" />
            비밀번호 변경
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
