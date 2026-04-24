export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">파이프라인</h1>
        <p className="text-sm text-muted-foreground mt-1">칸반 보드가 여기에 표시됩니다</p>
      </div>
      <div className="flex items-center justify-center h-[40vh] bg-muted/30 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">준비 중입니다</p>
      </div>
    </div>
  );
}
