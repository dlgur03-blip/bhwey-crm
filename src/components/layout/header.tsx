"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/stores/use-sidebar";
import { useProfile } from "@/stores/use-profile";
import { MOCK_CUSTOMERS, MOCK_TASKS } from "@/lib/mock-data";
import { GradeBadge } from "@/components/common/grade-badge";
import { ROLE_LABELS } from "@/lib/constants";

export function Header() {
  const { toggle } = useSidebar();
  const { profile } = useProfile();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const q = query.toLowerCase().trim();
  const customers = q
    ? MOCK_CUSTOMERS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.phone.includes(q)
      ).slice(0, 5)
    : [];
  const tasks = q
    ? MOCK_TASKS.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.customerName && t.customerName.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  const hasResults = customers.length > 0 || tasks.length > 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 glass px-4 lg:px-6">
      {/* 햄버거 (모바일/태블릿) */}
      <button
        onClick={toggle}
        className="lg:hidden p-2 hover:bg-accent rounded-lg"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* 검색 */}
      <div className="flex-1 max-w-md relative" ref={ref}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="고객, 업무 검색..."
            className="pl-9 pr-8 h-9 bg-surface border-border rounded-lg"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => q && setOpen(true)}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setOpen(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* 검색 결과 드롭다운 */}
        {open && q && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
            {!hasResults ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                &quot;{query}&quot;에 대한 검색 결과가 없습니다
              </div>
            ) : (
              <>
                {customers.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                      고객 ({customers.length})
                    </div>
                    {customers.map((c) => (
                      <button
                        key={c.id}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
                        onClick={() => {
                          router.push(`/customers/${c.id}`);
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {c.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{c.company} · {c.phone}</div>
                        </div>
                        <GradeBadge grade={c.grade} />
                      </button>
                    ))}
                  </div>
                )}
                {tasks.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                      업무 ({tasks.length})
                    </div>
                    {tasks.map((t) => (
                      <button
                        key={t.id}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
                        onClick={() => {
                          router.push("/tasks");
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        <span className={`text-lg ${t.status === "completed" ? "text-green-500" : "text-muted-foreground"}`}>
                          {t.status === "completed" ? "✓" : "○"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{t.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {t.customerName && `${t.customerName} · `}마감: {t.dueDate}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
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
            {profile?.profileImg && (
              <AvatarImage src={profile.profileImg} alt={profile.name} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {(profile?.name || "U")[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-foreground leading-tight">
              {profile?.name || "사용자"}
            </span>
            {profile?.role && (
              <span className="text-[10px] text-muted-foreground leading-tight">
                {ROLE_LABELS[profile.role]}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
