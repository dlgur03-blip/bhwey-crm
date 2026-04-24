"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import type { ScheduleType } from "@/types";

interface ScheduleFormData {
  title: string;
  type: ScheduleType;
  date: string;
  time: string;
  endTime: string;
  customerId: string;
  description: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ScheduleFormData) => void;
  defaultDate?: string;
}

const TYPE_OPTIONS: { value: ScheduleType; label: string }[] = [
  { value: "meeting", label: "미팅" },
  { value: "call", label: "전화" },
  { value: "visit", label: "방문" },
  { value: "deadline", label: "기한" },
  { value: "other", label: "기타" },
];

export function ScheduleModal({
  open,
  onOpenChange,
  onSubmit,
  defaultDate,
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<ScheduleFormData>({
    title: "",
    type: "meeting",
    date: defaultDate || today,
    time: "",
    endTime: "",
    customerId: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleFormData, string>>>({});

  function handleChange(field: keyof ScheduleFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ScheduleFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "제목을 입력해주세요";
    if (!form.date) newErrors.date = "날짜를 선택해주세요";
    if (!form.customerId) newErrors.customerId = "고객을 선택해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit?.(form);
    onOpenChange(false);
    setForm({
      title: "",
      type: "meeting",
      date: defaultDate || today,
      time: "",
      endTime: "",
      customerId: "",
      description: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>일정 추가</DialogTitle>
          <DialogDescription>새로운 일정을 등록합니다</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* 제목 */}
          <div className="space-y-1.5">
            <Label htmlFor="sch-title">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sch-title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="일정 제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* 유형 + 고객 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>유형</Label>
              <Select
                value={form.type}
                onValueChange={(v) => handleChange("type", v ?? "meeting")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                고객 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.customerId}
                onValueChange={(v) => handleChange("customerId", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="고객 선택" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CUSTOMERS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-xs text-red-500">{errors.customerId}</p>
              )}
            </div>
          </div>

          {/* 날짜 + 시간 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sch-date">
                날짜 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sch-date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sch-time">시작 시간</Label>
              <Input
                id="sch-time"
                type="time"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sch-endtime">종료 시간</Label>
              <Input
                id="sch-endtime"
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />
            </div>
          </div>

          {/* 설명 */}
          <div className="space-y-1.5">
            <Label htmlFor="sch-desc">설명</Label>
            <Textarea
              id="sch-desc"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="일정 설명을 입력하세요"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
