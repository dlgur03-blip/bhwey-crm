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
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ACTIVITIES } from "@/lib/mock-data";
import { formatRelativeDate } from "@/lib/constants";
import type { ActivityType } from "@/types";

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

export function RecentActivity() {
  const activities = MOCK_ACTIVITIES.slice(0, 6);

  return (
    <Card className="rounded-xl border border-border">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-semibold">최근 활동</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-3">
        {activities.map((act) => {
          const Icon = ICON_MAP[act.type];
          const colorClass = COLOR_MAP[act.type];

          return (
            <div key={act.id} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {LABEL_MAP[act.type]}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {act.createdByName}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-0.5 line-clamp-1">
                  {act.content}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                {formatRelativeDate(act.createdAt)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
