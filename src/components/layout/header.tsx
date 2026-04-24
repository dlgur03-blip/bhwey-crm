"use client";

import { Menu, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/stores/use-sidebar";

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      {/* 햄버거 (모바일/태블릿) */}
      <button
        onClick={toggle}
        className="lg:hidden p-2 hover:bg-accent rounded-lg"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* 검색 */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="고객, 업무 검색..."
            className="pl-9 h-9 bg-surface border-border rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* 알림 */}
        <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* 프로필 */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              박
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium text-foreground">
            박팀장
          </span>
        </div>
      </div>
    </header>
  );
}
