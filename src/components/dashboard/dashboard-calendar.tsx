"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MiniCalendar } from "@/components/calendar/mini-calendar";
import { ScheduleList } from "@/components/calendar/schedule-list";
import { ScheduleModal } from "@/components/modals/schedule-modal";
import { MOCK_SCHEDULES } from "@/lib/mock-data";

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().split("T")[0];

  if (dateStr === todayKey) return "오늘";
  if (dateStr === tomorrowKey) return "내일";

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

export function DashboardCalendar() {
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const selectedSchedules = MOCK_SCHEDULES.filter((s) => s.date === selectedDate);
  const dateLabel = formatDateLabel(selectedDate);

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">일정 캘린더</h2>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setScheduleModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            일정 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 캘린더 */}
          <MiniCalendar
            schedules={MOCK_SCHEDULES}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* 선택 날짜 일정 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                {dateLabel} 일정
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  {selectedSchedules.length}건
                </span>
              </h4>
            </div>
            <ScheduleList
              schedules={selectedSchedules}
              emptyMessage="해당 날짜에 일정이 없습니다"
            />
          </div>
        </div>
      </CardContent>

      <ScheduleModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        defaultDate={selectedDate}
        onSubmit={(data) => {
          alert(`일정 "${data.title}" 등록 완료 (Mock)`);
        }}
      />
    </Card>
  );
}
