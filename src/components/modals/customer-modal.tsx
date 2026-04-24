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
import type { CustomerGrade } from "@/types";

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  grade: CustomerGrade;
  notes: string;
}

const INITIAL_FORM: CustomerFormData = {
  name: "",
  phone: "",
  email: "",
  company: "",
  position: "",
  grade: "NEW",
  notes: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CustomerFormData) => void;
  defaultValues?: Partial<CustomerFormData>;
  mode?: "create" | "edit";
}

export function CustomerModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: Props) {
  const [form, setForm] = useState<CustomerFormData>({
    ...INITIAL_FORM,
    ...defaultValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

  function handleChange(field: keyof CustomerFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "이름을 입력해주세요";
    if (!form.phone.trim()) newErrors.phone = "연락처를 입력해주세요";
    if (!form.company.trim()) newErrors.company = "회사명을 입력해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit?.(form);
    onOpenChange(false);
    setForm({ ...INITIAL_FORM });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "고객 등록" : "고객 정보 수정"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "새로운 고객 정보를 입력해주세요"
              : "고객 정보를 수정합니다"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* 이름 + 등급 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>등급</Label>
              <Select
                value={form.grade}
                onValueChange={(v) =>
                  handleChange("grade", (v ?? "NEW") as CustomerGrade)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">신규</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="A">A등급</SelectItem>
                  <SelectItem value="B">B등급</SelectItem>
                  <SelectItem value="C">C등급</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 연락처 + 이메일 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                연락처 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="010-1234-5678"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@email.com"
              />
            </div>
          </div>

          {/* 회사 + 직책 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company">
                회사 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="(주)회사명"
              />
              {errors.company && (
                <p className="text-xs text-red-500">{errors.company}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position">직책</Label>
              <Input
                id="position"
                value={form.position}
                onChange={(e) => handleChange("position", e.target.value)}
                placeholder="대표이사"
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">메모</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="고객에 대한 메모를 입력하세요"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          <Button onClick={handleSubmit}>
            {mode === "create" ? "등록" : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
