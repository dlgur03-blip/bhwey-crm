import type { CustomerGrade, UserRole, TaskPriority, ActivityType } from "@/types";

// ── 고객 등급 컬러 ──
export const GRADE_COLORS: Record<CustomerGrade, { bg: string; text: string }> = {
  VIP: { bg: "bg-amber-100", text: "text-amber-800" },
  A: { bg: "bg-blue-100", text: "text-blue-800" },
  B: { bg: "bg-green-100", text: "text-green-800" },
  C: { bg: "bg-gray-100", text: "text-gray-800" },
  NEW: { bg: "bg-purple-100", text: "text-purple-800" },
};

// ── 역할 라벨 ──
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "관리자",
  manager: "매니저",
  staff: "상담사",
  viewer: "뷰어",
};

// ── 우선순위 ──
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string }> = {
  high: { bg: "bg-red-100", text: "text-red-800" },
  medium: { bg: "bg-amber-100", text: "text-amber-800" },
  low: { bg: "bg-green-100", text: "text-green-800" },
};

// ── 활동 타입 ──
export const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; label: string; color: string }> = {
  phone: { icon: "Phone", label: "전화", color: "text-blue-500" },
  email: { icon: "Mail", label: "이메일", color: "text-indigo-500" },
  visit: { icon: "Building2", label: "방문", color: "text-green-500" },
  alimtalk: { icon: "MessageSquare", label: "알림톡", color: "text-yellow-500" },
  note: { icon: "StickyNote", label: "메모", color: "text-purple-500" },
  file: { icon: "Paperclip", label: "파일", color: "text-gray-500" },
  stage_change: { icon: "ArrowRight", label: "단계변경", color: "text-orange-500" },
  task_complete: { icon: "CheckCircle2", label: "업무완료", color: "text-green-600" },
};

// ── 미연락 일수 색상 ──
export function getUncontactedColor(days: number): { bg: string; text: string; label: string } {
  if (days >= 21) return { bg: "bg-red-50", text: "text-red-600", label: "긴급" };
  if (days >= 14) return { bg: "bg-orange-50", text: "text-orange-600", label: "주의" };
  return { bg: "bg-amber-50", text: "text-amber-600", label: "확인" };
}

// ── 날짜 유틸 ──
export function getDaysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatRelativeDate(dateStr: string): string {
  const days = getDaysAgo(dateStr);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return `${days}일 전`;
}
