"use client";

import {
  Phone,
  Mail,
  Building2,
  MessageSquare,
  StickyNote,
  Paperclip,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/constants";
import type { Activity, ActivityType } from "@/types";

const ICON_MAP: Record<ActivityType, typeof Phone> = {
  phone: Phone,
  email: Mail,
  visit: Building2,
  alimtalk: MessageSquare,
  note: StickyNote,
  file: Paperclip,
  stage_change: ArrowRight,
  task_complete: CheckCircle2,
};

const COLOR_MAP: Record<ActivityType, string> = {
  phone: "text-blue-500 bg-blue-50",
  email: "text-indigo-500 bg-indigo-50",
  visit: "text-green-500 bg-green-50",
  alimtalk: "text-yellow-600 bg-yellow-50",
  note: "text-purple-500 bg-purple-50",
  file: "text-gray-500 bg-gray-100",
  stage_change: "text-orange-500 bg-orange-50",
  task_complete: "text-green-600 bg-green-50",
};

const LABEL_MAP: Record<ActivityType, string> = {
  phone: "전화",
  email: "이메일",
  visit: "방문",
  alimtalk: "알림톡",
  note: "메모",
  file: "파일",
  stage_change: "단계변경",
  task_complete: "업무완료",
};

interface Props {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: Props) {
  // 날짜별 그룹핑
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, act) => {
    const date = act.createdAt.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(act);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        활동 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="text-xs font-medium text-muted-foreground mb-3">
            {date}
          </div>
          <div className="space-y-3 ml-1">
            {grouped[date]
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((act) => {
                const Icon = ICON_MAP[act.type];
                const colorClass = COLOR_MAP[act.type];
                const time = act.createdAt.split("T")[1]?.slice(0, 5) || "";

                return (
                  <div key={act.id} className="flex items-start gap-3 relative">
                    {/* 타임라인 선 */}
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />

                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg z-10 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{time}</span>
                        <span>{LABEL_MAP[act.type]}</span>
                        <span>({act.createdByName})</span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{act.content}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
