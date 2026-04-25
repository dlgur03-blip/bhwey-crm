"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle,
  Save,
  X,
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
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface DbStage {
  id: string;
  template_id: string;
  stage_order: number;
  name: string;
  description: string;
  checklist: string[];
}

interface DbTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
  stages: DbStage[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<DbTemplate | null>(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#2563EB" });
  const [saving, setSaving] = useState(false);

  // 단계 추가 모달
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [stageTargetTplId, setStageTargetTplId] = useState<string | null>(null);
  const [stageForm, setStageForm] = useState({ name: "", description: "", checklist: "" });
  const [savingStage, setSavingStage] = useState(false);

  const loadTemplates = useCallback(async () => {
    const supabase = createClient();
    const { data: tplData } = await supabase
      .from("process_templates")
      .select("*")
      .order("created_at", { ascending: true });

    if (!tplData) { setLoading(false); return; }

    const { data: stageData } = await supabase
      .from("template_stages")
      .select("*")
      .order("stage_order", { ascending: true });

    const merged: DbTemplate[] = tplData.map((t) => ({
      ...t,
      stages: (stageData || []).filter((s) => s.template_id === t.id),
    }));

    setTemplates(merged);
    if (!expanded && merged.length > 0) setExpanded(merged[0].id);
    setLoading(false);
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  function toggleExpand(id: string) {
    setExpanded(expanded === id ? null : id);
  }

  // 템플릿 저장 (추가/수정)
  async function handleSave() {
    if (!form.name) return;
    setSaving(true);
    const supabase = createClient();

    if (editingTpl) {
      await supabase
        .from("process_templates")
        .update({ name: form.name, description: form.description, color: form.color })
        .eq("id", editingTpl.id);
    } else {
      await supabase
        .from("process_templates")
        .insert({ name: form.name, description: form.description, color: form.color });
    }

    setSaving(false);
    setModalOpen(false);
    loadTemplates();
  }

  // 템플릿 삭제
  async function handleDelete(tpl: DbTemplate) {
    if (!confirm(`"${tpl.name}" 템플릿을 삭제하시겠습니까?`)) return;
    const supabase = createClient();
    await supabase.from("process_templates").delete().eq("id", tpl.id);
    loadTemplates();
  }

  // 단계 추가
  async function handleAddStage() {
    if (!stageForm.name || !stageTargetTplId) return;
    setSavingStage(true);
    const supabase = createClient();

    // 현재 최대 order 구하기
    const tpl = templates.find((t) => t.id === stageTargetTplId);
    const maxOrder = tpl?.stages.reduce((max, s) => Math.max(max, s.stage_order), 0) ?? 0;

    const checklist = stageForm.checklist
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await supabase.from("template_stages").insert({
      template_id: stageTargetTplId,
      stage_order: maxOrder + 1,
      name: stageForm.name,
      description: stageForm.description,
      checklist,
    });

    setSavingStage(false);
    setStageModalOpen(false);
    setStageForm({ name: "", description: "", checklist: "" });
    loadTemplates();
  }

  // 단계 삭제
  async function handleDeleteStage(stageId: string) {
    if (!confirm("이 단계를 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("template_stages").delete().eq("id", stageId);
    loadTemplates();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">프로세스 템플릿</h1>
          <p className="text-sm text-muted-foreground mt-1">
            재사용 가능한 프로세스 템플릿을 관리합니다 ({templates.length}개)
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
        {templates.map((tpl) => {
          const isExpanded = expanded === tpl.id;
          const totalChecklist = tpl.stages.reduce((sum, s) => sum + s.checklist.length, 0);
          return (
            <Card key={tpl.id} className="rounded-xl overflow-hidden">
              {/* 카드 헤더 */}
              <div
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/50 transition-colors cursor-pointer"
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
                    {tpl.is_default && (
                      <Badge variant="secondary" className="text-[10px]">기본</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{tpl.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-xs">{tpl.stages.length}단계</Badge>
                    <span className="text-xs text-muted-foreground">
                      총 체크리스트 {totalChecklist}개
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
                      handleDelete(tpl);
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
              </div>

              {/* 단계 상세 */}
              {isExpanded && (
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="border-t border-border pt-4">
                    {/* 프로그레스 바 */}
                    {tpl.stages.length > 0 && (
                      <div className="flex gap-1 mb-4">
                        {tpl.stages.map((_, i) => (
                          <div
                            key={i}
                            className="h-2 flex-1 rounded-full"
                            style={{ backgroundColor: tpl.color, opacity: 0.3 + (i / tpl.stages.length) * 0.7 }}
                          />
                        ))}
                      </div>
                    )}

                    {/* 단계 목록 */}
                    <div className="space-y-3">
                      {tpl.stages.map((stage) => (
                        <div key={stage.id} className="flex gap-3 group">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                            style={{ backgroundColor: tpl.color }}
                          >
                            {stage.stage_order}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{stage.name}</span>
                              <button
                                onClick={() => handleDeleteStage(stage.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-destructive/10 rounded text-destructive transition-opacity"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{stage.description}</div>
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

                    {/* 단계 추가 버튼 */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 gap-1.5 text-xs"
                      onClick={() => {
                        setStageTargetTplId(tpl.id);
                        setStageForm({ name: "", description: "", checklist: "" });
                        setStageModalOpen(true);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      단계 추가
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {templates.length === 0 && !loading && (
        <Card className="rounded-xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm mb-3">등록된 템플릿이 없습니다</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingTpl(null);
                setForm({ name: "", description: "", color: "#2563EB" });
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              첫 번째 템플릿 만들기
            </Button>
          </CardContent>
        </Card>
      )}

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
            <Button className="gap-1.5" onClick={handleSave} disabled={saving || !form.name}>
              <Save className="w-4 h-4" />
              {saving ? "저장 중..." : editingTpl ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 단계 추가 모달 */}
      <Dialog open={stageModalOpen} onOpenChange={setStageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>단계 추가</DialogTitle>
            <DialogDescription>
              새로운 단계를 추가합니다. 체크리스트는 콤마(,)로 구분하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">단계명</label>
              <Input
                value={stageForm.name}
                onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                placeholder="예: 서류 준비"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">설명</label>
              <Input
                value={stageForm.description}
                onChange={(e) => setStageForm({ ...stageForm, description: e.target.value })}
                placeholder="이 단계에서 수행할 작업 설명"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">체크리스트</label>
              <Textarea
                value={stageForm.checklist}
                onChange={(e) => setStageForm({ ...stageForm, checklist: e.target.value })}
                placeholder="항목1, 항목2, 항목3"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">콤마(,)로 구분하여 입력</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button className="gap-1.5" onClick={handleAddStage} disabled={savingStage || !stageForm.name}>
              <Plus className="w-4 h-4" />
              {savingStage ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
