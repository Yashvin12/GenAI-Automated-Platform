"use client";

import { useState, useCallback, useRef } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UploadCloud,
  X,
  FileText,
  FileImage,
  Film,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Cpu,
  FileSearch,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type UploadStatus = "pending" | "parsing" | "done" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: UploadStatus;
  progress: number;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? "")) return FileImage;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext ?? "")) return Film;
  if (["xls", "xlsx", "csv"].includes(ext ?? "")) return FileSpreadsheet;
  return FileText;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_TYPES = ".txt,.pdf,.docx,.pptx,.doc,.ppt,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv";

const PIPELINE_STEPS = [
  { icon: FileSearch, name: "Document Parsing", desc: "Docling parser · PDF, DOCX, PPTX, Image", status: "idle" },
  { icon: Cpu, name: "Model Extraction", desc: "LangGraph orchestration · Local vLLM", status: "idle" },
  { icon: Brain, name: "Parallel Synthesis", desc: "Concurrent multi-format artefact generation", status: "idle" },
  { icon: CheckCircle2, name: "Schema Validation", desc: "Pydantic validation · Structured output", status: "idle" },
];

const MODALITIES = ["Text / PDF", "DOCX / PPTX", "Images", "Video / Audio", "Free-form prompt"];

export default function IngestPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const simulateUpload = (file: File) => {
    const id = crypto.randomUUID();
    const entry: UploadedFile = {
      id,
      name: file.name,
      size: formatBytes(file.size),
      type: file.type || "application/octet-stream",
      status: "pending",
      progress: 0,
    };
    setFiles((prev) => [...prev, entry]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: 100, status: "done" } : f))
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress, status: "parsing" } : f))
        );
      }
    }, 220);
  };

  const addFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach(simulateUpload);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const canProceed = files.some((f) => f.status === "done") || prompt.trim().length > 20;

  return (
    <AppShell>
      <div className="p-6 lg:p-8">
        {/* Screen header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
              Ingest Source Content
            </h1>
            <p className="text-[13.5px] text-muted-foreground mt-1 max-w-[60ch] leading-relaxed">
              Upload source documents or enter text. Files are parsed into a single Canonical Content Model (CCM) for parallel artefact generation.
            </p>
          </div>
          <Button
            id="proceed-to-parameters"
            disabled={!canProceed}
            onClick={() => router.push("/parameters")}
            className="gap-2 shrink-0"
          >
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* 2-column layout: main + aside */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
          {/* ── Main column ── */}
          <div className="flex flex-col gap-5">
            {/* Drop zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-xl bg-card px-6 py-10 cursor-pointer text-center transition-colors duration-150 focus-visible:outline-none",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              id="drop-zone"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center size-14 rounded-xl bg-muted border border-border">
                  <UploadCloud className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-foreground">
                    Drop files here, or{" "}
                    <span className="text-primary underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    PDF, DOCX, PPTX, TXT, images, MP4 · Max 500 MB per file
                  </p>
                </div>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES}
              className="sr-only"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
              id="file-upload"
            />

            {/* Supported modalities */}
            <div className="flex items-center gap-2 flex-wrap">
              {MODALITIES.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-[11.5px] font-medium px-2.5 py-0.5 bg-primary/5 border-primary/20 text-primary"
                >
                  {t}
                </Badge>
              ))}
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Uploaded ({files.length})
                </span>
                {files.map((file) => {
                  const Icon = getFileIcon(file.name);
                  // Mock random data for pages and classification
                  const pages = Math.floor(Math.random() * 20) + 1;
                  const classifications = ["UNCLASSIFIED", "RESTRICTED", "CONFIDENTIAL", "SECRET"];
                  const classification = classifications[Math.floor(Math.random() * classifications.length)];

                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-center size-6 rounded shrink-0 bg-primary/5 border border-primary/10">
                        <Icon className="size-3.5 text-primary" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                           <span className="text-[12px] font-semibold truncate text-foreground leading-tight">{file.name}</span>
                           {file.status === "done" && (
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                                Parsed
                              </span>
                           )}
                           {file.status === "parsing" && (
                              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                                {Math.round(file.progress)}%
                              </span>
                           )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground font-mono uppercase">
                          <span>{file.size}</span>
                          <span className="text-border">·</span>
                          <span>{pages} {pages === 1 ? 'Page' : 'Pages'}</span>
                          <span className="text-border">·</span>
                          <span className={cn(classification === "UNCLASSIFIED" ? "text-muted-foreground" : "text-red-600 dark:text-red-400 font-semibold")}>{classification}</span>
                        </div>
                        {file.status !== "done" && file.status !== "error" && (
                          <Progress value={file.progress} className="h-1 mt-1.5" />
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Prompt textarea */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prompt-input" className="text-[12px] font-semibold text-foreground">
                Free-form prompt{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="prompt-input"
                placeholder="Describe the content or context. Can be the primary source if no file is uploaded."
                className="min-h-[100px] text-[13.5px] font-mono resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <span className="text-[11px] text-muted-foreground text-right">{prompt.length} chars</span>
            </div>

            {!canProceed && (
              <Alert className="border-border bg-muted/20">
                <AlertCircle className="size-4 text-muted-foreground" />
                <AlertDescription className="text-[12px] text-muted-foreground">
                  The <span className="font-semibold text-foreground">Continue</span> button is disabled. Please upload at least one valid source file or provide a descriptive free-form prompt (20+ characters) to proceed to parameter selection.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* ── Aside column ── */}
          <div className="flex flex-col gap-4">
            {/* Pipeline steps */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Ingestion Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1.5 pb-4">
                {PIPELINE_STEPS.map(({ icon: Icon, name, desc }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2.5 p-2 rounded border border-transparent hover:border-border hover:bg-muted/30 transition-colors"
                  >
                    <Icon className="size-3.5 text-muted-foreground shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.5px] font-semibold text-foreground leading-tight">{name}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight truncate">{desc}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">
                  Supported Inputs
                </p>
                <ul className="flex flex-col gap-1">
                  {[
                    "Text files, PDFs, DOCX, PPTX",
                    "Images (JPEG, PNG, WebP)",
                    "Video/audio (MP4, MOV)",
                    "Free-form descriptive prompts",
                    "Up to 10 files per job",
                  ].map((t) => (
                    <li key={t} className="text-[11.5px] text-primary/80 flex items-start gap-1.5">
                      <span className="mt-1.5 size-1 rounded-full bg-primary shrink-0 inline-block" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
