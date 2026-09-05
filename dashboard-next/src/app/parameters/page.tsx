"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  FileText,
  Globe2,
  MessageSquare,
  Presentation,
  Video,
  LayoutTemplate,
  Zap,
  Save,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  AUDIENCE_OPTIONS,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
  DETAIL_OPTIONS,
  OBJECTIVE_OPTIONS,
  STYLE_OPTIONS,
  PRESET_OPTIONS,
  OUTPUT_TYPES,
  type OutputType,
} from "@/lib/mock-data";

// Base UI Select passes string | null — guard against null
function ns(setter: (v: string) => void) {
  return (v: string | null) => { if (v !== null) setter(v); };
}

const OUTPUT_ICONS: Record<OutputType, React.ElementType> = {
  advisory: Shield,
  "exec-summary": FileText,
  linkedin: Globe2,
  "x-twitter": MessageSquare,
  presentation: Presentation,
  "video-suite": Video,
  infographic: LayoutTemplate,
};

const JOB_SUMMARY_ROWS = [
  { label: "Source", value: "threat-intel-brief.pdf" },
  { label: "Size", value: "2.4 MB" },
  { label: "Pages", value: "12" },
  { label: "Classification", value: "RESTRICTED" },
  { label: "Ingested at", value: "2026-09-05 14:01 IST" },
];

export default function ParametersPage() {
  const router = useRouter();
  const [preset, setPreset] = useState("threat-analyst");
  const [audience, setAudience] = useState("Intelligence Analyst");
  const [tone, setTone] = useState("Urgent / Alert");
  const [language, setLanguage] = useState("English");
  const [detail, setDetail] = useState("Technical (Max depth)");
  const [objective, setObjective] = useState("Alert / Warn");
  const [style, setStyle] = useState("Report");
  const [audienceCustom, setAudienceCustom] = useState("");
  const [selectedOutputs, setSelectedOutputs] = useState<Set<OutputType>>(
    new Set(["advisory", "exec-summary", "linkedin", "x-twitter"])
  );

  const toggleOutput = (id: OutputType) => {
    setSelectedOutputs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8">
        {/* Screen header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
              Generation Parameters
            </h1>
            <p className="text-[13.5px] text-muted-foreground mt-1 max-w-[60ch] leading-relaxed">
              Set generation parameters across selected outputs. All artifacts inherit these settings from the shared CCM.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5" id="save-preset">
              <Save className="size-3.5" />
              Save preset
            </Button>
            <Button
              id="generate-all"
              disabled={selectedOutputs.size === 0}
              onClick={() => router.push("/workbench")}
              className="gap-2"
            >
              <Zap className="size-4" />
              Generate {selectedOutputs.size} Artifact{selectedOutputs.size !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>

        {/* 2-column layout: main + aside */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
          {/* ── Main column ── */}
          <div className="flex flex-col gap-5">
            {/* Preset bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl shadow-sm flex-wrap">
              <span className="text-[12px] font-semibold text-muted-foreground whitespace-nowrap">Preset:</span>
              {PRESET_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-[12px] font-medium transition-colors duration-150 whitespace-nowrap",
                    preset === p.id
                      ? "border-primary text-primary font-semibold shadow-sm bg-background"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                  id={`preset-${p.id}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Steering params grid */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Steering Parameters
                </CardTitle>
                <CardDescription className="text-[12.5px]">
                  Define audience, tone, language, depth, objective, and content format.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ParamField label="Audience" id="param-audience">
                  <Select value={audience} onValueChange={ns(setAudience)}>
                    <SelectTrigger id="param-audience">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCE_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Custom audience (optional)"
                    className="text-[12px] h-8"
                    value={audienceCustom}
                    onChange={(e) => setAudienceCustom(e.target.value)}
                    id="param-audience-custom"
                  />
                </ParamField>

                <ParamField label="Tone" id="param-tone">
                  <Select value={tone} onValueChange={ns(setTone)}>
                    <SelectTrigger id="param-tone"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </ParamField>

                <ParamField label="Language" id="param-language">
                  <Select value={language} onValueChange={ns(setLanguage)}>
                    <SelectTrigger id="param-language"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </ParamField>

                <ParamField label="Level of Detail" id="param-detail">
                  <Select value={detail} onValueChange={ns(setDetail)}>
                    <SelectTrigger id="param-detail"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DETAIL_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </ParamField>

                <ParamField label="Communication Objective" id="param-objective">
                  <Select value={objective} onValueChange={ns(setObjective)}>
                    <SelectTrigger id="param-objective"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OBJECTIVE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </ParamField>

                <ParamField label="Content Style" id="param-style">
                  <Select value={style} onValueChange={ns(setStyle)}>
                    <SelectTrigger id="param-style"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STYLE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </ParamField>
              </CardContent>
            </Card>

            {/* Output type grid — 3 columns like original */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Output Types
                </CardTitle>
                <CardDescription className="text-[12.5px]">
                  Select one or more artifacts. All share the parameters above and generate in parallel.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {OUTPUT_TYPES.map((type) => {
                  const Icon = OUTPUT_ICONS[type.id];
                  const selected = selectedOutputs.has(type.id);
                  return (
                    <button
                      key={type.id}
                      id={`output-type-${type.id}`}
                      onClick={() => toggleOutput(type.id)}
                      className={cn(
                        "relative flex items-center gap-3 px-3.5 py-3 rounded-xl border-[1.5px] text-left transition-all duration-150",
                        selected
                          ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-xs"
                          : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/30"
                      )}
                      aria-pressed={selected}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center size-9 rounded-lg shrink-0",
                          selected ? "bg-primary/20 border border-primary/30" : "bg-muted border border-border"
                        )}
                      >
                        <Icon className={cn("size-4", selected ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={cn("text-[13px] font-semibold leading-tight", selected ? "text-primary" : "text-foreground")}>
                          {type.label}
                        </span>
                        <span className="text-[10.5px] text-muted-foreground leading-tight mt-0.5 truncate">
                          {type.description.split("—")[0].trim()}
                        </span>
                      </div>
                      {selected && (
                        <CheckCircle2 className="absolute top-2 right-2 size-3.5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Selection summary */}
            <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg text-[12.5px] text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <span className="font-semibold text-foreground">{selectedOutputs.size}</span> output type
                {selectedOutputs.size !== 1 ? "s" : ""} selected
              </span>
              <span className="text-border mx-1">·</span>
              <span>Audience: <span className="font-medium text-foreground">{audience}</span></span>
              <span className="text-border mx-1">·</span>
              <span>Tone: <span className="font-medium text-foreground">{tone}</span></span>
            </div>
          </div>

          {/* ── Aside column ── */}
          <div className="flex flex-col gap-4">
            {/* Job summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Source Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  {JOB_SUMMARY_ROWS.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 text-[12.5px]"
                    >
                      <span className="text-muted-foreground font-medium">{label}</span>
                      <span className={cn("font-semibold text-foreground", label === "Classification" && "text-red-600 dark:text-red-400 text-[10.5px] uppercase tracking-wider")}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2 mt-1 border-t border-border">
                   <button className="text-[11px] font-medium text-primary hover:underline underline-offset-2">View Source</button>
                   <button className="text-[11px] font-medium text-primary hover:underline underline-offset-2">Extracted Text</button>
                   <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground ml-auto">Replace</button>
                </div>
              </CardContent>
            </Card>

            {/* CCM preview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  CCM Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                   <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-1.5 py-0 uppercase tracking-widest rounded-sm">CCM Ready</Badge>
                   <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20 px-1.5 py-0 uppercase tracking-widest rounded-sm">Validated</Badge>
                </div>
                {[
                  { key: "Core Thesis", val: "AI-powered spear-phishing targeting CI operators via supply-chain relay compromise." },
                  { key: "Entities", val: "TA-471, CVE-2026-31245, AS-45899" },
                  { key: "Tone Signal", val: "URGENT — immediate action required" },
                  { key: "Confidence", val: "HIGH (85%)" },
                ].map(({ key, val }) => (
                  <div key={key}>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                      {key}
                    </span>
                    <span className="text-[12.5px] text-foreground leading-snug">{val}</span>
                  </div>
                ))}
                <div className="pt-2 mt-1 border-t border-border">
                   <Button variant="outline" size="sm" className="w-full text-[11px] h-7">View Provenance</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ParamField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-semibold text-foreground">
        {label}
      </label>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
