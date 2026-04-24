export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">업무 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">팀의 업무를 체계적으로 관리합니다</p>
      </div>
      <div className="flex items-center justify-center h-[40vh] bg-muted/30 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">준비 중입니다</p>
      </div>
    </div>
  );
}
