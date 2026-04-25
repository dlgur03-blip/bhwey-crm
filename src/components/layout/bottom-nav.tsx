"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/stores/use-profile";
import { canAccessMenu } from "@/lib/permissions";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { href: "/customers", icon: Users, label: "고객" },
  { href: "/pipeline", icon: Kanban, label: "파이프라인" },
  { href: "/tasks", icon: CheckSquare, label: "업무" },
  { href: "/more", icon: MoreHorizontal, label: "더보기", isMore: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const role = profile?.role ?? "staff";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-around h-14 px-1">
        {navItems
          .filter((item) => item.isMore || canAccessMenu(role, item.href))
          .map((item) => {
            const isActive =
              item.href === "/more"
                ? ["/alimtalk", "/templates", "/mypage", "/settings", "/guide", "/more"].some(
                    (p) => pathname === p || pathname.startsWith(p + "/")
                  )
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
