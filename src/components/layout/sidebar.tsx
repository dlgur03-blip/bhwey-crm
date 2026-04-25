"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  Kanban,
  FileText,
  MessageSquare,
  CheckSquare,
  UserCircle,
  Settings,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/stores/use-sidebar";
import { useProfile } from "@/stores/use-profile";
import { canAccessMenu } from "@/lib/permissions";

const mainMenu = [
  { href: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { href: "/customers", icon: Users, label: "고객관리" },
  { href: "/pipeline", icon: Kanban, label: "파이프라인" },
  { href: "/templates", icon: FileText, label: "템플릿" },
  { href: "/alimtalk", icon: MessageSquare, label: "알림톡" },
  { href: "/tasks", icon: CheckSquare, label: "업무관리" },
];

const bottomMenu = [
  { href: "/guide", icon: BookOpen, label: "가이드" },
  { href: "/mypage", icon: UserCircle, label: "마이페이지" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebar();
  const { profile } = useProfile();
  const role = profile?.role ?? "staff";

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={close}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-sidebar to-white border-r border-sidebar-border/60 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 로고 */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-700 text-white text-sm font-bold shadow-md shadow-primary/20">
              BH
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">BH WEY</div>
              <div className="text-[11px] text-muted-foreground">고객관리</div>
            </div>
          </Link>
          <button onClick={close} className="lg:hidden p-1 hover:bg-accent rounded-md">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* 메인 메뉴 */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {mainMenu
            .filter((item) => canAccessMenu(role, item.href))
            .map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-medium sidebar-active-bar shadow-sm"
                      : "text-sidebar-foreground hover:bg-accent/80 hover:translate-x-0.5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", isActive && "scale-110")} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* 하단 메뉴 */}
        <div className="px-3 py-4 border-t border-sidebar-border/60 space-y-1">
          {bottomMenu
            .filter((item) => canAccessMenu(role, item.href))
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-medium sidebar-active-bar"
                      : "text-sidebar-foreground hover:bg-accent/80"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          <button onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/login");
            router.refresh();
          }} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-accent transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}
