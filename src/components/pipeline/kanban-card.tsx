"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GradeBadge } from "@/components/common/grade-badge";
import { getDaysAgo } from "@/lib/constants";
import type { Customer, CustomerProcess } from "@/types";

interface Props {
  customer: Customer;
  process: CustomerProcess;
}

export function KanbanCard({ customer, process }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${customer.id}-${process.id}`,
    data: { customer, process },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stageEnteredDays = getDaysAgo(process.startedAt);
  const checklist = Object.entries(process.checklistStatus);
  const done = checklist.filter(([, v]) => v).length;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="rounded-lg border border-border hover:shadow-md transition-shadow cursor-default">
        <CardContent className="p-3 space-y-2">
          {/* 상단: 드래그 + 이름 + 등급 */}
          <div className="flex items-start gap-2">
            <button
              className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <Link
                href={`/customers/${customer.id}`}
                className="text-sm font-medium text-foreground hover:text-primary"
              >
                {customer.name}
              </Link>
              <div className="text-xs text-muted-foreground">{customer.company}</div>
            </div>
            <GradeBadge grade={customer.grade} />
          </div>

          {/* 담당자 + 체류일수 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>담당: {customer.assigneeName}</span>
            <span className="font-medium">D+{stageEnteredDays}</span>
          </div>

          {/* 체크리스트 */}
          {checklist.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className={done === checklist.length ? "text-green-500" : "text-muted-foreground"}>
                {done === checklist.length ? "✓" : "○"}
              </span>
              <span className="text-muted-foreground">
                {done}/{checklist.length} 완료
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
