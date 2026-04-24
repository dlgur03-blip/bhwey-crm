"use client";

import Link from "next/link";
import {
  MessageSquare,
  FileText,
  BookOpen,
  UserCircle,
  Settings,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    href: "/alimtalk",
    icon: MessageSquare,
    label: "알림톡",
    description: "카카오 알림톡 템플릿 관리 및 발송",
    color: "text-yellow-600 bg-yellow-50",
  },
  {
    href: "/templates",
    icon: FileText,
    label: "템플릿",
    description: "프로세스 템플릿 관리",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    href: "/guide",
    icon: BookOpen,
    label: "사용 가이드",
    description: "BH WEY 사용법을 확인하세요",
    color: "text-blue-600 bg-blue-50",
  },
  {
    href: "/mypage",
    icon: UserCircle,
    label: "마이페이지",
    description: "내 정보 확인 및 수정",
    color: "text-green-600 bg-green-50",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "설정",
    description: "시스템 환경 설정",
    color: "text-gray-600 bg-gray-50",
  },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">더보기</h1>
        <p className="text-sm text-muted-foreground mt-1">
          추가 기능과 설정을 확인하세요
        </p>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white hover:bg-accent/50 transition-colors"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl ${item.color}`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.description}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
