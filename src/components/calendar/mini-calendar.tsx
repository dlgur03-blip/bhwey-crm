"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const SCHEDULE_TYPE_COLORS: Record<string, string> = {
  meeting: "bg-blue-500",
  call: "bg-green-500",
  deadline: "bg-red-500",
  visit: "bg-purple-500",
  other: "bg-gray-400",
};

interface Props {
  schedules: Schedule[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MiniCalendar({ schedules, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // 해당 월의 일정을 날짜별로 그룹핑
  const schedulesMap = useMemo(() => {
    const map: Record<string, Schedule[]> = {};
    for (const s of schedules) {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    }
    return map;
  }, [schedules]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function goToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onSelectDate(todayKey);
  }

  // 달력 그리드 생성
  const calendarDays: { day: number; dateKey: string; isCurrentMonth: boolean }[] = [];

  // 이전 달
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarDays.push({ day: d, dateKey: formatDateKey(y, m, d), isCurrentMonth: false });
  }

  // 현재 달
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, dateKey: formatDateKey(currentYear, currentMonth, d), isCurrentMonth: true });
  }

  // 다음 달 (6주 채우기)
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarDays.push({ day: d, dateKey: formatDateKey(y, m, d), isCurrentMonth: false });
  }

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {currentYear}년 {currentMonth + 1}월
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={goToday}>
            <span className="text-xs">오늘</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={cn(
              "text-center text-[10px] font-medium py-1",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-muted-foreground"
            )}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map(({ day, dateKey, isCurrentMonth }, idx) => {
          const daySchedules = schedulesMap[dateKey] || [];
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const dayOfWeek = idx % 7;

          return (
            <button
              key={`${dateKey}-${idx}`}
              onClick={() => onSelectDate(dateKey)}
              className={cn(
                "relative flex flex-col items-center py-1.5 rounded-lg transition-all text-xs",
                !isCurrentMonth && "opacity-30",
                isSelected && "bg-primary/10 ring-1 ring-primary/30",
                !isSelected && isCurrentMonth && "hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full text-xs",
                  isToday && "bg-primary text-white font-bold",
                  !isToday && dayOfWeek === 0 && "text-red-500",
                  !isToday && dayOfWeek === 6 && "text-blue-500",
                  !isToday && isCurrentMonth && dayOfWeek !== 0 && dayOfWeek !== 6 && "text-foreground",
                )}
              >
                {day}
              </span>
              {/* 일정 점 표시 */}
              {daySchedules.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {daySchedules.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className={cn("w-1 h-1 rounded-full", SCHEDULE_TYPE_COLORS[s.type])}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-3 pt-1 border-t border-border">
        {[
          { type: "meeting", label: "미팅" },
          { type: "call", label: "전화" },
          { type: "deadline", label: "기한" },
          { type: "visit", label: "방문" },
        ].map(({ type, label }) => (
          <div key={type} className="flex items-center gap-1">
            <div className={cn("w-1.5 h-1.5 rounded-full", SCHEDULE_TYPE_COLORS[type])} />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
