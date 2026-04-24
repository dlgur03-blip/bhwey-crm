"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Filter,
  Calendar,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_TASKS, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PRIORITY_CONFIG = {
  high: { label: "긴급", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  medium: { label: "보통", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  low: { label: "낮음", color: "bg-gray-100 text-gray-600", icon: Circle },
};

const STATUS_CONFIG = {
  pending: { label: "대기", color: "text-orange-500" },
  in_progress: { label: "진행중", color: "text-blue-500" },
  completed: { label: "완료", color: "text-green-500" },
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const assignees = useMemo(() => {
    const set = new Map<string, string>();
    MOCK_TASKS.forEach((t) => set.set(t.assigneeId, t.assigneeName));
    return Array.from(set, ([id, name]) => ({ id, name }));
  }, []);

  const filtered = useMemo(() => {
    let result = [...MOCK_TASKS];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q)) ||
          (t.customerName?.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (assigneeFilter !== "all") {
      result = result.filter((t) => t.assigneeId === assigneeFilter);
    }

    // 정렬: 미완료 먼저, 그 안에서 우선순위 순
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return result;
  }, [search, statusFilter, priorityFilter, assigneeFilter]);

  const stats = {
    total: MOCK_TASKS.length,
    pending: MOCK_TASKS.filter((t) => t.status === "pending").length,
    inProgress: MOCK_TASKS.filter((t) => t.status === "in_progress").length,
    completed: MOCK_TASKS.filter((t) => t.status === "completed").length,
  };

  const statusLabels: Record<string, string> = {
    all: "전체 상태",
    pending: "대기",
    in_progress: "진행중",
    completed: "완료",
  };

  const priorityLabels: Record<string, string> = {
    all: "전체 우선순위",
    high: "긴급",
    medium: "보통",
    low: "낮음",
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">업무 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            전체 {stats.total}건 · 대기 {stats.pending} · 진행중 {stats.inProgress} · 완료 {stats.completed}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          업무 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="전체" value={stats.total} color="text-foreground" />
        <StatCard label="대기" value={stats.pending} color="text-orange-500" />
        <StatCard label="진행중" value={stats.inProgress} color="text-blue-500" />
        <StatCard label="완료" value={stats.completed} color="text-green-500" />
      </div>

      {/* 필터/검색 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="업무명, 고객명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[130px]">
            <SelectValue>{statusLabels[statusFilter]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="pending">대기</SelectItem>
            <SelectItem value="in_progress">진행중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue>{priorityLabels[priorityFilter]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 우선순위</SelectItem>
            <SelectItem value="high">긴급</SelectItem>
            <SelectItem value="medium">보통</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={(v) => setAssigneeFilter(v ?? "all")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              {assigneeFilter === "all" ? "전체 담당자" : assignees.find((a) => a.id === assigneeFilter)?.name ?? "담당자"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 담당자</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 업무 목록 */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const priority = PRIORITY_CONFIG[task.priority];
          const status = STATUS_CONFIG[task.status];
          const isOverdue = task.status !== "completed" && task.dueDate < new Date().toISOString().split("T")[0];

          return (
            <Card key={task.id} className={cn("rounded-xl", task.status === "completed" && "opacity-60")}>
              <CardContent className="p-4 flex items-start gap-3">
                {/* 체크 아이콘 */}
                <button className={cn("mt-0.5 shrink-0", status.color)}>
                  {task.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "text-sm font-medium",
                      task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {task.title}
                    </span>
                    <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", priority.color)}>
                      {priority.label}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-red-100 text-red-700">
                        기한 초과
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    {task.customerName && (
                      <Link href={`/customers/${task.customerId}`} className="hover:text-primary flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.customerName}
                      </Link>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                    <span>{task.assigneeName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-4 text-center">
        <div className={cn("text-2xl font-bold", color)}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
