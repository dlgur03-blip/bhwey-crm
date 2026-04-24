// ── 고객 등급 ──
export type CustomerGrade = "VIP" | "A" | "B" | "C" | "NEW";

// ── 고객 유입경로 ──
export type CustomerSource = "소개" | "검색" | "광고" | "기타";

// ── 고객 ──
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  assigneeId: string;
  assigneeName: string;
  grade: CustomerGrade;
  tags: string[];
  // 사업자 정보
  bizNumber?: string;
  bizType?: string;
  bizCategory?: string;
  address?: string;
  foundedAt?: string;
  ceoName?: string;
  revenue?: number;
  employees?: number;
  // 추가 정보
  birthDate?: string;
  source?: CustomerSource;
  notes?: string;
  lastContactAt: string;
  createdAt: string;
  // 프로세스
  processes: CustomerProcess[];
}

// ── 프로세스 템플릿 ──
export interface ProcessTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  stages: TemplateStage[];
  isDefault: boolean;
}

export interface TemplateStage {
  id: string;
  order: number;
  name: string;
  description: string;
  checklist: string[];
}

// ── 고객-프로세스 ──
export type ProcessStatus = "waiting" | "in_progress" | "completed" | "failed";

export interface CustomerProcess {
  id: string;
  customerId: string;
  templateId: string;
  templateName: string;
  currentStageOrder: number;
  totalStages: number;
  currentStageName: string;
  status: ProcessStatus;
  startedAt: string;
  completedAt?: string;
  checklistStatus: Record<string, boolean>;
}

// ── 활동 ──
export type ActivityType =
  | "phone"
  | "email"
  | "visit"
  | "alimtalk"
  | "note"
  | "file"
  | "stage_change"
  | "task_complete";

export interface Activity {
  id: string;
  customerId: string;
  type: ActivityType;
  content: string;
  metadata?: Record<string, string>;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

// ── 업무 ──
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  processId?: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

// ── 메모 ──
export interface Note {
  id: string;
  customerId: string;
  content: string;
  isPinned: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

// ── 알림톡 ──
export type AlimtalkStatus = "pending" | "sent" | "delivered" | "failed";

export interface AlimtalkTemplate {
  id: string;
  templateCode: string;
  title: string;
  content: string;
  variables: string[];
  status: "approved" | "pending" | "rejected";
}

export interface AlimtalkLog {
  id: string;
  customerId: string;
  customerName: string;
  templateCode: string;
  templateTitle: string;
  content: string;
  status: AlimtalkStatus;
  sentAt: string;
  resultCode?: string;
}

// ── 사용자 ──
export type UserRole = "admin" | "manager" | "staff" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImg?: string;
  phone?: string;
  createdAt: string;
}
