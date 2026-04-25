"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  MapPin,
  Star,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { GradeBadge } from "@/components/common/grade-badge";
import { ProgressBar } from "@/components/common/progress-bar";
import { ContactDaysBadge } from "@/components/common/contact-days-badge";
import { ActivityTimeline } from "@/components/customers/activity-timeline";
import { CustomerModal } from "@/components/modals/customer-modal";
import { ScheduleModal } from "@/components/modals/schedule-modal";
import { MOCK_CUSTOMERS, MOCK_ACTIVITIES, MOCK_TASKS, MOCK_NOTES, MOCK_FILES, MOCK_ALIMTALK_LOGS, MOCK_SCHEDULES } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import type { CustomerProcess } from "@/types";
import { ScheduleList } from "@/components/calendar/schedule-list";
import { formatRelativeDate, getDaysAgo } from "@/lib/constants";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
  const router = useRouter();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

  // Supabase 연동: 템플릿 + 고객 프로세스
  interface DbTplRow { id: string; name: string; description: string; color: string; stages: { id: string; stage_order: number; name: string; checklist: string[] }[] }
  const [dbTemplates, setDbTemplates] = useState<DbTplRow[]>([]);
  const [dbProcesses, setDbProcesses] = useState<CustomerProcess[]>([]);
  const [addingProcess, setAddingProcess] = useState(false);

  const loadDbData = useCallback(async () => {
    const supabase = createClient();
    // 템플릿 + 단계 로드
    const { data: tpls } = await supabase.from("process_templates").select("*").order("created_at");
    const { data: stages } = await supabase.from("template_stages").select("*").order("stage_order");
    if (tpls) {
      setDbTemplates(tpls.map((t: Record<string, unknown>) => ({
        ...t,
        stages: (stages || []).filter((s: Record<string, unknown>) => s.template_id === t.id),
      })) as DbTplRow[]);
    }
    // 이 고객의 프로세스 로드
    const { data: procs } = await supabase
      .from("customer_processes")
      .select("*")
      .eq("customer_id", id)
      .order("created_at");
    if (procs) {
      setDbProcesses(procs.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        customerId: p.customer_id as string,
        templateId: p.template_id as string,
        templateName: p.template_name as string,
        currentStageOrder: p.current_stage_order as number,
        totalStages: p.total_stages as number,
        currentStageName: p.current_stage_name as string,
        status: p.status as CustomerProcess["status"],
        startedAt: p.started_at as string,
        completedAt: p.completed_at as string | undefined,
        checklistStatus: (p.checklist_status || {}) as Record<string, boolean>,
      })));
    }
  }, [id]);

  useEffect(() => { loadDbData(); }, [loadDbData]);

  async function handleAddProcess(tpl: DbTplRow) {
    setAddingProcess(true);
    const supabase = createClient();
    const firstStage = tpl.stages[0];
    const initialChecklist: Record<string, boolean> = {};
    if (firstStage) {
      firstStage.checklist.forEach((item: string) => { initialChecklist[item] = false; });
    }
    await supabase.from("customer_processes").insert({
      customer_id: id,
      template_id: tpl.id,
      template_name: tpl.name,
      current_stage_order: 1,
      total_stages: tpl.stages.length,
      current_stage_name: firstStage?.name || tpl.name,
      status: "in_progress",
      checklist_status: initialChecklist,
    });
    setAddingProcess(false);
    setProcessModalOpen(false);
    loadDbData();
  }

  // mock 프로세스 + DB 프로세스 합치기
  const allProcesses = [...(customer?.processes || []), ...dbProcesses];

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">고객을 찾을 수 없습니다</p>
      </div>
    );
  }

  const activities = MOCK_ACTIVITIES.filter((a) => a.customerId === id);
  const tasks = MOCK_TASKS.filter((t) => t.customerId === id);
  const notes = MOCK_NOTES.filter((n) => n.customerId === id).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const files = MOCK_FILES.filter((f) => f.customerId === id);
  const alimtalkLogs = MOCK_ALIMTALK_LOGS.filter((l) => l.customerId === id);
  const schedules = MOCK_SCHEDULES.filter((s) => s.customerId === id);
  const pastSchedules = schedules.filter((s) => s.date < new Date().toISOString().split("T")[0] || s.isCompleted).sort((a, b) => b.date.localeCompare(a.date));
  const upcomingSchedules = schedules.filter((s) => s.date >= new Date().toISOString().split("T")[0] && !s.isCompleted).sort((a, b) => a.date.localeCompare(b.date));
  const daysAgo = getDaysAgo(customer.lastContactAt);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              고객 목록
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
          <GradeBadge grade={customer.grade} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-1" />
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            삭제
          </Button>
        </div>
      </div>

      {/* 2열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 기본 정보 */}
        <div className="space-y-4">
          <Card className="rounded-xl">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                기본 정보
              </h3>
              <div className="space-y-3 text-sm">
                <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  {customer.phone}
                </a>
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  {customer.email}
                </a>
                <div className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  {customer.company} · {customer.position}
                </div>
                {customer.address && (
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs">{customer.address}</span>
                  </div>
                )}
              </div>

              {/* 태그 */}
              {customer.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    {customer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}

              {/* 담당자 */}
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">담당자</span>
                <span className="font-medium text-foreground">{customer.assigneeName}</span>
              </div>
            </CardContent>
          </Card>

          {/* 사업자 정보 */}
          {customer.bizNumber && (
            <Card className="rounded-xl">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">사업자 정보</h3>
                <div className="space-y-2 text-sm">
                  <InfoRow label="사업자번호" value={customer.bizNumber} />
                  {customer.bizType && <InfoRow label="업태" value={customer.bizType} />}
                  {customer.bizCategory && <InfoRow label="업종" value={customer.bizCategory} />}
                  {customer.ceoName && <InfoRow label="대표자" value={customer.ceoName} />}
                  {customer.revenue && <InfoRow label="매출" value={`${(customer.revenue / 10000).toFixed(0)}억원`} />}
                  {customer.employees && <InfoRow label="종업원" value={`${customer.employees}명`} />}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 마지막 연락 */}
          <Card className="rounded-xl">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                마지막 연락
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{customer.lastContactAt}</span>
                <ContactDaysBadge lastContactAt={customer.lastContactAt} />
              </div>
              <a href={`tel:${customer.phone}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  연락 기록 추가
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 탭 콘텐츠 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="progress" className="space-y-4">
            <TabsList className="bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="progress" className="text-sm">진행현황</TabsTrigger>
              <TabsTrigger value="schedule" className="text-sm">일정</TabsTrigger>
              <TabsTrigger value="timeline" className="text-sm">타임라인</TabsTrigger>
              <TabsTrigger value="tasks" className="text-sm">업무</TabsTrigger>
              <TabsTrigger value="memo" className="text-sm">메모</TabsTrigger>
              <TabsTrigger value="files" className="text-sm">파일</TabsTrigger>
              <TabsTrigger value="alimtalk" className="text-sm">알림톡</TabsTrigger>
            </TabsList>

            {/* 진행현황 */}
            <TabsContent value="progress" className="space-y-4">
              {allProcesses.length === 0 ? (
                <Card className="rounded-xl border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p className="text-sm mb-3">진행 중인 프로세스가 없습니다</p>
                    <Button variant="outline" size="sm" onClick={() => setProcessModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      프로세스 추가
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                allProcesses.map((proc) => (
                  <Card key={proc.id} className="rounded-xl">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{proc.templateName}</h4>
                          <Badge
                            variant="secondary"
                            className={
                              proc.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : proc.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {proc.status === "in_progress" ? "진행중" : proc.status === "completed" ? "완료" : "대기"}
                          </Badge>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          {Math.round((proc.currentStageOrder / proc.totalStages) * 100)}%
                        </span>
                      </div>

                      <ProgressBar current={proc.currentStageOrder} total={proc.totalStages} />

                      {/* 단계 표시 */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: proc.totalStages }, (_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full ${
                              i < proc.currentStageOrder ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">현재: </span>
                          <span className="font-medium text-foreground">{proc.currentStageName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {proc.currentStageOrder}/{proc.totalStages}단계
                        </span>
                      </div>

                      {/* 체크리스트 */}
                      {Object.keys(proc.checklistStatus).length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-border">
                          <span className="text-xs font-medium text-muted-foreground">체크리스트</span>
                          {Object.entries(proc.checklistStatus).map(([item, done]) => (
                            <div key={item} className="flex items-center gap-2 text-sm">
                              <span className={done ? "text-green-500" : "text-muted-foreground"}>
                                {done ? "✓" : "○"}
                              </span>
                              <span className={done ? "text-foreground line-through" : "text-foreground"}>
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
              <Button variant="outline" className="w-full" onClick={() => setProcessModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                프로세스 추가
              </Button>
            </TabsContent>

            {/* 일정 */}
            <TabsContent value="schedule" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  전체 일정 <span className="text-muted-foreground font-normal">{schedules.length}건</span>
                </h3>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setScheduleModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  일정 추가
                </Button>
              </div>

              {/* 예정 일정 */}
              {upcomingSchedules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-primary flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    다가오는 일정 ({upcomingSchedules.length})
                  </h4>
                  {upcomingSchedules.map((s) => (
                    <Card key={s.id} className="rounded-xl border-primary/20 bg-primary/5">
                      <CardContent className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-primary font-medium">{s.date} {s.time && `${s.time}${s.endTime ? ` ~ ${s.endTime}` : ""}`}</span>
                          <Badge variant="secondary" className="text-[10px]">{s.type === "meeting" ? "미팅" : s.type === "call" ? "전화" : s.type === "deadline" ? "기한" : s.type === "visit" ? "방문" : "기타"}</Badge>
                        </div>
                        <div className="text-sm font-medium text-foreground">{s.title}</div>
                        {s.description && <div className="text-xs text-muted-foreground">{s.description}</div>}
                        <div className="text-xs text-muted-foreground">담당: {s.assigneeName}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* 과거 일정 */}
              {pastSchedules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    지난 일정 ({pastSchedules.length})
                  </h4>
                  {pastSchedules.map((s) => (
                    <Card key={s.id} className="rounded-xl opacity-70">
                      <CardContent className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{s.date} {s.time || ""}</span>
                          <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">완료</Badge>
                        </div>
                        <div className="text-sm font-medium text-foreground line-through">{s.title}</div>
                        {s.description && <div className="text-xs text-muted-foreground">{s.description}</div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {schedules.length === 0 && (
                <Card className="rounded-xl border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Calendar className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm mb-1">등록된 일정이 없습니다</p>
                    <p className="text-xs">일정 추가 버튼으로 새 일정을 등록하세요</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 타임라인 */}
            <TabsContent value="timeline">
              <Card className="rounded-xl">
                <CardContent className="p-5">
                  <ActivityTimeline activities={activities} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 업무 */}
            <TabsContent value="tasks" className="space-y-3">
              {tasks.length === 0 ? (
                <Card className="rounded-xl border-dashed">
                  <CardContent className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                    연결된 업무가 없습니다
                  </CardContent>
                </Card>
              ) : (
                tasks.map((task) => (
                  <Card key={task.id} className="rounded-xl">
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className={`text-lg ${task.status === "completed" ? "text-green-500" : "text-muted-foreground"}`}>
                        {task.status === "completed" ? "✓" : "○"}
                      </span>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          마감: {task.dueDate} · {task.assigneeName}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <Button variant="outline" className="w-full" onClick={() => router.push("/tasks")}>
                <Plus className="w-4 h-4 mr-2" />
                업무 추가
              </Button>
            </TabsContent>

            {/* 메모 */}
            <TabsContent value="memo" className="space-y-3">
              {notes.length === 0 ? (
                <Card className="rounded-xl">
                  <CardContent className="p-5 text-center text-muted-foreground text-sm py-12">
                    <Pin className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                    아직 메모가 없습니다
                  </CardContent>
                </Card>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="rounded-xl">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {note.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {note.createdByName} · {new Date(note.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                            onClick={() => alert("메모 수정 기능은 준비 중입니다")}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (confirm("이 메모를 삭제하시겠습니까?")) {
                                alert("메모가 삭제되었습니다 (Mock)");
                              }
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
              <Button variant="outline" className="w-full" onClick={() => setNoteModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                메모 작성
              </Button>
            </TabsContent>

            {/* 파일 */}
            <TabsContent value="files" className="space-y-3">
              {files.length === 0 ? (
                <Card className="rounded-xl">
                  <CardContent className="p-5 text-center text-muted-foreground text-sm py-12">
                    <Paperclip className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                    첨부된 파일이 없습니다
                  </CardContent>
                </Card>
              ) : (
                files.map((file) => (
                  <Card key={file.id} className="rounded-xl">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileIcon ext={file.name.split(".").pop() || ""} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} · {file.uploadedByName} · {new Date(file.uploadedAt).toLocaleDateString("ko-KR")}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary shrink-0"
                        onClick={() => {
                          const blob = new Blob(["(Mock 파일 내용)"], { type: "application/octet-stream" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = file.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        다운로드
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
              <Button variant="outline" className="w-full" onClick={() => setFileUploadOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                파일 업로드
              </Button>
            </TabsContent>

            {/* 알림톡 */}
            <TabsContent value="alimtalk" className="space-y-3">
              {alimtalkLogs.length === 0 ? (
                <Card className="rounded-xl">
                  <CardContent className="p-5 text-center text-muted-foreground text-sm py-12">
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                    알림톡 발송 이력이 없습니다
                  </CardContent>
                </Card>
              ) : (
                alimtalkLogs.map((log) => {
                  const statusMap: Record<string, { label: string; color: string }> = {
                    pending: { label: "대기", color: "bg-yellow-100 text-yellow-800" },
                    sent: { label: "발송", color: "bg-blue-100 text-blue-800" },
                    delivered: { label: "수신", color: "bg-green-100 text-green-800" },
                    failed: { label: "실패", color: "bg-red-100 text-red-800" },
                  };
                  const st = statusMap[log.status] || statusMap.pending;
                  return (
                    <Card key={log.id} className="rounded-xl">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{log.templateTitle}</span>
                          <Badge variant="secondary" className={`text-[10px] ${st.color}`}>{st.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.content}</p>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.sentAt).toLocaleString("ko-KR")}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
              <Button variant="outline" className="w-full" onClick={() => router.push("/alimtalk")}>
                <Plus className="w-4 h-4 mr-2" />
                알림톡 발송
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 고객 수정 모달 */}
      <CustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        mode="edit"
        defaultValues={{
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          company: customer.company,
          position: customer.position,
          grade: customer.grade,
          notes: "",
        }}
        onSubmit={(data) => {
          alert(`고객 정보 수정 완료: ${data.name}`);
        }}
      />

      {/* 일정 추가 모달 */}
      <ScheduleModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        onSubmit={(data) => {
          alert(`일정 등록 완료: ${data.title}`);
        }}
      />

      {/* 삭제 확인 모달 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>고객 삭제</DialogTitle>
            <DialogDescription>
              {customer.name} 고객을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteConfirmOpen(false);
                alert("고객이 삭제되었습니다 (Mock)");
                router.push("/customers");
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메모 작성 모달 */}
      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>메모 작성</DialogTitle>
            <DialogDescription>{customer.name} 고객에 대한 메모를 작성합니다</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="메모 내용을 입력하세요"
              rows={4}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button
              onClick={() => {
                if (noteInput.trim()) {
                  alert(`메모 저장 완료: "${noteInput.slice(0, 30)}..."`);
                  setNoteInput("");
                  setNoteModalOpen(false);
                }
              }}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로세스 추가 모달 */}
      <Dialog open={processModalOpen} onOpenChange={setProcessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로세스 추가</DialogTitle>
            <DialogDescription>{customer.name} 고객에게 적용할 프로세스 템플릿을 선택하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {dbTemplates.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                등록된 템플릿이 없습니다. 먼저 템플릿을 추가해주세요.
              </div>
            ) : (
              dbTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-left transition-colors disabled:opacity-50"
                  onClick={() => handleAddProcess(tpl)}
                  disabled={addingProcess}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: tpl.color }}
                  >
                    {tpl.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{tpl.name}</div>
                    <div className="text-xs text-muted-foreground">{tpl.description}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tpl.stages.length}단계</div>
                  </div>
                </button>
              ))
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 파일 업로드 모달 */}
      <Dialog open={fileUploadOpen} onOpenChange={setFileUploadOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogDescription>{customer.name} 고객 관련 파일을 첨부합니다</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <Plus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">파일을 선택하세요</span>
              <span className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, 이미지 등</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    alert(`"${file.name}" 업로드 완료 (Mock)`);
                    setFileUploadOpen(false);
                  }
                }}
              />
            </label>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function FileIcon({ ext }: { ext: string }) {
  const colors: Record<string, string> = {
    pdf: "text-red-500",
    xlsx: "text-green-600",
    xls: "text-green-600",
    doc: "text-blue-600",
    docx: "text-blue-600",
    jpg: "text-purple-500",
    jpeg: "text-purple-500",
    png: "text-purple-500",
  };
  return (
    <span className={`text-xs font-bold uppercase ${colors[ext] || "text-primary"}`}>
      {ext}
    </span>
  );
}

function Paperclip(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
