import { FileX, Search, Inbox, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyVariant = "default" | "search" | "noData" | "error";

const VARIANT_CONFIG: Record<EmptyVariant, { icon: typeof Inbox; defaultTitle: string; defaultDescription: string }> = {
  default: {
    icon: Inbox,
    defaultTitle: "데이터가 없습니다",
    defaultDescription: "아직 등록된 항목이 없습니다",
  },
  search: {
    icon: Search,
    defaultTitle: "검색 결과가 없습니다",
    defaultDescription: "다른 검색어로 시도해 보세요",
  },
  noData: {
    icon: FileX,
    defaultTitle: "데이터가 없습니다",
    defaultDescription: "새로운 항목을 추가해 보세요",
  },
  error: {
    icon: AlertCircle,
    defaultTitle: "오류가 발생했습니다",
    defaultDescription: "잠시 후 다시 시도해 주세요",
  },
};

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  variant = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
        <Icon className="w-8 h-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">
        {title || config.defaultTitle}
      </h3>
      <p className="text-xs text-muted-foreground max-w-[240px]">
        {description || config.defaultDescription}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
