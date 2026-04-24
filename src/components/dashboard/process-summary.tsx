"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProcessStats, MOCK_CUSTOMERS } from "@/lib/mock-data";

const PROCESS_COLORS: Record<string, string> = {
  "정부지원사업": "bg-blue-500",
  "정책자금": "bg-green-500",
  "창업지원": "bg-purple-500",
  "기술보증": "bg-orange-500",
};

export function ProcessSummary() {
  const stats = getProcessStats();
  const totalCustomers = MOCK_CUSTOMERS.length;
  const maxCount = Math.max(...stats.map((s) => s.count), 1);

  return (
    <Card className="rounded-xl border border-border">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-semibold">프로세스 현황</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        {stats.map((stat) => (
          <div key={stat.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{stat.name}</span>
              <span className="text-muted-foreground">{stat.count}명 진행 중</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${PROCESS_COLORS[stat.name] || "bg-primary"}`}
                style={{ width: `${(stat.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted-foreground">전체 고객</span>
          <span className="font-semibold text-foreground">{totalCustomers}명</span>
        </div>
      </CardContent>
    </Card>
  );
}
