"use client";

import { useState } from "react";
import {
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MOCK_ALIMTALK_TEMPLATES, MOCK_ALIMTALK_LOGS, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "대기", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  sent: { label: "발송", color: "bg-blue-100 text-blue-800", icon: Send },
  delivered: { label: "수신", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  failed: { label: "실패", color: "bg-red-100 text-red-800", icon: XCircle },
};

const TEMPLATE_STATUS: Record<string, { label: string; color: string }> = {
  approved: { label: "승인", color: "bg-green-100 text-green-800" },
  pending: { label: "검수중", color: "bg-yellow-100 text-yellow-800" },
  rejected: { label: "반려", color: "bg-red-100 text-red-800" },
};

export default function AlimtalkPage() {
  const [logSearch, setLogSearch] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [sendCustomer, setSendCustomer] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const [tplModalOpen, setTplModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<typeof MOCK_ALIMTALK_TEMPLATES[0] | null>(null);
  const [tplForm, setTplForm] = useState({ title: "", templateCode: "", content: "", variables: "" });

  const filteredLogs = MOCK_ALIMTALK_LOGS.filter((log) => {
    if (logSearch) {
      const q = logSearch.toLowerCase();
      if (!log.customerName.toLowerCase().includes(q) && !log.templateTitle.toLowerCase().includes(q)) return false;
    }
    if (logStatusFilter !== "all" && log.status !== logStatusFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  const stats = {
    total: MOCK_ALIMTALK_LOGS.length,
    delivered: MOCK_ALIMTALK_LOGS.filter((l) => l.status === "delivered").length,
    failed: MOCK_ALIMTALK_LOGS.filter((l) => l.status === "failed").length,
  };

  const logStatusLabels: Record<string, string> = {
    all: "전체 상태",
    pending: "대기",
    sent: "발송",
    delivered: "수신",
    failed: "실패",
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">알림톡</h1>
          <p className="text-sm text-muted-foreground mt-1">
            카카오 알림톡 템플릿 관리 및 발송
          </p>
        </div>
        <Button className="gap-2" onClick={() => setActiveTab("send")}>
          <Send className="w-4 h-4" />
          알림톡 발송
        </Button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground">전체 발송</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-xs text-muted-foreground">수신 완료</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
            <div className="text-xs text-muted-foreground">실패</div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v ?? "templates")} className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="templates" className="text-sm gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            템플릿 관리
          </TabsTrigger>
          <TabsTrigger value="send" className="text-sm gap-1.5">
            <Send className="w-3.5 h-3.5" />
            수동 발송
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-sm gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            발송 이력
          </TabsTrigger>
        </TabsList>

        {/* 템플릿 관리 */}
        <TabsContent value="templates" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              등록된 템플릿 {MOCK_ALIMTALK_TEMPLATES.length}개
            </span>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
              setEditingTpl(null);
              setTplForm({ title: "", templateCode: "", content: "", variables: "" });
              setTplModalOpen(true);
            }}>
              <Plus className="w-4 h-4" />
              템플릿 등록
            </Button>
          </div>

          {MOCK_ALIMTALK_TEMPLATES.map((tpl) => (
            <Card key={tpl.id} className="rounded-xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{tpl.title}</h3>
                    <Badge variant="secondary" className={cn("text-[10px]", TEMPLATE_STATUS[tpl.status].color)}>
                      {TEMPLATE_STATUS[tpl.status].label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{tpl.templateCode}</span>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                  {tpl.content}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tpl.variables.map((v) => (
                      <Badge key={v} variant="outline" className="text-[10px] font-mono">
                        {"#{" + v + "}"}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => {
                      setEditingTpl(tpl);
                      setTplForm({
                        title: tpl.title,
                        templateCode: tpl.templateCode,
                        content: tpl.content,
                        variables: tpl.variables.join(", "),
                      });
                      setTplModalOpen(true);
                    }}>수정</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive" onClick={() => { if (confirm(`"${tpl.title}" 템플릿을 삭제하시겠습니까?`)) alert("템플릿이 삭제되었습니다 (Mock)"); }}>삭제</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 수동 발송 */}
        <TabsContent value="send" className="space-y-4">
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-semibold text-foreground">알림톡 수동 발송</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 고객 선택 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">수신 고객</label>
                <Select value={sendCustomer} onValueChange={(v) => setSendCustomer(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue>
                      {sendCustomer ? MOCK_CUSTOMERS.find((c) => c.id === sendCustomer)?.name ?? "고객 선택" : "고객을 선택하세요"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CUSTOMERS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.company})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 템플릿 선택 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">템플릿</label>
                <Select value={selectedTemplate} onValueChange={(v) => setSelectedTemplate(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedTemplate ? MOCK_ALIMTALK_TEMPLATES.find((t) => t.id === selectedTemplate)?.title ?? "템플릿 선택" : "템플릿을 선택하세요"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ALIMTALK_TEMPLATES.filter((t) => t.status === "approved").map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 미리보기 */}
              {selectedTemplate && sendCustomer && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      미리보기
                    </label>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                        {(() => {
                          const tpl = MOCK_ALIMTALK_TEMPLATES.find((t) => t.id === selectedTemplate);
                          const cust = MOCK_CUSTOMERS.find((c) => c.id === sendCustomer);
                          if (!tpl || !cust) return "";
                          return tpl.content
                            .replace("#{고객명}", cust.name)
                            .replace("#{프로세스명}", cust.processes[0]?.templateName ?? "")
                            .replace("#{담당자명}", cust.assigneeName)
                            .replace("#{담당자연락처}", "010-9876-5432");
                        })()}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full gap-2"
                disabled={!selectedTemplate || !sendCustomer}
                onClick={() => {
                  const cust = MOCK_CUSTOMERS.find((c) => c.id === sendCustomer);
                  const tpl = MOCK_ALIMTALK_TEMPLATES.find((t) => t.id === selectedTemplate);
                  alert(`${cust?.name}님에게 "${tpl?.title}" 알림톡 발송 완료 (Mock)`);
                  setSendCustomer("");
                  setSelectedTemplate("");
                  setActiveTab("logs");
                }}
              >
                <Send className="w-4 h-4" />
                발송하기
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 발송 이력 */}
        <TabsContent value="logs" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="고객명, 템플릿명 검색..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={logStatusFilter} onValueChange={(v) => setLogStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-[130px]">
                <SelectValue>{logStatusLabels[logStatusFilter]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="sent">발송</SelectItem>
                <SelectItem value="delivered">수신</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">고객</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">템플릿</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">발송 시각</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const statusCfg = STATUS_CONFIG[log.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                      <td className="px-4 py-3">
                        <Link href={`/customers/${log.customerId}`} className="text-sm font-medium text-foreground hover:text-primary">
                          {log.customerName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-sm text-foreground">{log.templateTitle}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{log.content}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn("text-xs gap-1", statusCfg.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(log.sentAt).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                발송 이력이 없습니다
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 템플릿 등록/수정 모달 */}
      <Dialog open={tplModalOpen} onOpenChange={setTplModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTpl ? "템플릿 수정" : "템플릿 등록"}</DialogTitle>
            <DialogDescription>
              {editingTpl ? `"${editingTpl.title}" 템플릿을 수정합니다` : "새 알림톡 템플릿을 등록합니다"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">템플릿명</label>
                <Input
                  value={tplForm.title}
                  onChange={(e) => setTplForm({ ...tplForm, title: e.target.value })}
                  placeholder="예: 접수 완료 안내"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">템플릿 코드</label>
                <Input
                  value={tplForm.templateCode}
                  onChange={(e) => setTplForm({ ...tplForm, templateCode: e.target.value })}
                  placeholder="예: TPL-005"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">메시지 내용</label>
              <Textarea
                value={tplForm.content}
                onChange={(e) => setTplForm({ ...tplForm, content: e.target.value })}
                placeholder={"[BH WEY] #{고객명}님, 안녕하세요.\n메시지 내용을 입력하세요."}
                rows={5}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">변수 (쉼표 구분)</label>
              <Input
                value={tplForm.variables}
                onChange={(e) => setTplForm({ ...tplForm, variables: e.target.value })}
                placeholder="고객명, 프로세스명, 담당자명"
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">메시지 본문에서 {"#{변수명}"} 형태로 사용됩니다</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button onClick={() => {
              if (!tplForm.title || !tplForm.content) {
                alert("템플릿명과 메시지 내용을 입력해주세요");
                return;
              }
              alert(`템플릿 "${tplForm.title}" ${editingTpl ? "수정" : "등록"} 완료 (Mock)`);
              setTplModalOpen(false);
            }}>
              {editingTpl ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
