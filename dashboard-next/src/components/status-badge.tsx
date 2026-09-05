"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ArtifactStatus } from "@/lib/mock-data";

const STATUS_CONFIG: Record<
  ArtifactStatus,
  { label: string; dot: string; badge: string }
> = {
  idle: {
    label: "Idle",
    dot: "bg-muted-foreground",
    badge: "bg-muted/60 text-muted-foreground border-border",
  },
  generating: {
    label: "Generating",
    dot: "bg-amber-500 animate-pulse",
    badge: "bg-amber-500/10 text-amber-700 border-amber-300/40 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  validating: {
    label: "Validating",
    dot: "bg-primary animate-pulse",
    badge: "bg-primary/10 text-primary border-primary/30 dark:bg-primary/15 dark:text-primary dark:border-primary/35",
  },
  ready: {
    label: "Ready",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  },
  "needs-review": {
    label: "Needs Review",
    dot: "bg-orange-500",
    badge: "bg-orange-500/10 text-orange-700 border-orange-300/40 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30",
  },
  failed: {
    label: "Failed",
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-700 border-red-300/40 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  },
};

interface StatusBadgeProps {
  status: ArtifactStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 text-xs font-medium border",
        config.badge,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("inline-block size-1.5 rounded-full shrink-0", config.dot)}
        />
      )}
      {config.label}
    </Badge>
  );
}
