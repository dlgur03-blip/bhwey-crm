import { cn } from "@/lib/utils";
import { getDaysAgo, getUncontactedColor } from "@/lib/constants";

interface ContactDaysBadgeProps {
  lastContactAt: string;
  className?: string;
}

export function ContactDaysBadge({ lastContactAt, className }: ContactDaysBadgeProps) {
  const days = getDaysAgo(lastContactAt);
  if (days < 7) return null;

  const { bg, text } = getUncontactedColor(days);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
        bg,
        text,
        className
      )}
    >
      {days}일 전
    </span>
  );
}
