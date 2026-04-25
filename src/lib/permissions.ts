import type { UserRole } from "@/types";

/**
 * 역할별 권한 정의
 * - admin: 모든 기능
 * - manager: 팀 관리 + 고객 관리
 * - staff: 본인 담당 고객 관리
 * - viewer: 읽기 전용
 */

// 메뉴 접근 권한
const MENU_ACCESS: Record<string, UserRole[]> = {
  "/dashboard": ["admin", "manager", "staff", "viewer"],
  "/customers": ["admin", "manager", "staff", "viewer"],
  "/pipeline": ["admin", "manager", "staff", "viewer"],
  "/templates": ["admin", "manager", "staff"],
  "/alimtalk": ["admin", "manager", "staff"],
  "/tasks": ["admin", "manager", "staff", "viewer"],
  "/guide": ["admin", "manager", "staff", "viewer"],
  "/mypage": ["admin", "manager", "staff", "viewer"],
  "/settings": ["admin", "manager"],
};

// 기능별 권한
type Permission =
  | "customer:create"
  | "customer:edit"
  | "customer:delete"
  | "customer:assign"
  | "template:create"
  | "template:edit"
  | "template:delete"
  | "alimtalk:send"
  | "task:create"
  | "task:assign"
  | "user:manage"
  | "settings:edit";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "customer:create",
    "customer:edit",
    "customer:delete",
    "customer:assign",
    "template:create",
    "template:edit",
    "template:delete",
    "alimtalk:send",
    "task:create",
    "task:assign",
    "user:manage",
    "settings:edit",
  ],
  manager: [
    "customer:create",
    "customer:edit",
    "customer:delete",
    "customer:assign",
    "template:create",
    "template:edit",
    "template:delete",
    "alimtalk:send",
    "task:create",
    "task:assign",
  ],
  staff: [
    "customer:create",
    "customer:edit",
    "alimtalk:send",
    "task:create",
  ],
  viewer: [],
};

export function canAccessMenu(role: UserRole, path: string): boolean {
  const menuPath = Object.keys(MENU_ACCESS).find(
    (key) => path === key || path.startsWith(key + "/")
  );
  if (!menuPath) return true;
  return MENU_ACCESS[menuPath].includes(role);
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getMenuAccess() {
  return MENU_ACCESS;
}
