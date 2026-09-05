import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_MODELS, ADMIN_LICENSE_ITEMS, ADMIN_USERS } from "@/lib/mock-data";

function PassBadge({ pass }: { pass: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] gap-1 font-semibold",
        pass
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
          : "bg-red-500/10 text-red-700 border-red-300/40 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30"
      )}
    >
      {pass ? <CheckCircle2 className="size-2.5" /> : <XCircle className="size-2.5" />}
      {pass ? "PASS" : "FAIL"}
    </Badge>
  );
}

export default function AdminPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Administration</h1>
          <p className="text-[13px] text-muted-foreground">
            System configuration, model status, license compliance, network sandbox, and role management.
            All settings are read-only in this demo.
          </p>
        </div>

        {/* Model config */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              <CardTitle className="text-[14px]">Model &amp; Inference Configuration</CardTitle>
            </div>
            <CardDescription className="text-[12px]">
              All inference runs locally — no external API calls in the pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] pl-6">Model</TableHead>
                  <TableHead className="text-[11px]">Provider</TableHead>
                  <TableHead className="text-[11px]">Endpoint</TableHead>
                  <TableHead className="text-[11px]">Role</TableHead>
                  <TableHead className="text-[11px] pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ADMIN_MODELS.map((m) => (
                  <TableRow key={m.name}>
                    <TableCell className="text-[12px] font-medium font-mono pl-6 w-[200px]">
                      {m.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{m.provider}</Badge>
                    </TableCell>
                    <TableCell className="text-[11px] font-mono text-muted-foreground">
                      {m.endpoint}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground max-w-[200px] truncate">
                      {m.role}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant="outline"
                        className="gap-1 text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        Online
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-3 gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" id="refresh-models">
              <RefreshCw className="size-3.5" />
              Refresh status
            </Button>
          </CardFooter>
        </Card>

        {/* License scan */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <CardTitle className="text-[14px]">License &amp; SBOM Compliance</CardTitle>
              </div>
              <Badge
                variant="outline"
                className="gap-1 text-[11px] bg-emerald-500/10 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
              >
                <CheckCircle2 className="size-3" />
                All clear — {ADMIN_LICENSE_ITEMS.length}/{ADMIN_LICENSE_ITEMS.length} passed
              </Badge>
            </div>
            <CardDescription className="text-[12px]">
              Zero restrictive-license (NC/proprietary) dependencies detected. SBOM generated on last
              build.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] pl-6">Component</TableHead>
                  <TableHead className="text-[11px]">License</TableHead>
                  <TableHead className="text-[11px]">Risk</TableHead>
                  <TableHead className="text-[11px] pr-6">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ADMIN_LICENSE_ITEMS.map((item) => (
                  <TableRow key={item.component}>
                    <TableCell className="text-[12px] font-medium pl-6">{item.component}</TableCell>
                    <TableCell className="text-[11px] font-mono text-muted-foreground">{item.license}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          item.risk === "None" && "text-muted-foreground",
                          item.risk === "Low" && "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400"
                        )}
                      >
                        {item.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <PassBadge pass={item.status === "pass"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Network sandbox */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="size-4 text-muted-foreground" />
                <CardTitle className="text-[14px]">Air-Gap / Network Sandbox Test</CardTitle>
              </div>
              <PassBadge pass={true} />
            </div>
            <CardDescription className="text-[12px]">
              Last run: 2026-09-05 13:00 IST — Full pipeline executed in an isolated network. Zero
              egress attempts detected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {[
                { check: "Dashboard (Next.js)", result: "No outbound requests" },
                { check: "Orchestration (LangGraph)", result: "No outbound requests" },
                { check: "Inference (vLLM / Ollama)", result: "No model weight pulls at runtime" },
                { check: "Docling document parser", result: "No outbound requests" },
                { check: "Faster-Whisper ASR", result: "No outbound requests" },
                { check: "DNS resolution", result: "0 external DNS queries" },
              ].map(({ check, result }) => (
                <div key={check} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-[12px] text-foreground">{check}</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] text-muted-foreground">{result}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-3">
            <Button variant="outline" size="sm" className="gap-1.5" id="run-sandbox-test">
              <RefreshCw className="size-3.5" />
              Run sandbox test
            </Button>
          </CardFooter>
        </Card>

        {/* Role management */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <CardTitle className="text-[14px]">Role Management</CardTitle>
            </div>
            <CardDescription className="text-[12px]">
              Operator: generate &amp; review artefacts. Administrator: system config, role assignment,
              SBOM audit.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] pl-6">Name</TableHead>
                  <TableHead className="text-[11px]">Email</TableHead>
                  <TableHead className="text-[11px]">Role</TableHead>
                  <TableHead className="text-[11px]">Last Active</TableHead>
                  <TableHead className="text-[11px] pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ADMIN_USERS.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell className="text-[12px] font-medium pl-6">{user.name}</TableCell>
                    <TableCell className="text-[11px] font-mono text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "Administrator" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">{user.lastActive}</TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant="outline"
                        className="gap-1 text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-300/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-3">
            <Button variant="outline" size="sm" id="invite-user">
              + Invite user
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
