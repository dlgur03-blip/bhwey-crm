import { UncontactedCards } from "@/components/dashboard/uncontacted-cards";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { ProcessSummary } from "@/components/dashboard/process-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-1">
          고객 현황과 오늘의 업무를 한눈에 확인하세요
        </p>
      </div>

      {/* 미연락 고객 (최상단, 핵심) */}
      <UncontactedCards />

      {/* 하단 2열: 업무 + 프로세스/활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTasks />
        <div className="space-y-6">
          <ProcessSummary />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
