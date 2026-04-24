"use client";

import { Clock, Phone, MapPin, Calendar, AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Schedule } from "@/types";

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Calendar; color: string; bgColor: string }> = {
  meeting: { label: "미팅", icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  call: { label: "전화", icon: Phone, color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  deadline: { label: "기한", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  visit: { label: "방문", icon: MapPin, color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
  other: { label: "기타", icon: Calendar, color: "text-gray-600", bgColor: "bg-gray-50 border-gray-200" },
};

interface Props {
  schedules: Schedule[];
  title?: string;
  showCustomerLink?: boolean;
  emptyMessage?: string;
}

export function ScheduleList({ schedules, title, showCustomerLink = true, emptyMessage = "일정이 없습니다" }: Props) {
  if (schedules.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // 시간순 정렬
  const sorted = [...schedules].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  return (
    <div className="space-y-2">
      {title && (
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h4>
      )}
      {sorted.map((schedule) => {
        const config = TYPE_CONFIG[schedule.type];
        const Icon = config.icon;
        const StatusIcon = schedule.isCompleted ? CheckCircle2 : Circle;

        return (
          <div
            key={schedule.id}
            className={cn(
              "rounded-xl border p-3 space-y-1.5 transition-colors",
              schedule.isCompleted ? "bg-muted/30 border-border opacity-70" : config.bgColor
            )}
          >
            {/* 상단: 타입 뱃지 + 시간 + 완료 상태 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn("text-[10px] gap-1", config.color)}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </Badge>
                {schedule.time && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {schedule.time}
                    {schedule.endTime && ` ~ ${schedule.endTime}`}
                  </span>
                )}
              </div>
              <StatusIcon className={cn("w-4 h-4", schedule.isCompleted ? "text-green-500" : "text-muted-foreground/40")} />
            </div>

            {/* 제목 */}
            <div className={cn("text-sm font-medium", schedule.isCompleted && "line-through text-muted-foreground")}>
              {schedule.title}
            </div>

            {/* 설명 */}
            {schedule.description && (
              <div className="text-xs text-muted-foreground line-clamp-2">
                {schedule.description}
              </div>
            )}

            {/* 하단: 고객 + 담당자 */}
            <div className="flex items-center justify-between text-xs">
              {showCustomerLink ? (
                <Link
                  href={`/customers/${schedule.customerId}`}
                  className="text-primary hover:underline font-medium"
                >
                  {schedule.customerName}
                </Link>
              ) : (
                <span className="text-muted-foreground">{schedule.customerName}</span>
              )}
              <span className="text-muted-foreground">담당: {schedule.assigneeName}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
