"use client";

import { usePathname } from "next/navigation";
import { Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BREADCRUMBS: Record<string, { parent?: string; label: string }> = {
  "/ingest": { label: "Ingest Source" },
  "/parameters": { label: "Parameters" },
  "/workbench": { label: "Workbench" },
  "/history": { label: "Job History" },
  "/admin": { label: "Administration" },
};

export function TopBar() {
  const pathname = usePathname();
  const crumb = BREADCRUMBS[pathname] ?? { label: "ContentForge" };

  return (
    <header className="flex items-center h-[52px] px-5 border-b border-border bg-card shrink-0 gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground flex-1 min-w-0">
        <span className="font-medium text-foreground/60">ContentForge</span>
        <span className="text-border">/</span>
        <span className="font-semibold text-foreground truncate">{crumb.label}</span>
      </div>

      {/* Classification banner */}
      <div className="flex items-center gap-1.5">
        <Shield className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          RESTRICTED — FOR OFFICIAL USE ONLY
        </span>
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Notifications */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon" className="size-8 relative" id="topbar-notifications" />
          }
        >
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </TooltipTrigger>
        <TooltipContent>1 artefact needs review</TooltipContent>
      </Tooltip>

      {/* Job status pill */}
      <Badge
        variant="outline"
        className="gap-1.5 text-[11px] font-medium bg-amber-500/10 text-amber-700 border-amber-300/40 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
      >
        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
        Job in progress
      </Badge>
    </header>
  );
}
