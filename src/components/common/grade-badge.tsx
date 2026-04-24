import { cn } from "@/lib/utils";
import { GRADE_COLORS } from "@/lib/constants";
import type { CustomerGrade } from "@/types";

interface GradeBadgeProps {
  grade: CustomerGrade;
  className?: string;
}

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  const colors = GRADE_COLORS[grade];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {grade}
    </span>
  );
}
