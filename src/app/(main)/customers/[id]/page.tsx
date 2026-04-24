"use client";

import { use } from "react";
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
import { GradeBadge } from "@/components/common/grade-badge";
import { ProgressBar } from "@/components/common/progress-bar";
import { ContactDaysBadge } from "@/components/common/contact-days-badge";
import { ActivityTimeline } from "@/components/customers/activity-timeline";
import { MOCK_CUSTOMERS, MOCK_ACTIVITIES, MOCK_TASKS } from "@/lib/mock-data";
import { formatRelativeDate, getDaysAgo } from "@/lib/constants";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">고객을 찾을 수 없습니다</p>
      </div>
    );
  }

  const activities = MOCK_ACTIVITIES.filter((a) => a.customerId === id);
  const tasks = MOCK_TASKS.filter((t) => t.customerId === id);
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
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1" />
            수정
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
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
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  {customer.email}
                </div>
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
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                연락 기록 추가
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 탭 콘텐츠 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="progress" className="space-y-4">
            <TabsList className="bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="progress" className="text-sm">진행현황</TabsTrigger>
              <TabsTrigger value="timeline" className="text-sm">타임라인</TabsTrigger>
              <TabsTrigger value="tasks" className="text-sm">업무</TabsTrigger>
              <TabsTrigger value="memo" className="text-sm">메모</TabsTrigger>
              <TabsTrigger value="files" className="text-sm">파일</TabsTrigger>
              <TabsTrigger value="alimtalk" className="text-sm">알림톡</TabsTrigger>
            </TabsList>

            {/* 진행현황 */}
            <TabsContent value="progress" className="space-y-4">
              {customer.processes.length === 0 ? (
                <Card className="rounded-xl border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p className="text-sm mb-3">진행 중인 프로세스가 없습니다</p>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      프로세스 추가
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                customer.processes.map((proc) => (
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
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                프로세스 추가
              </Button>
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
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                업무 추가
              </Button>
            </TabsContent>

            {/* 메모 */}
            <TabsContent value="memo">
              <Card className="rounded-xl">
                <CardContent className="p-5 text-center text-muted-foreground text-sm py-12">
                  <Pin className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                  아직 메모가 없습니다
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      메모 작성
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 파일 */}
            <TabsContent value="files">
              <Card className="rounded-xl">
                <CardContent className="p-5 text-center text-muted-foreground text-sm py-12">
                  <Paperclip className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                  첨부된 파일이 없습니다
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      파일 업로드
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 알림톡 */}
            <TabsContent value="alimtalk">
              <Card className="rounded-xl">
                <CardContent className="p-5 text-center text-muted-foreground text-sm py-12">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                  알림톡 발송 이력이 없습니다
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      알림톡 발송
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
