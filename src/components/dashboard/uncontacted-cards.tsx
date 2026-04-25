"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Phone, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradeBadge } from "@/components/common/grade-badge";
import { ProgressBar } from "@/components/common/progress-bar";
import { getDaysAgo, getUncontactedColor } from "@/lib/constants";
import { getUncontactedCustomers } from "@/lib/mock-data";

export function UncontactedCards() {
  const router = useRouter();
  const customers = getUncontactedCustomers(7);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-semibold text-foreground">
            1주일 이상 미연락 고객
          </h2>
          <span className="text-sm text-muted-foreground">
            ({customers.length}명)
          </span>
        </div>
        <Link
          href="/customers?filter=uncontacted"
          className="text-sm text-primary hover:underline"
        >
          전체보기
        </Link>
      </div>

      {customers.length === 0 ? (
        <Card className="rounded-xl border-dashed">
          <CardContent className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            미연락 고객이 없습니다
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {customers.map((customer) => {
            const days = getDaysAgo(customer.lastContactAt);
            const urgency = getUncontactedColor(days);
            const process = customer.processes[0];

            return (
              <Link key={customer.id} href={`/customers/${customer.id}`}>
                <Card className="rounded-xl border border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-5 flex flex-col gap-3">
                    {/* 상단: 이름 + 등급 */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-foreground">
                          {customer.name}
                        </div>
                        <div className="text-[13px] text-muted-foreground">
                          {customer.company} {customer.position}
                        </div>
                      </div>
                      <GradeBadge grade={customer.grade} />
                    </div>

                    {/* 프로세스 */}
                    {process && (
                      <div className="space-y-1.5">
                        <div className="text-xs text-muted-foreground">
                          {process.templateName}
                        </div>
                        <ProgressBar
                          current={process.currentStageOrder}
                          total={process.totalStages}
                        />
                        <div className="text-xs text-muted-foreground">
                          {process.currentStageOrder}/{process.totalStages}단계 · {process.currentStageName}
                        </div>
                      </div>
                    )}

                    {/* 미연락 뱃지 */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${urgency.bg} ${urgency.text}`}>
                      마지막 연락: {days}일 전
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigator.clipboard.writeText(customer.phone).then(() => {
                            alert(`${customer.phone} 복사됨`);
                          }).catch(() => {
                            window.prompt("전화번호:", customer.phone);
                          });
                        }}
                      >
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        연락
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push("/alimtalk");
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        알림톡
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
