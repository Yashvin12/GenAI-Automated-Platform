"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  DownloadCloud,
  SlidersHorizontal,
  LayoutDashboard,
  History,
  Settings,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { href: "/ingest", icon: DownloadCloud, label: "Ingest Source" },
      { href: "/parameters", icon: SlidersHorizontal, label: "Parameters" },
      { href: "/workbench", icon: LayoutDashboard, label: "Workbench", badge: "3" },
    ],
  },
  {
    label: "Records",
    items: [
      { href: "/history", icon: History, label: "Job History" },
      { href: "/admin", icon: Settings, label: "Administration" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex flex-col w-[228px] shrink-0 h-screen border-r border-border bg-sidebar overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-[52px] border-b border-border shrink-0">
        <BrandMark />
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-sidebar-foreground leading-tight tracking-tight">
            ContentForge
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight font-mono uppercase tracking-widest">
            NTRO · Classified
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">
        {/* Workflow indicator */}
        <div className="flex flex-col gap-1.5 px-2 mb-2">
           <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Workflow
           </span>
           <div className="flex flex-col gap-1 text-[11px] font-medium">
             <div className={cn("flex items-center gap-2", pathname === "/ingest" ? "text-primary font-semibold" : "text-muted-foreground")}>
               <span className={cn("flex items-center justify-center size-3.5 rounded-full text-[8px] border", pathname === "/ingest" ? "border-primary bg-primary/10" : "border-border")}>1</span>
               Ingest Source
             </div>
             <div className="w-0.5 h-2 bg-border ml-1.5"></div>
             <div className={cn("flex items-center gap-2", pathname === "/parameters" ? "text-primary font-semibold" : "text-muted-foreground")}>
               <span className={cn("flex items-center justify-center size-3.5 rounded-full text-[8px] border", pathname === "/parameters" ? "border-primary bg-primary/10" : "border-border")}>2</span>
               Parameters
             </div>
             <div className="w-0.5 h-2 bg-border ml-1.5"></div>
             <div className={cn("flex items-center gap-2", pathname === "/workbench" ? "text-primary font-semibold" : "text-muted-foreground")}>
               <span className={cn("flex items-center justify-center size-3.5 rounded-full text-[8px] border", pathname === "/workbench" ? "border-primary bg-primary/10" : "border-border")}>3</span>
               Review & Generate
             </div>
           </div>
        </div>

        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-col gap-0.5">
            <span className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.label}
            </span>
            {section.items.map(({ href, icon: Icon, label, badge }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors duration-150",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-sidebar-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {badge && (
                    <span className="inline-flex items-center justify-center size-5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-3 py-3 flex flex-col gap-2">
        {/* System status */}
        <div className="flex items-center gap-2 px-1">
          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11px] text-muted-foreground">All systems operational</span>
        </div>

        {/* User row + dark mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shrink-0">
            RA
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] font-medium text-sidebar-foreground leading-tight truncate">
              Rajan Arora
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">Operator</span>
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              }
            >
              <Sun className="size-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle dark mode</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}

function BrandMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="2" y="2" width="9" height="9" rx="1.5" className="fill-primary" />
      <rect x="13" y="2" width="9" height="9" rx="1.5" className="fill-primary" opacity="0.4" />
      <rect x="2" y="13" width="9" height="9" rx="1.5" className="fill-primary" opacity="0.4" />
      <rect x="13" y="13" width="9" height="9" rx="1.5" className="fill-primary" opacity="0.2" />
    </svg>
  );
}
