// ─────────────────────────────────────────────────────────────────────────────
// ContentForge — Mock data (all screens)
// ─────────────────────────────────────────────────────────────────────────────

export type ArtifactStatus = "idle" | "generating" | "validating" | "ready" | "needs-review" | "failed";

export type OutputType =
  | "advisory"
  | "exec-summary"
  | "linkedin"
  | "x-twitter"
  | "presentation"
  | "video-suite"
  | "infographic";

export const OUTPUT_TYPES: { id: OutputType; label: string; icon: string; description: string }[] = [
  { id: "advisory", label: "Advisory", icon: "Shield", description: "Structured threat/policy advisory with severity classification" },
  { id: "exec-summary", label: "Executive Summary", icon: "FileText", description: "Concise leadership-facing brief with key findings" },
  { id: "linkedin", label: "LinkedIn Post", icon: "Linkedin", description: "Professional post formatted for LinkedIn audience" },
  { id: "x-twitter", label: "X / Twitter", icon: "Twitter", description: "Thread-style post formatted for X platform" },
  { id: "presentation", label: "Presentation", icon: "Presentation", description: "Editable PPTX slide deck with speaker notes" },
  { id: "video-suite", label: "Video Suite", icon: "Video", description: "Script, storyboard, narration, subtitles & visual recs" },
  { id: "infographic", label: "Infographic", icon: "LayoutTemplate", description: "Structured content + visual hierarchy JSON with preview" },
];

export const AUDIENCE_OPTIONS = [
  "Executive / C-Level",
  "Intelligence Analyst",
  "Technical Engineer",
  "Policy Officer",
  "General Public",
  "Training / Education",
];

export const TONE_OPTIONS = [
  "Neutral / Objective",
  "Urgent / Alert",
  "Formal / Official",
  "Conversational",
  "Technical / Precise",
];

export const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Bengali",
];

export const DETAIL_OPTIONS = [
  "Executive (1–2 paragraphs)",
  "Standard (3–5 paragraphs)",
  "Detailed (Full document)",
  "Technical (Max depth)",
];

export const OBJECTIVE_OPTIONS = [
  "Inform / Situational Awareness",
  "Alert / Warn",
  "Recommend Action",
  "Educate / Train",
  "Summarise / Recap",
];

export const STYLE_OPTIONS = [
  "Report",
  "Brief",
  "Narrative",
  "Bullet-points",
  "Slide-ready",
];

export const PRESET_OPTIONS = [
  { id: "threat-analyst", label: "Threat Analyst (P1)" },
  { id: "comms-officer", label: "Communications Officer (P2)" },
  { id: "briefing-officer", label: "Briefing Officer (P3)" },
  { id: "custom", label: "Custom (No preset)" },
];

// ── Workbench mock artifacts ──────────────────────────────────────────────────
export interface Artifact {
  id: OutputType;
  label: string;
  status: ArtifactStatus;
  version: number;
  updatedAt: string;
  content: string;
  sourceExcerpt: string;
}

export const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: "advisory",
    label: "Advisory",
    status: "ready",
    version: 2,
    updatedAt: "2026-09-05 14:02 IST",
    content: `**CLASSIFICATION:** RESTRICTED — FOR OFFICIAL USE ONLY
**Severity:** HIGH | **TLP:** AMBER | **Reference:** CF-2026-0905-001

**Summary**
A spear-phishing campaign targeting critical infrastructure operators was detected between 02–04 Sep 2026, recording three intrusion attempts. The lures mimic internal NTRO technical advisories and deliver secondary payloads via compromised relay nodes.

**Threat Profile**
The campaign is attributed to TA-471 (historical focus on energy grid and defence infrastructure). The vector targets an unpatched remote code execution vulnerability (CVE-2026-31245) in document-processing middleware.

**Observed Indicators**
• Macro payloads beaconing to C2 infrastructure in AS-45899.
• Spoofed headers passing DKIM through a compromised supply-chain mail relay.
• Encrypted DNS exfiltration on port 443.

**Required Actions**
1. Revoke trust for mail relay domain [redacted] on all boundary gateways immediately.
2. Deploy the vendor patch for CVE-2026-31245 across all document-processing nodes within 48 hours.
3. Retain full PCAP logs on DoH endpoints for 72 hours.
4. Execute incident response protocol IR-7 for host-level beacon detections.

**References**
[1] CVE-2026-31245 — NIST NVD
[2] TA-471 Activity Profile — Intel Repository`,
    sourceExcerpt: "CCM § Findings → Entities: TA-471, CVE-2026-31245; Metrics: 3 intrusion attempts; Timeline: 02–04 Sep 2026",
  },
  {
    id: "exec-summary",
    label: "Executive Summary",
    status: "ready",
    version: 1,
    updatedAt: "2026-09-05 14:02 IST",
    content: `**Situation Brief — 5 September 2026**

Three intrusion attempts targeted critical infrastructure facilities between 2 and 4 September. The adversary used targeted spear-phishing lures to exploit a middleware vulnerability (CVE-2026-31245).

**Operational Risk**
The attacker bypassed standard DKIM email verification using a compromised third-party relay. Unpatched endpoints remain vulnerable to remote execution and encrypted DNS data exfiltration.

**Required Remediation**
- Revoke the compromised supply-chain mail relay across all gateways.
- Apply the CVE-2026-31245 security patch to all document-processing nodes within 48 hours.
- Run protocol IR-7 triage on any hosts showing beaconing traffic to AS-45899.

**Recommended Decision**
Authorise emergency patch deployment across operational nodes and schedule an inter-agency incident coordination briefing within 24 hours.`,
    sourceExcerpt: "CCM § Core Thesis; § Recommendations items 1–3",
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    status: "needs-review",
    version: 1,
    updatedAt: "2026-09-05 14:03 IST",
    content: `Security Advisory: Spear-Phishing Campaign Targeting Critical Infrastructure

Between 02–04 September, our threat intelligence team identified intrusion attempts targeting utility and industrial operators. 

Key technical characteristics observed in this campaign:
1. DKIM validation bypass achieved through a compromised supply-chain mail relay.
2. Exploitation targeting document-processing middleware (CVE-2026-31245).
3. Covert exfiltration routed through encrypted DNS queries over port 443.

Recommended defensive actions:
• Audit upstream email relay authorisations and enforce strict sender validation.
• Apply patches for CVE-2026-31245 across all parsing middleware.
• Inspect DNS-over-HTTPS traffic for anomalous tunnel patterns rather than relying on domain blocklists alone.

Full technical indicators and YARA rules are available in advisory CF-2026-0905-001.

#CyberSecurity #ThreatIntel #InfoSec #CriticalInfrastructure`,
    sourceExcerpt: "CCM § Key Points items 1–3; § Recommendations item 1",
  },
  {
    id: "x-twitter",
    label: "X / Twitter Thread",
    status: "ready",
    version: 1,
    updatedAt: "2026-09-05 14:03 IST",
    content: `1/ Threat Advisory: Spear-phishing campaign detected targeting critical infrastructure operators (Ref: CF-2026-0905-001).

2/ Vector: Attacker spoofed trusted internal mail by abusing a compromised relay in the vendor supply chain, passing DKIM validation.

3/ Exploit: Targets CVE-2026-31245 in document middleware. Patch is available—apply within 48h to prevent execution.

4/ Exfiltration: Payloads use encrypted DNS tunnelling on port 443 to reach AS-45899 C2 infrastructure.

5/ Actions: Block compromised relay domains, patch CVE-2026-31245, enable DoH endpoint inspection, and initiate IR-7 on detected beacons.`,
    sourceExcerpt: "CCM § Key Points; § Entities: CVE-2026-31245",
  },
  {
    id: "presentation",
    label: "Presentation",
    status: "generating",
    version: 0,
    updatedAt: "2026-09-05 14:04 IST",
    content: `**Slide Deck: Threat Briefing — TA-471 Phishing Campaign**
*Compiling slides (estimated 45s remaining)*

Deck Outline:
1. Incident Timeline: 02–04 Sep 2026 Intrusion Sequence
2. Threat Actor Attribution & Infrastructure: TA-471 / AS-45899
3. Attack Chain: Relay Compromise → Middleware Exploit → DNS Tunnel
4. Vulnerability Scope: CVE-2026-31245 Impact Analysis
5. Risk Assessment across Operational Facilities
6. Countermeasure Action Plan & 48-Hour Patch Schedule
7. Technical Contacts & Escalation Roster

Speaker notes, slide data tables, and PPTX layout templates in progress.`,
    sourceExcerpt: "CCM § Timeline; § Entities; § Recommendations",
  },
  {
    id: "video-suite",
    label: "Video Suite",
    status: "generating",
    version: 0,
    updatedAt: "2026-09-05 14:04 IST",
    content: `**Video Briefing Suite: Generating Assets**

Asset Breakdown:
• Operational Script (2m 45s technical walkthrough)
• Storyboard (8 keyframes: Intrusion → Relay Bypass → Exploit → Remediation)
• Scene Breakdown (technical diagrams and indicator overlays)
• Narration Audio (TTS synthesis with SSML pronunciation markers)
• Subtitles (Synchronised SRT track)
• Visual Reference Specs (network diagrams, timeline charts, IOC callouts)`,
    sourceExcerpt: "CCM § Core Thesis; § Key Points",
  },
  {
    id: "infographic",
    label: "Infographic",
    status: "validating",
    version: 1,
    updatedAt: "2026-09-05 14:04 IST",
    content: `**Infographic Spec — Schema Validation**

Header: "Advisory CF-2026-0905-001: Threat Vector & Response Summary"

Key Metric Blocks:
- 3 Intrusion attempts (02–04 Sep 2026)
- 1 Affected component: CVE-2026-31245 middleware
- Primary vector: Supply-chain relay spoofing
- Egress method: Port 443 encrypted DNS tunnel

Structure: 2-column layout (Left: Attack Sequence; Right: 48-Hour Remediation Matrix)
Severity Palette: Amber / Slate / Neutral
Output format: Structured JSON + vector SVG preview`,
    sourceExcerpt: "CCM § Metrics; § Timeline",
  },
];

// ── Job History mock data ─────────────────────────────────────────────────────
export interface HistoryJob {
  id: string;
  title: string;
  operator: string;
  date: string;
  outputs: OutputType[];
  status: "completed" | "partial" | "failed";
  sourceType: "pdf" | "text" | "video" | "image" | "docx";
  ccmVersion: string;
  sourceHash: string;
  model: string;
  paramSummary: string;
}

export const MOCK_HISTORY: HistoryJob[] = [
  {
    id: "CF-2026-0905-001",
    title: "TA-471 Spear-Phishing Campaign — Sep 2026",
    operator: "Rajan Arora",
    date: "2026-09-05 14:02 IST",
    outputs: ["advisory", "exec-summary", "linkedin", "x-twitter", "presentation", "video-suite", "infographic"],
    status: "partial",
    sourceType: "pdf",
    ccmVersion: "ccm-v1.2.1",
    sourceHash: "sha256:4a7f9c2e…b381dd",
    model: "Llama-3-70B (vLLM)",
    paramSummary: "Audience: Analyst | Tone: Urgent | Language: English | Detail: Technical",
  },
  {
    id: "CF-2026-0904-003",
    title: "Critical Infrastructure Policy Update Q3",
    operator: "Meena Krishnan",
    date: "2026-09-04 09:45 IST",
    outputs: ["exec-summary", "presentation", "advisory"],
    status: "completed",
    sourceType: "docx",
    ccmVersion: "ccm-v1.2.0",
    sourceHash: "sha256:8d3ab12f…c094ea",
    model: "Llama-3-70B (vLLM)",
    paramSummary: "Audience: Executive | Tone: Formal | Language: English | Detail: Standard",
  },
  {
    id: "CF-2026-0903-007",
    title: "Public Advisory — Water Treatment Security",
    operator: "Arjun Mehta",
    date: "2026-09-03 16:30 IST",
    outputs: ["advisory", "linkedin", "x-twitter"],
    status: "completed",
    sourceType: "text",
    ccmVersion: "ccm-v1.1.9",
    sourceHash: "sha256:2c19f7a4…d72bc1",
    model: "Mistral-7B (Ollama)",
    paramSummary: "Audience: Public | Tone: Alert | Language: English | Detail: Executive",
  },
  {
    id: "CF-2026-0902-002",
    title: "Satellite Imagery Analysis — Border Region",
    operator: "Rajan Arora",
    date: "2026-09-02 11:15 IST",
    outputs: ["exec-summary", "infographic", "advisory"],
    status: "completed",
    sourceType: "image",
    ccmVersion: "ccm-v1.1.8",
    sourceHash: "sha256:f901c345…e18af3",
    model: "Qwen2-VL + Llama-3-70B",
    paramSummary: "Audience: Analyst | Tone: Neutral | Language: English | Detail: Detailed",
  },
  {
    id: "CF-2026-0901-005",
    title: "Threat Actor Briefing — Video Debrief",
    operator: "Sanjana Patel",
    date: "2026-09-01 14:00 IST",
    outputs: ["video-suite", "presentation", "exec-summary"],
    status: "completed",
    sourceType: "video",
    ccmVersion: "ccm-v1.1.7",
    sourceHash: "sha256:b72e40d1…9f3c28",
    model: "Faster-Whisper + Llama-3-70B",
    paramSummary: "Audience: Briefing Officer | Tone: Formal | Language: English | Detail: Detailed",
  },
  {
    id: "CF-2026-0831-011",
    title: "Q2 Cyber Threat Landscape — Annual Summary",
    operator: "Meena Krishnan",
    date: "2026-08-31 09:00 IST",
    outputs: ["advisory", "exec-summary", "presentation", "infographic"],
    status: "completed",
    sourceType: "pdf",
    ccmVersion: "ccm-v1.1.6",
    sourceHash: "sha256:3d8f102a…7ba49e",
    model: "Llama-3-70B (vLLM)",
    paramSummary: "Audience: Executive | Tone: Neutral | Language: English | Detail: Executive",
  },
  {
    id: "CF-2026-0830-004",
    title: "Training Module — Social Engineering Awareness",
    operator: "Arjun Mehta",
    date: "2026-08-30 13:20 IST",
    outputs: ["presentation", "video-suite"],
    status: "completed",
    sourceType: "docx",
    ccmVersion: "ccm-v1.1.5",
    sourceHash: "sha256:7c1e89b3…d294f7",
    model: "Mistral-7B (Ollama)",
    paramSummary: "Audience: Training | Tone: Conversational | Language: Hindi | Detail: Standard",
  },
  {
    id: "CF-2026-0828-009",
    title: "Emergency Advisory — Power Grid Anomaly",
    operator: "Rajan Arora",
    date: "2026-08-28 03:45 IST",
    outputs: ["advisory", "exec-summary"],
    status: "failed",
    sourceType: "text",
    ccmVersion: "ccm-v1.1.4",
    sourceHash: "sha256:9b4d77e2…c031a9",
    model: "Llama-3-70B (vLLM)",
    paramSummary: "Audience: Analyst | Tone: Urgent | Language: English | Detail: Technical",
  },
  {
    id: "CF-2026-0825-006",
    title: "Policy Brief — AI Governance Framework Draft",
    operator: "Sanjana Patel",
    date: "2026-08-25 10:30 IST",
    outputs: ["exec-summary", "linkedin", "presentation"],
    status: "completed",
    sourceType: "pdf",
    ccmVersion: "ccm-v1.1.3",
    sourceHash: "sha256:1f5a32c8…b97de4",
    model: "Llama-3-70B (vLLM)",
    paramSummary: "Audience: Policy Officer | Tone: Formal | Language: English | Detail: Detailed",
  },
  {
    id: "CF-2026-0820-001",
    title: "Supply Chain Risk — Semiconductor Dependencies",
    operator: "Meena Krishnan",
    date: "2026-08-20 16:00 IST",
    outputs: ["advisory", "exec-summary", "infographic", "linkedin"],
    status: "completed",
    sourceType: "docx",
    ccmVersion: "ccm-v1.1.2",
    sourceHash: "sha256:6e2b90f4…a153c7",
    model: "Llama-3-70B (vLLM)",
    paramSummary: "Audience: Executive | Tone: Neutral | Language: English | Detail: Standard",
  },
];

// ── Admin screen mock data ────────────────────────────────────────────────────
export const ADMIN_MODELS = [
  { name: "Llama-3-70B-Instruct", provider: "vLLM", status: "online", endpoint: "http://inference:8000/v1", role: "Primary LLM — CCM extraction, all subagents" },
  { name: "Mistral-7B-Instruct", provider: "Ollama", status: "online", endpoint: "http://inference:11434", role: "Fallback LLM — lightweight tasks" },
  { name: "Qwen2-VL-7B", provider: "vLLM", status: "online", endpoint: "http://inference:8001/v1", role: "Vision-Language — image/diagram captioning" },
  { name: "Faster-Whisper-large-v3", provider: "Service", status: "online", endpoint: "http://ingestion:8100/transcribe", role: "ASR — audio/video transcription" },
  { name: "Docling-serve", provider: "Service", status: "online", endpoint: "http://ingestion:8101/parse", role: "Document parser — PDF/DOCX/PPTX" },
];

export const ADMIN_LICENSE_ITEMS = [
  { component: "Llama-3-70B-Instruct", license: "Llama 3 Community License", status: "pass", risk: "Low" },
  { component: "Mistral-7B-Instruct", license: "Apache 2.0", status: "pass", risk: "None" },
  { component: "Qwen2-VL-7B", license: "Apache 2.0", status: "pass", risk: "None" },
  { component: "Faster-Whisper", license: "MIT", status: "pass", risk: "None" },
  { component: "Docling", license: "MIT", status: "pass", risk: "None" },
  { component: "LangGraph", license: "MIT", status: "pass", risk: "None" },
  { component: "CrewAI", license: "MIT", status: "pass", risk: "None" },
  { component: "Instructor", license: "MIT", status: "pass", risk: "None" },
  { component: "Outlines", license: "Apache 2.0", status: "pass", risk: "None" },
  { component: "presenton", license: "Apache 2.0", status: "pass", risk: "None" },
];

export const ADMIN_USERS = [
  { name: "Rajan Arora", email: "r.arora@ntro.gov.in", role: "Operator", lastActive: "Just now", status: "active" },
  { name: "Meena Krishnan", email: "m.krishnan@ntro.gov.in", role: "Operator", lastActive: "1h ago", status: "active" },
  { name: "Arjun Mehta", email: "a.mehta@ntro.gov.in", role: "Operator", lastActive: "3h ago", status: "active" },
  { name: "Sanjana Patel", email: "s.patel@ntro.gov.in", role: "Operator", lastActive: "Yesterday", status: "active" },
  { name: "Dr. Vikram Nair", email: "v.nair@ntro.gov.in", role: "Administrator", lastActive: "2d ago", status: "active" },
];

