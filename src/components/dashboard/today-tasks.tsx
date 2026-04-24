"use client";

import { CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_COLORS } from "@/lib/constants";
import { getTodayTasks } from "@/lib/mock-data";

export function TodayTasks() {
  const tasks = getTodayTasks();
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <Card className="rounded-xl border border-border">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">오늘의 업무</CardTitle>
          </div>
          <span className="text-sm text-muted-foreground">
            {completed}/{tasks.length} 완료
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-2">
        {tasks.map((task) => {
          const pColor = PRIORITY_COLORS[task.priority];
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <Checkbox
                checked={task.status === "completed"}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.customerName && (
                    <span className="font-medium">{task.customerName}</span>
                  )}
                  {task.customerName && " - "}
                  {task.title}
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-[11px] px-1.5 py-0 ${pColor.bg} ${pColor.text} border-0`}
              >
                {task.priority === "high" ? "긴급" : task.priority === "medium" ? "보통" : "낮음"}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {task.status === "completed" ? "완료" : `마감: ${task.dueDate.slice(5)}`}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
