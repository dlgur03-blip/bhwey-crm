"use client";

import { useState, useMemo } from "react";
import { Kanban, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { MOCK_TEMPLATES, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { GradeBadge } from "@/components/common/grade-badge";
import { ProgressBar } from "@/components/common/progress-bar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { CustomerGrade } from "@/types";

export default function PipelinePage() {
  const [templateId, setTemplateId] = useState(MOCK_TEMPLATES[0].id);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const template = MOCK_TEMPLATES.find((t) => t.id === templateId);

  // 담당자 목록 추출
  const assignees = useMemo(() => {
    const set = new Map<string, string>();
    MOCK_CUSTOMERS.forEach((c) => set.set(c.assigneeId, c.assigneeName));
    return Array.from(set, ([id, name]) => ({ id, name }));
  }, []);

  // 필터 적용된 고객
  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter((c) => {
      if (gradeFilter !== "all" && c.grade !== gradeFilter) return false;
      if (assigneeFilter !== "all" && c.assigneeId !== assigneeFilter) return false;
      return true;
    });
  }, [gradeFilter, assigneeFilter]);

  // 리스트 뷰 데이터
  const listData = filteredCustomers.flatMap((c) =>
    c.processes
      .filter((p) => p.templateId === templateId)
      .map((p) => ({ customer: c, process: p }))
  ).sort((a, b) => a.process.currentStageOrder - b.process.currentStageOrder);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">파이프라인</h1>
          <p className="text-sm text-muted-foreground mt-1">
            프로세스별 고객 진행 현황을 관리합니다
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 템플릿 선택 */}
          <Select value={templateId} onValueChange={(v) => setTemplateId(v ?? templateId)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="프로세스 선택">
                {template && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: template.color }}
                    />
                    {template.name}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MOCK_TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    {t.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 뷰 전환 */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "p-2 transition-colors",
                view === "kanban" ? "bg-primary text-white" : "bg-background text-muted-foreground hover:bg-accent"
              )}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2 transition-colors",
                view === "list" ? "bg-primary text-white" : "bg-background text-muted-foreground hover:bg-accent"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          필터
        </div>
        <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v ?? "all")}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue>
              {gradeFilter === "all" ? "전체 등급" : gradeFilter === "NEW" ? "신규" : `${gradeFilter}등급`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 등급</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="A">A등급</SelectItem>
            <SelectItem value="B">B등급</SelectItem>
            <SelectItem value="C">C등급</SelectItem>
            <SelectItem value="NEW">신규</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={(v) => setAssigneeFilter(v ?? "all")}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
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
        {(gradeFilter !== "all" || assigneeFilter !== "all") && (
          <button
            onClick={() => { setGradeFilter("all"); setAssigneeFilter("all"); }}
            className="text-xs text-primary hover:underline"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 칸반 뷰 */}
      {view === "kanban" && (
        <KanbanBoard
          selectedTemplateId={templateId}
          gradeFilter={gradeFilter}
          assigneeFilter={assigneeFilter}
        />
      )}

      {/* 리스트 뷰 */}
      {view === "list" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">고객</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">등급</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">현재 단계</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">진행률</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">담당자</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">상태</th>
              </tr>
            </thead>
            <tbody>
              {listData.map(({ customer, process }) => (
                <tr key={process.id} className="border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer" onClick={() => window.location.href = `/customers/${customer.id}`}>
                  <td className="px-4 py-3">
                    <Link href={`/customers/${customer.id}`} className="block">
                      <div className="text-sm font-medium text-foreground hover:text-primary">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.company}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <GradeBadge grade={customer.grade} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">{process.currentStageName}</div>
                    <div className="text-xs text-muted-foreground">
                      {process.currentStageOrder}/{process.totalStages}단계
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell w-[180px]">
                    <ProgressBar current={process.currentStageOrder} total={process.totalStages} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-foreground">
                    {customer.assigneeName}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {process.status === "in_progress" ? "진행중" : process.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {listData.length === 0 && (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              해당 프로세스에 배정된 고객이 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
