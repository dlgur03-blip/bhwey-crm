"use client";

import { useState, useMemo, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_TASKS, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Task } from "@/types";

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
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  }, []);

  const assignees = useMemo(() => {
    const set = new Map<string, string>();
    MOCK_TASKS.forEach((t) => set.set(t.assigneeId, t.assigneeName));
    return Array.from(set, ([id, name]) => ({ id, name }));
  }, []);

  const filtered = useMemo(() => {
    let result = [...tasks];

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
  }, [search, statusFilter, priorityFilter, assigneeFilter, tasks]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
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
        <Button className="gap-2" onClick={() => setTaskModalOpen(true)}>
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
                <button
                  className={cn("mt-0.5 shrink-0 hover:scale-110 transition-transform", status.color)}
                  onClick={() => toggleTaskStatus(task.id)}
                >
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

      {/* 업무 추가 모달 */}
      <TaskAddModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onSubmit={(data) => {
          const newTask: Task = {
            id: `task-${Date.now()}`,
            title: data.title,
            description: data.description,
            customerId: data.customerId || undefined,
            customerName: data.customerId
              ? MOCK_CUSTOMERS.find((c) => c.id === data.customerId)?.name
              : undefined,
            assigneeId: "user-1",
            assigneeName: "박팀장",
            dueDate: data.dueDate,
            priority: data.priority as Task["priority"],
            status: "pending",
            createdAt: new Date().toISOString(),
          };
          setTasks((prev) => [newTask, ...prev]);
        }}
      />
    </div>
  );
}

function TaskAddModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; dueDate: string; priority: string; customerId: string }) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ title: "", description: "", dueDate: today, priority: "medium", customerId: "" });
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!form.title.trim()) { setError("제목을 입력해주세요"); return; }
    onSubmit(form);
    onOpenChange(false);
    setForm({ title: "", description: "", dueDate: today, priority: "medium", customerId: "" });
    setError("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>업무 추가</DialogTitle>
          <DialogDescription>새로운 업무를 등록합니다</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">제목 <span className="text-red-500">*</span></Label>
            <Input id="task-title" value={form.title} onChange={(e) => { setForm(f => ({ ...f, title: e.target.value })); setError(""); }} placeholder="업무 제목" />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>우선순위</Label>
              <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v ?? "medium" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">긴급</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">마감일</Label>
              <Input id="task-due" type="date" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>관련 고객</Label>
            <Select value={form.customerId} onValueChange={(v) => setForm(f => ({ ...f, customerId: v ?? "" }))}>
              <SelectTrigger><SelectValue placeholder="선택 (선택사항)" /></SelectTrigger>
              <SelectContent>
                {MOCK_CUSTOMERS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.company})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-desc">설명</Label>
            <Textarea id="task-desc" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="업무 내용을 입력하세요" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
