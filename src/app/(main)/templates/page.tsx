"use client";

import { useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { MOCK_TEMPLATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const [expanded, setExpanded] = useState<string | null>(MOCK_TEMPLATES[0]?.id ?? null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<typeof MOCK_TEMPLATES[0] | null>(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#2563EB" });

  function toggleExpand(id: string) {
    setExpanded(expanded === id ? null : id);
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">프로세스 템플릿</h1>
          <p className="text-sm text-muted-foreground mt-1">
            재사용 가능한 프로세스 템플릿을 관리합니다 ({MOCK_TEMPLATES.length}개)
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingTpl(null);
            setForm({ name: "", description: "", color: "#2563EB" });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          템플릿 추가
        </Button>
      </div>

      {/* 템플릿 카드 목록 */}
      <div className="space-y-4">
        {MOCK_TEMPLATES.map((tpl) => {
          const isExpanded = expanded === tpl.id;
          return (
            <Card key={tpl.id} className="rounded-xl overflow-hidden">
              {/* 카드 헤더 */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/50 transition-colors"
                onClick={() => toggleExpand(tpl.id)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: tpl.color }}
                >
                  {tpl.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{tpl.name}</h3>
                    {tpl.isDefault && (
                      <Badge variant="secondary" className="text-[10px]">기본</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{tpl.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-xs">{tpl.stages.length}단계</Badge>
                    <span className="text-xs text-muted-foreground">
                      총 체크리스트 {tpl.stages.reduce((sum, s) => sum + s.checklist.length, 0)}개
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTpl(tpl);
                      setForm({ name: tpl.name, description: tpl.description, color: tpl.color });
                      setModalOpen(true);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`"${tpl.name}" 템플릿을 삭제하시겠습니까?`)) {
                        alert("템플릿이 삭제되었습니다 (Mock)");
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* 단계 상세 */}
              {isExpanded && (
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="border-t border-border pt-4">
                    {/* 프로그레스 바 */}
                    <div className="flex gap-1 mb-4">
                      {tpl.stages.map((_, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 rounded-full"
                          style={{ backgroundColor: tpl.color, opacity: 0.3 + (i / tpl.stages.length) * 0.7 }}
                        />
                      ))}
                    </div>

                    {/* 단계 목록 */}
                    <div className="space-y-3">
                      {tpl.stages.map((stage) => (
                        <div key={stage.id} className="flex gap-3">
                          {/* 단계 번호 */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                            style={{ backgroundColor: tpl.color }}
                          >
                            {stage.order}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{stage.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{stage.description}</div>
                            {/* 체크리스트 */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {stage.checklist.map((item) => (
                                <span
                                  key={item}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* 템플릿 추가/수정 모달 */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTpl ? "템플릿 수정" : "템플릿 추가"}</DialogTitle>
            <DialogDescription>
              {editingTpl
                ? `"${editingTpl.name}" 템플릿 정보를 수정합니다`
                : "새 프로세스 템플릿을 등록합니다. 단계는 생성 후 추가할 수 있습니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">템플릿명</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="예: 정부지원사업"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">설명</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="프로세스에 대한 간단한 설명"
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">컬러</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <span className="text-sm font-mono text-muted-foreground">{form.color}</span>
                <div className="flex gap-1.5">
                  {["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#DC2626", "#0891B2"].map((c) => (
                    <button
                      key={c}
                      className={cn(
                        "w-7 h-7 rounded-lg border-2 transition-colors",
                        form.color === c ? "border-foreground" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => setForm({ ...form, color: c })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button
              className="gap-1.5"
              onClick={() => {
                if (!form.name) {
                  alert("템플릿명을 입력해주세요");
                  return;
                }
                alert(`템플릿 "${form.name}" ${editingTpl ? "수정" : "등록"} 완료 (Mock)`);
                setModalOpen(false);
              }}
            >
              <Save className="w-4 h-4" />
              {editingTpl ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
