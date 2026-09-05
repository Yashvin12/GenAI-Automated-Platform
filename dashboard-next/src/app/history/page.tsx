"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator as Sep } from "@/components/ui/separator";
import { Search, FileText, ExternalLink } from "lucide-react";
import { MOCK_HISTORY, type HistoryJob } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  docx: "DOCX",
  text: "Text / Prompt",
  video: "Video",
  image: "Image",
};

function ns(setter: (v: string) => void) {
  return (v: string | null) => { if (v !== null) setter(v); };
}

const STATUS_STYLES: Record<string, string> = {
  completed:
    "bg-emerald-500/10 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  partial:
    "bg-amber-500/10 text-amber-700 border-amber-300/40 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  failed:
    "bg-red-500/10 text-red-700 border-red-300/40 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<HistoryJob | null>(null);

  const filtered = useMemo(() => {
    return MOCK_HISTORY.filter((j) => {
      const matchSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.id.toLowerCase().includes(search.toLowerCase()) ||
        j.operator.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || j.status === statusFilter;
      const matchType = typeFilter === "all" || j.sourceType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <h1 className="text-[16px] font-semibold text-foreground">Job History &amp; Audit Log</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Full lineage for every generation run — source hash, CCM version, parameters, model used.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              id="history-search"
              placeholder="Search by title, ID, or operator…"
              className="pl-8 h-8 text-[12px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={ns(setStatusFilter)}>
            <SelectTrigger className="w-36 h-8 text-[12px]" id="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={ns(setTypeFilter)}>
            <SelectTrigger className="w-36 h-8 text-[12px]" id="filter-source">
              <SelectValue placeholder="Source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">DOCX</SelectItem>
              <SelectItem value="text">Text / Prompt</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[11px] text-muted-foreground ml-auto">
            {filtered.length} of {MOCK_HISTORY.length} jobs
          </span>
        </div>

        {/* Table */}
        <ScrollArea className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] w-[180px]">Job ID</TableHead>
                <TableHead className="text-[11px]">Title</TableHead>
                <TableHead className="text-[11px] w-[120px]">Operator</TableHead>
                <TableHead className="text-[11px] w-[80px]">Source</TableHead>
                <TableHead className="text-[11px] w-[80px]">Outputs</TableHead>
                <TableHead className="text-[11px] w-[90px]">Status</TableHead>
                <TableHead className="text-[11px] w-[150px]">Date</TableHead>
                <TableHead className="text-[11px] w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedJob(job)}
                  id={`history-row-${job.id}`}
                >
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{job.id}</TableCell>
                  <TableCell className="text-[12px] font-medium max-w-[280px] truncate">{job.title}</TableCell>
                  <TableCell className="text-[12px]">{job.operator}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {SOURCE_TYPE_LABELS[job.sourceType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[12px] text-muted-foreground">{job.outputs.length} types</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] capitalize", STATUS_STYLES[job.status])}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground font-mono">{job.date}</TableCell>
                  <TableCell>
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-[13px] text-muted-foreground">
                    No jobs match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Lineage dialog */}
        <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
          <DialogContent className="max-w-xl" id="lineage-dialog">
            <DialogHeader>
              <DialogTitle className="text-[14px]">{selectedJob?.title}</DialogTitle>
              <DialogDescription className="text-[11px] font-mono">
                {selectedJob?.id}
              </DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="flex flex-col gap-3 mt-2">
                <LineageRow label="Operator" value={selectedJob.operator} />
                <LineageRow label="Date" value={selectedJob.date} />
                <LineageRow label="Source Type" value={SOURCE_TYPE_LABELS[selectedJob.sourceType]} />
                <Sep />
                <LineageRow label="Source Hash" value={selectedJob.sourceHash} mono />
                <LineageRow label="CCM Version" value={selectedJob.ccmVersion} mono />
                <LineageRow label="Model / Inference" value={selectedJob.model} />
                <Sep />
                <LineageRow label="Parameters" value={selectedJob.paramSummary} />
                <LineageRow
                  label="Output Types"
                  value={selectedJob.outputs.join(", ")}
                />
                <Sep />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Job status</span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] capitalize", STATUS_STYLES[selectedJob.status])}
                  >
                    {selectedJob.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 mt-1" id="view-full-lineage">
                  <FileText className="size-3.5" />
                  View full audit log
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

function LineageRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[11px] text-muted-foreground shrink-0 pt-0.5">{label}</span>
      <span
        className={cn(
          "text-[11px] text-right text-foreground",
          mono && "font-mono text-muted-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
