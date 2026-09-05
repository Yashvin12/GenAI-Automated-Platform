"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import {
  RotateCcw,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MOCK_ARTIFACTS, type Artifact, type ArtifactStatus } from "@/lib/mock-data";

const STATUS_PROGRESSION: ArtifactStatus[] = [
  "generating",
  "generating",
  "validating",
  "ready",
];

export default function WorkbenchPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>(MOCK_ARTIFACTS);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editContent, setEditContent] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  // Simulate live status progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    artifacts.forEach((a) => {
      if (a.status === "generating" || a.status === "validating") {
        let step = STATUS_PROGRESSION.indexOf(a.status);
        const advance = () => {
          step++;
          if (step < STATUS_PROGRESSION.length) {
            setArtifacts((prev) =>
              prev.map((p) =>
                p.id === a.id ? { ...p, status: STATUS_PROGRESSION[step] } : p
              )
            );
            if (STATUS_PROGRESSION[step] !== "ready") {
              timers.push(setTimeout(advance, 3000 + Math.random() * 2000));
            }
          }
        };
        timers.push(setTimeout(advance, 3500 + Math.random() * 3000));
      }
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleEdit = (id: string, content: string) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!editMode[id]) setEditContent((prev) => ({ ...prev, [id]: content }));
  };

  const readyCount = artifacts.filter((a) => a.status === "ready").length;
  const reviewCount = artifacts.filter((a) => a.status === "needs-review").length;
  const inProgressCount = artifacts.filter(
    (a) => a.status === "generating" || a.status === "validating"
  ).length;

  return (
    <AppShell>
      <div className="p-6 lg:p-8">
        {/* Screen header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
              Workbench
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[12px] font-mono text-muted-foreground">CF-2026-0905-001</span>
              <span className="text-border">·</span>
              <span className="text-[12.5px] text-muted-foreground">
                TA-471 Spear-Phishing Campaign — Sep 2026
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-300/30 dark:text-emerald-300 dark:border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="font-semibold tabular-nums">{readyCount}</span> ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-orange-500/10 text-orange-700 border border-orange-300/30 dark:text-orange-300 dark:border-orange-500/20">
                <span className="size-1.5 rounded-full bg-orange-500" />
                <span className="font-semibold tabular-nums">{reviewCount}</span> need review
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-amber-500/10 text-amber-700 border border-amber-300/30 dark:text-amber-300 dark:border-amber-500/20">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-semibold tabular-nums">{inProgressCount}</span> in progress
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0" id="export-all">
            <Download className="size-3.5" />
            Export All
          </Button>
        </div>

        {/* Artifact card grid — auto-fill like original */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-5">
          {artifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              isEditing={!!editMode[artifact.id]}
              editContent={editContent[artifact.id] ?? artifact.content}
              onEditContentChange={(val) =>
                setEditContent((prev) => ({ ...prev, [artifact.id]: val }))
              }
              onToggleEdit={() => toggleEdit(artifact.id, artifact.content)}
              onCopy={() => handleCopy(artifact.id, artifact.content)}
              copied={copied === artifact.id}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

interface ArtifactCardProps {
  artifact: Artifact;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (v: string) => void;
  onToggleEdit: () => void;
  onCopy: () => void;
  copied: boolean;
}

function ArtifactCard({
  artifact,
  isEditing,
  editContent,
  onEditContentChange,
  onToggleEdit,
  onCopy,
  copied,
}: ArtifactCardProps) {
  const isGenerating =
    artifact.status === "generating" || artifact.status === "validating";

  return (
    <div
      className={cn(
        "flex flex-col bg-card border border-border rounded-lg shadow-sm overflow-hidden transition-all duration-150 hover:border-primary/40 hover:shadow-md"
      )}
      id={`artifact-card-${artifact.id}`}
    >
      {/* Card header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-[15px] font-bold text-foreground tracking-tight">{artifact.label}</h3>
          <StatusBadge status={artifact.status} />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          <span>v{artifact.version}</span>
          <span>·</span>
          <span>{artifact.updatedAt}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 px-5 py-4 overflow-hidden">
        {isGenerating ? (
          <div className="flex flex-col gap-3 py-6 items-center text-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">
                {artifact.status === "validating" ? "Validating schema…" : "Generating…"}
              </p>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                {artifact.status === "validating"
                  ? "Validating output against structured schema"
                  : "Synthesizing artifact from content model"}
              </p>
            </div>
          </div>
        ) : isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            className="min-h-[200px] text-[12px] font-mono resize-none"
            id={`edit-textarea-${artifact.id}`}
          />
        ) : (
          <pre className="whitespace-pre-wrap text-[12px] font-mono text-foreground/90 leading-relaxed max-h-[220px] overflow-y-auto">
            {artifact.content.slice(0, 600)}{artifact.content.length > 600 ? "…" : ""}
          </pre>
        )}
      </div>

      {/* Card footer */}
      {!isGenerating && (
        <>
          <div className="px-5 py-2.5 border-t border-border bg-muted/20 flex flex-col gap-1.5">
             <div className="flex items-center gap-2">
                 <Badge variant="outline" className="text-[8px] uppercase tracking-widest px-1 py-0 bg-primary/5 text-primary border-primary/20 rounded-sm">Valid Schema</Badge>
                 <Badge variant="outline" className="text-[8px] uppercase tracking-widest px-1 py-0 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-sm">Source Match</Badge>
             </div>
            <button
              className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground hover:text-primary transition-colors group"
              id={`view-source-${artifact.id}`}
            >
              <Eye className="size-3 shrink-0" />
              <span className="truncate">{artifact.sourceExcerpt}</span>
              <ChevronRight className="size-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-border">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-6" onClick={onCopy} id={`copy-${artifact.id}`} />
                }
              >
                {copied ? <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3.5" />}
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[11px] h-6 px-2"
              onClick={onToggleEdit}
              id={`edit-${artifact.id}`}
            >
              <Edit3 className="size-3" />
              {isEditing ? "Save" : "Edit"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[11px] h-6 px-2"
              id={`resteer-${artifact.id}`}
            >
              <RotateCcw className="size-3" />
              Re-steer
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-[11px] h-6 px-2 ml-auto"
              id={`export-${artifact.id}`}
            >
              <Download className="size-3" />
              Export
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
