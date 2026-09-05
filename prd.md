**Problem Statement ID:** 26154 | **Organization:** National Technical Research Organisation (NTRO) | **Category:** Software | **Theme:** Smart Automation
**Document Version:** 1.0 | **Date:** 2026-09-05 | **Status:** Implementation-Ready Draft
**Primary Sources:** SIH Problem Statement 26154 (NTRO) + `Existing Solutions & Building Blocks — SIH 26154` research + `Similar Repos` competitive/reuse analysis
**Target Compliance:** Self-hostable / air-gapped, multi-modal input, multi-output batch generation, full parameter control, defense-grade document schemas, ≤2-page architecture doc + ≤2-min demo + ≤5-slide deck deliverables

---

## 1. Executive Summary

### 1.1 Problem Statement

Organisations such as NTRO routinely need to turn a single piece of source information — a threat report, policy document, research paper, advisory, incident report, or free-form prompt — into several different **communication artefacts** (a social post, an executive briefing, a slide deck, a video script, an infographic) for different audiences. Today this is done by hand: an analyst reads the source, decides what each stakeholder needs, and separately drafts each deliverable in the right tone, format, and level of detail. This is slow, inconsistent across formats, hard to scale across many output types at once, and risky when facts or numbers drift between the versions produced for different audiences.

Existing commercial and open-source tools each solve a narrow slice of this: writing assistants (Jasper, Copy.ai) are text-in/text-out only; design tools (Gamma, Canva Magic Studio) are visual-first with no video or formal-document output; video repurposing tools (Opus Clip, Descript) are video-in/video-out only; and distribution tools (Repurpose.io, ContentStudio) republish existing content rather than transforming it. None combine true multi-modal input, domain-aware generation, parallel multi-format batch output, fine-grained operator control, and an on-prem/air-gapped deployment model suitable for government use — the gap the Existing Solutions research explicitly documents.

### 1.2 Proposed Solution

An **AI-powered content transformation platform** with an operator dashboard where a user uploads source content in any supported form (English text, PDF/DOCX/PPTX documents, articles, reports, free-form prompts, images, video, or contextual notes), selects one or more desired output types, and tunes generation parameters (audience, tone, language, level of detail, communication objective, content style). The platform ingests and normalises every input modality into a single **Canonical Content Model (CCM)** — a structured, fact-preserving intermediate representation — and then fans that CCM out in parallel to specialist generation agents that each produce one artefact type (Advisory, Executive Summary, LinkedIn Post, X/Twitter Post or Thread, Presentation with speaker notes, Video Script/Storyboard/Scene-descriptions/Narration/Subtitles/Visual-recommendations, Infographic content + layout). Every structured output is schema-validated before it reaches the operator, and every generation run is versioned with full lineage back to the source content and the parameters used.

The core architectural insight — carried over directly from the Existing Solutions research — is: **never generate a final artefact straight from raw multi-modal input.** Always route through the CCM first, so that facts, numbers, entities, and structure stay consistent no matter how many different artefacts are produced from the same source.

### 1.3 Success Criteria (Proposed KPIs)

> The published SIH problem statement for PS 26154 does not list explicit numeric evaluation weights (unlike some other PS documents). The KPIs below are the PRD author's recommended internal targets, derived from the problem statement's stated behaviours and the gaps identified in the Existing Solutions research, and should be validated against the official SIH judging rubric once released.
> 

| # | KPI | Target (Threshold / Stretch) | Why it matters | Measurement Method |
| --- | --- | --- | --- | --- |
| K1 | **Factual Fidelity** | ≤2% unsupported/hallucinated claims per artefact (threshold), ≤1% (stretch) | Government-grade content cannot invent facts | LLM-as-judge fact-check of each artefact against the CCM + source, plus human spot-audit sample |
| K2 | **Cross-Format Consistency** | ≥95% agreement (threshold), ≥99% (stretch) on shared facts/entities/numbers across all artefacts generated from one run | Same source must not "say two things" to two audiences | Automated entity/number diff across sibling artefacts of a single job |
| K3 | **Parameter Adherence** | ≥90% adherence (threshold), ≥95% (stretch) to selected audience/tone/language/detail/objective/style | The dashboard's core value proposition is control | Rubric-based LLM-judge scoring + human spot check per parameter axis |
| K4 | **Schema / Format Compliance** | 100% of structured artefacts pass validation before delivery | No malformed decks/advisories reach the operator | Instructor/Outlines/Pydantic schema validation gate — Pass/Fail |
| K5 | **Generation Latency** | Text artefacts (Advisory/Exec Summary/Social) <45 s P95; Presentation <90 s P95; Video script/storyboard/subtitles <120 s P95; N parallel outputs from one CCM ≤1.3× the slowest single output | Operator workflow must stay interactive, not batch-overnight | Wall-clock instrumentation per job stage, P50/P95/P99 |
| K6 | **Deployability / Air-Gap Compliance** | Zero outbound network calls in air-gapped mode; full stack starts via a single deployment command; zero restrictive-license (e.g. NC) model weights in the shipped build | Government/on-prem requirement | Network sandbox test in isolated environment + license/SBOM audit — Pass/Fail Gate |
| K7 | **Multi-Modal Ingestion Coverage** | Text, PDF/DOCX/PPTX, images, and video all parse into a non-empty, structured CCM on ≥95% of a representative sample corpus | The problem statement explicitly lists all of these as input types | Ingestion regression test set with per-modality pass rate |

---

## 2. User Experience & Functionality

### 2.1 User Personas

| Persona | Description | Primary Environment | Primary Use | Output Focus |
| --- | --- | --- | --- | --- |
| **P1 — Intelligence / Threat Analyst (Primary)** | Turns a threat report, incident writeup, or raw advisory into a structured, distributable advisory and an executive brief | Air-gapped analyst workstation | Upload report → select Advisory + Executive Summary | Advisory, Executive Summary |
| **P2 — Communications / Outreach Officer** | Converts an approved report or announcement into public-facing social content | Standard office workstation | Upload document/prompt → select LinkedIn + X | LinkedIn Post, X/Twitter Post or Thread |
| **P3 — Briefing / Training Officer** | Builds a leadership briefing deck or a training/video explainer from a source document | Office workstation, sometimes offline | Upload report → select Presentation and/or Video Script suite | Presentation (slides + speaker notes), Video artefact suite |
| **P4 — Executive / Decision-Maker (Consumer)** | Reads the generated Executive Summary or watches the briefing deck; rarely uses the dashboard directly | Any device, review-only | Review/approve generated artefacts | Executive Summary, Presentation |
| **P5 — Platform Administrator / SIH Evaluator** | Configures parameter presets, manages model/deployment, verifies air-gapped operation, and runs the two-artefact demo | Deployment host | Install stack, run demo job, inspect audit log | All (verification) |

**Accessibility & operator-trust note:** Every generated artefact must show its parameter settings and a link back to the exact source excerpt(s) that support each claim, so a human reviewer — not just the model — has final sign-off before anything is distributed externally.

### 2.2 User Stories & Acceptance Criteria

#### US-01 — Multi-Modal Source Ingestion

> As an **analyst (P1)** I want to **upload text, documents, images, or video as source content** so that **I don't have to manually retype or describe what I'm working from**.
> 

**Acceptance Criteria:**

- AC-01.1: Dashboard upload widget accepts plain/rich text paste, `.pdf`, `.docx`, `.pptx`, `.png/.jpg`, `.mp4/.mov`, and free-form prompt text, singly or combined into one job.
- AC-01.2: Documents are parsed with a layout-aware parser (Docling-class) preserving headings, tables, and reading order rather than flattening to plain text.
- AC-01.3: Images are captioned/OCR'd via a vision-language model (Qwen2-VL-class) to extract both visible text and a semantic description of diagrams/photos.
- AC-01.4: Video/audio is transcribed with timestamps (Faster-Whisper-class ASR) and key frames are sampled and captioned for visual context.
- AC-01.5: Ingestion failures (corrupt file, unsupported codec, unreadable scan) surface a specific, actionable error — never a silent drop.

#### US-02 — Canonical Content Model (CCM) Extraction

> As the **platform**, before generating anything, I want to **normalise every ingested input into one structured representation** so that **every downstream artefact is grounded in the same facts**.
> 

**Acceptance Criteria:**

- AC-02.1: CCM extraction (local LLM + structured-output library, Instructor/Outlines-class, over a Pydantic schema) produces: Core Thesis, Key Points, Entities, Metrics/Numbers, Timeline, Visuals (with captions/source refs), Recommendations, and Open Questions.
- AC-02.2: Every CCM field carries a provenance pointer (source document id + page/section/timestamp) back to the originating input.
- AC-02.3: CCM extraction is schema-validated; a failed validation triggers one automatic re-prompt/repair pass before surfacing an error to the operator.
- AC-02.4: The CCM is persisted and versioned per job so that re-steering (US-10) does not require re-ingesting the source.

#### US-03 — Parameter-Controlled Generation Steering

> As an **operator (P1/P2/P3)** I want to **set audience, tone, language, level of detail, communication objective, and content style before generating** so that **the output fits the situation without manual rewriting**.
> 

**Acceptance Criteria:**

- AC-03.1: Dashboard exposes six parameter controls exactly as named in the problem statement: **Target Audience, Tone, Language, Level of Detail, Communication Objective, Content Style** — each with a sensible default and a small curated preset list plus free-text override.
- AC-03.2: Parameters compile into a structured "steering spec" attached to the job and passed to every subagent identically, so all sibling artefacts share the same steering intent.
- AC-03.3: Presets can be saved and reused (e.g. "Tactical / Urgent / Technical" vs "Executive / Neutral / High-level"), addressing the differentiated-tone scenarios called out in the Existing Solutions research.
- AC-03.4: Changing a parameter after first generation and re-running only regenerates affected artefacts, not the whole job (see US-10).

#### US-04 — Simultaneous Multi-Output Generation

> As an **operator (P1)** I want to **select more than one output type and get all of them from the same source in one run** so that **I don't repeat the ingestion/parameter step per format**.
> 

**Acceptance Criteria:**

- AC-04.1: Output-type selector is multi-select across all seven families named in the problem statement: Video, LinkedIn Post, Twitter/X Post, Advisory, Infographic, Executive Summary, Presentation.
- AC-04.2: All selected artefacts are generated in parallel from one CCM + one steering spec via an orchestrated subagent fan-out (LangGraph/CrewAI-class), not sequentially.
- AC-04.3: Partial failure isolation: if one subagent (e.g. Video Script) fails or times out, the other artefacts still complete and deliver; the failed one is retried independently.
- AC-04.4: A consistency-check agent runs after fan-out and flags (does not silently fix) any numeric/entity disagreement across sibling artefacts, feeding K2.

#### US-05 — Presentation Generation (Slides + Speaker Notes)

> As a **briefing officer (P3)** I want a **ready-to-edit slide deck with speaker notes** so that **I can present without building slides from scratch**.
> 

**Acceptance Criteria:**

- AC-05.1: Output is an editable deck (PPTX and/or PDF) generated via a slide-generation engine (presenton/python-pptx/Marp-class), not a flat image export.
- AC-05.2: Deck includes a title slide, agenda, one slide per Key Point from the CCM, a recommendations slide, and full speaker notes per slide reflecting the selected tone/detail level.
- AC-05.3: Template/theme selectable from a small curated set; slide count adapts to Level of Detail (e.g. "Executive" ≤6 slides, "Detailed" up to 15).
- AC-05.4: Any chart/number on a slide must trace to a CCM Metric with provenance; no invented figures.

#### US-06 — Video Artefact Suite

> As a **training/communications officer (P3/P2)** I want **script, storyboard, scene descriptions, narration text, subtitles, and visual recommendations** so that **a video can be produced without a separate scriptwriting pass**.
> 

**Acceptance Criteria:**

- AC-06.1: Output bundle contains all six sub-artefacts named in the problem statement: Script, Storyboard, Scene Descriptions, Narration Text, Subtitles, Visual Recommendations — each as a distinct, separately downloadable section.
- AC-06.2: Storyboard is scene-numbered and time-boxed; narration text is timed to a target words-per-minute so narration duration roughly matches the storyboard's scene timings.
- AC-06.3: Subtitles are delivered in a standard captioning format (SRT/VTT) time-aligned to the narration.
- AC-06.4: Visual recommendations reference concrete assets where possible (an ingested image/frame, or a described stock/generated visual) rather than vague suggestions.
- AC-06.5: (Stretch, not required for MVP) One-command assembly of a narrated video file (Deck2Video/FFmpeg + local TTS-class pipeline) directly from the script/storyboard/narration bundle.

#### US-07 — Social Media Post Generation

> As a **communications officer (P2)** I want a **platform-ready LinkedIn post and an X/Twitter post or thread** so that **I can publish without manual reformatting**.
> 

**Acceptance Criteria:**

- AC-07.1: LinkedIn output respects professional-post conventions (structure, length, hashtags optional) and reflects selected tone/audience.
- AC-07.2: X/Twitter output is character-limit aware and automatically renders as a single post or a numbered thread depending on content length and Level of Detail.
- AC-07.3: Both social outputs are generated from the same CCM as every other artefact in the job — no re-summarisation from scratch — so headline facts match the Advisory/Executive Summary.
- AC-07.4: Sensitive/classified CCM fields (see US-11 classification handling) are excluded from social outputs by default, with an explicit operator override required to include them.

#### US-08 — Advisory & Executive Summary Generation

> As an **analyst (P1)** I want a **structured advisory document and a concise executive summary** so that **different audiences get the right depth without me writing two separate documents**.
> 

**Acceptance Criteria:**

- AC-08.1: Advisory follows a fixed structured schema (title, severity/classification banner, summary, background, findings, recommendations, references) inspired by CERT-In-style advisory structure, enforced via schema validation (not free text).
- AC-08.2: Executive Summary is capped to a configurable length band (e.g. 150–300 words) driven by Level of Detail, and leads with the single most important Key Point.
- AC-08.3: Both documents are exportable as DOCX/PDF/Markdown.
- AC-08.4: Any recommendation in the Advisory must trace to a CCM Recommendation or Key Point; the platform must not introduce new recommendations at generation time.

#### US-09 — Infographic Content & Layout Generation

> As a **communications officer (P2)** I want **infographic content plus layout recommendations** so that **a designer (or an automated renderer) has everything needed to produce the visual**.
> 

**Acceptance Criteria:**

- AC-09.1: Output includes: a short headline, 3–7 key-message blocks (each with a stat/fact + one-line explanation), a suggested visual hierarchy/section order, and suggested icon/chart types per block.
- AC-09.2: Output is structured data (JSON) plus a rendered preview (e.g. via a diagram/chart templating engine, Mermaid/QuickChart-class) — not just a paragraph describing an infographic.
- AC-09.3: Every stat block traces to a CCM Metric with provenance.

#### US-10 — Operator Workbench, Review & Re-Steering

> As an **operator (P1/P2/P3)** I want to **see all generated artefacts side by side, edit inline, and re-generate individual ones with new parameters** so that **I stay in control of the final output**.
> 

**Acceptance Criteria:**

- AC-10.1: Multi-artefact viewer shows every selected output as a tab/card with a status indicator (Generating / Ready / Failed / Needs Review — flagged by the consistency-check agent).
- AC-10.2: Inline edit is supported per artefact; edits are saved as a new version without mutating the original generation (full version history retained).
- AC-10.3: "Re-steer" lets the operator change parameters for one artefact only (e.g. shorten the Executive Summary) and regenerate just that artefact from the same CCM, without re-running the others.
- AC-10.4: One-click export/download per artefact in its native format (DOCX/PDF/PPTX/JSON/SRT/MD) and a bundle export (ZIP) for the whole job.

#### US-11 — Audit Trail, Provenance & Access Control

> As a **platform administrator (P5)** I want **every job and artefact to be traceable** so that **the platform is auditable for government use**.
> 

**Acceptance Criteria:**

- AC-11.1: Every job records: source file(s) hash, ingestion timestamp, CCM version, steering spec used, model/version used per subagent, and operator identity.
- AC-11.2: Every artefact stores a lineage link back to the CCM fields it drew from (supports US-02 provenance).
- AC-11.3: Role-based access: at minimum, Operator (create/edit jobs) and Administrator (manage models/config, view all audit logs) roles.
- AC-11.4: Optional classification banner/handling marking can be attached to a job and is propagated into every artefact's header/footer.

#### US-12 — Air-Gapped / On-Premises Deployment

> As a **platform administrator (P5)** I want the **entire platform to run with no outbound internet access** so that **it can be deployed in a sensitive/air-gapped environment**.
> 

**Acceptance Criteria:**

- AC-12.1: Full stack (dashboard, orchestration, ingestion, local model inference, storage) deploys via a single container-orchestration command (Docker Compose-class) with no required external API calls at runtime.
- AC-12.2: All models (LLM, ASR, vision-language, TTS) are self-hosted/local-inference (vLLM/Ollama-class) with weights bundled or side-loadable, not called via hosted cloud APIs.
- AC-12.3: A network-sandbox test confirms zero egress during a full ingestion → CCM → multi-output generation cycle.
- AC-12.4: License audit confirms no restrictive (e.g. non-commercial) model weights or dependencies are present in the deployed build.

### 2.3 Non-Goals (Explicitly Out of Scope for V1)

- **No hosted/cloud LLM or API dependency in the default deployment** — self-hosted inference is the default; a cloud-model connector may exist as an optional, clearly-labelled, non-default mode for non-air-gapped evaluation only.
- **No final video rendering as a hard requirement** — the video *artefact suite* (script/storyboard/narration/subtitles/visual recs) is in scope; fully rendered MP4 output is a stretch goal (AC-06.5), not a blocking deliverable.
- **No social publishing/scheduling** — the platform produces publish-ready post text, not a connector that posts to LinkedIn/X on the operator's behalf (distinct from the Existing Solutions research's "Omnichannel Distribution" category, which this platform deliberately does not attempt to replace).
- **No end-to-end automated infographic image rendering as a hard requirement** — structured content + layout recommendations + a diagram-level preview are required; pixel-perfect designed graphics are a stretch/manual-designer handoff.
- **No multi-tenant SaaS billing/user-management suite** — role-based access (US-11) is required; a full enterprise IAM/billing system is not.
- **No translation quality guarantees beyond the selected output Language parameter** — language is a first-class steering parameter, but certified/legal-grade translation review remains a human step.
- **No fine-tuning pipeline in V1** — the platform uses base/instruction-tuned open models with prompting + structured-output constraints; a domain fine-tuning track is a V2 candidate.

---

## 3. AI System Requirements

### 3.1 Tool / Model Requirements

| Subsystem | Model / Engine Class | Runtime | License | Role in Pipeline |
| --- | --- | --- | --- | --- |
| **Core workflow / dashboard foundation** | `Dify`-class LLM app platform | Self-hosted, Docker | Apache-2.0-based (with additional conditions — requires legal review before adoption per Similar Repos analysis) | Base for workflow engine, model routing, RAG, and dashboard scaffolding; extended with custom nodes for CCM + multi-output fan-out |
| **Document ingestion** | `Docling`-class layout-aware parser | Self-hosted service | Open-source | PDF/DOCX/PPTX → structured Markdown/JSON preserving headings, tables, reading order |
| **Speech/video ingestion** | `Faster-Whisper`-class ASR | Self-hosted, GPU-accelerated | Open-source (MIT-class) | Timestamped transcription of video/audio inputs |
| **Vision-language ingestion** | `Qwen2-VL`-class VLM | Self-hosted inference | Open-source | Image/diagram captioning, OCR, visual context extraction |
| **Core LLM inference** | Local instruction-tuned LLM (e.g. Llama-3/Mistral-class) served via `vLLM` or `Ollama` | Self-hosted | Open-source (model-dependent — verify per-model license before shipping) | CCM extraction, subagent generation, consistency-check judging |
| **Orchestration** | `LangGraph` + `CrewAI`-class multi-agent framework | Self-hosted, Python | Open-source | Stateful DAG for ingestion → CCM → parallel subagent fan-out → validation |
| **Structured output enforcement** | `Instructor` + `Outlines` over `Pydantic v2` schemas | Self-hosted, Python | Open-source | Guarantees CCM and every structured artefact (Advisory, Infographic JSON, deck outline) conforms to schema before delivery |
| **Presentation rendering** | `presenton`-class engine and/or `Marp CLI` + `python-pptx` | Self-hosted / CLI | Apache-2.0 | Editable PPTX/PDF generation with templates, themes, charts |
| **Video script/asset pipeline reference** | `Deck2Video`-class pipeline + `Edge-TTS`/`Chatterbox`-class local TTS + `FFmpeg` | Self-hosted / CLI | Open-source | Optional narrated-video assembly (stretch, AC-06.5) |
| **Social post specialist pattern** | `social-media-agent`-class LangGraph pattern (adapted, not publish-connected) | Self-hosted | MIT | Reference implementation for LinkedIn/X-specific formatting agents |
| **Infographic/diagram rendering** | `Mermaid.js` / `QuickChart`-class templating | Self-hosted / embeddable | Open-source | Layout preview generation from structured infographic JSON |
| **Persistence** | Relational DB (e.g. Postgres) + object storage for source files/exports | Self-hosted | Open-source | Job/CCM/artefact/version/audit-log storage |
| **UI / Dashboard** | `Next.js` + `Shadcn UI` + WebSockets (or Dify's native dashboard, extended) | Self-hosted | Open-source | Upload, parameter panel, multi-artefact workbench, history/audit views |

**Reuse strategy (from Similar Repos analysis):** `Dify` is adopted as the base workflow/dashboard/model-routing foundation given its scale and maturity, with a legal review of its Apache-2.0-plus-conditions license before final adoption. `presenton` is integrated directly for the presentation output rather than rebuilt. The `social-media-agent` and `AI-Content-Studio` repositories are used as **pattern references** for the social and video subagents respectively (adapted into the CCM-driven pipeline, not used as-is, since neither natively supports the shared-CCM, multi-output-in-one-run model this platform requires). `Content-Repurposing-Pipeline` is used as an architectural reference for parallel multi-output job orchestration (async jobs, retries, validation) despite its narrow YouTube-only scope. `FlowiseAI/Flowise` is noted as archived (Aug 2026) and explicitly excluded as a foundation.

### 3.2 Evaluation Strategy

#### 3.2.1 Factual Fidelity & Hallucination Rate (K1)

- **Method:** An LLM-as-judge pass compares every generated artefact sentence-by-sentence against the CCM (and, where flagged as high-risk, the raw source) and flags unsupported claims.
- **Sampling:** Human review of a random 10% sample of judged artefacts per evaluation cycle to calibrate the automated judge.
- **Gate:** Any artefact with an unsupported-claim rate above threshold is marked "Needs Review" in the workbench (US-10) rather than silently delivered.

#### 3.2.2 Cross-Format Consistency (K2)

- **Method:** Extract named entities and numeric values from every sibling artefact of a job and diff them against the CCM's Entities/Metrics; disagreements are surfaced to the operator by the consistency-check agent (AC-04.4).
- **Test corpus:** A held-out set of sample reports run through all seven output types simultaneously, with manual annotation of "ground truth" facts to score against.

#### 3.2.3 Parameter Adherence (K3)

- **Method:** For each parameter axis (Audience, Tone, Language, Detail, Objective, Style), an LLM-judge rubric scores 1–5 whether the artefact matches the requested setting; scores below threshold trigger the same "Needs Review" flag.
- **Calibration set:** Paired prompts (e.g. "Executive / Neutral / High-level" vs "Tactical / Urgent / Technical" from the same source) scored by human reviewers to validate the rubric.

#### 3.2.4 Schema / Format Compliance (K4)

- **Method:** Every structured artefact (Advisory, Executive Summary, Infographic JSON, Presentation outline) is validated against its Pydantic schema before being marked "Ready"; failed validation triggers one automated repair re-prompt, then escalates to "Failed" for operator/administrator visibility.
- **Gate:** Zero unvalidated structured artefacts may reach the operator workbench — Pass/Fail.

#### 3.2.5 Latency & Throughput (K5)

- **Method:** Wall-clock instrumentation at each pipeline stage (Ingestion, CCM extraction, per-subagent generation, validation, delivery); reported as P50/P95/P99 per artefact type and per job (all selected outputs together).
- **Load test:** Concurrent multi-user job submission to confirm parallel fan-out does not degrade linearly with output-type count.

#### 3.2.6 Deployability / Air-Gap & License Compliance (K6)

- **Method:** Full pipeline exercised inside a network-isolated environment (no DNS/egress) with traffic capture to confirm zero external calls; SBOM generation and license scan to flag any restrictive/NC-licensed dependency before it can be bundled (mirroring the MMS-TTS-style license trap called out as a general risk pattern in this class of project).
- **Gate:** Pass/Fail — any egress attempt or restrictive-license dependency blocks release.

#### 3.2.7 Multi-Modal Ingestion Coverage (K7)

- **Method:** A regression corpus spanning clean text, scanned/complex PDFs, DOCX/PPTX, images with embedded diagrams, and short videos is run through ingestion; pass rate is the percentage producing a non-empty, schema-valid CCM.

---

## 4. Technical Specifications

### 4.1 Architecture Overview

#### 4.1.1 Component Diagram (Stages & Seams)

```
+----------------------------------------------------------------------+
|                    Operator Dashboard (Next.js/Shadcn)                |
|  Upload (multi-modal) • Parameter Panel • Multi-Artefact Workbench   |
|  History / Audit View • RBAC (Operator / Administrator)              |
+------------------------------|-----------------------------------------+
                                |
+------------------------------|-----------------------------------------+
|              Stage 1 — Multi-Modal Ingestion Service                  |
|   Docling (PDF/DOCX/PPTX) • Faster-Whisper (audio/video)              |
|   Qwen2-VL (images/diagrams) • PyMuPDF/FFmpeg (low-level helpers)     |
+------------------------------|-----------------------------------------+
                                |
+------------------------------|-----------------------------------------+
|          Stage 2 — Canonical Content Model (CCM) Extraction           |
|   Pydantic v2 schema + Instructor/Outlines + local LLM (vLLM/Ollama)  |
|   → Core Thesis, Key Points, Entities, Metrics, Timeline, Visuals,    |
|     Recommendations, Provenance pointers                              |
+------------------------------|-----------------------------------------+
                                |
+------------------------------|-----------------------------------------+
|             Stage 3 — Parameter Steering Engine                       |
|   Audience / Tone / Language / Detail / Objective / Style             |
|   → structured steering spec shared by all subagents                  |
+------------------------------|-----------------------------------------+
                                |
+------------------------------|-----------------------------------------+
|      Stage 4 — Parallel Subagent Synthesis Matrix (LangGraph/CrewAI)  |
|  Advisory | Executive Summary | LinkedIn | X/Twitter | Presentation   |
|  Video Script/Storyboard/Narration/Subtitles/Visual-Recs | Infographic|
+------------------------------|-----------------------------------------+
                                |
+------------------------------|-----------------------------------------+
|         Stage 5 — Schema Gatekeeper, Consistency Check & Render       |
|   Instructor/Outlines validation → consistency-diff agent →           |
|   presenton/python-pptx (deck) • Mermaid/QuickChart (infographic) •   |
|   Deck2Video/FFmpeg (optional video assembly)                         |
+------------------------------|-----------------------------------------+
                                |
+------------------------------|-----------------------------------------+
|        Stage 6 — Operator Workbench, Versioning & Dispatch            |
|   Side-by-side viewer • inline edit • re-steer single artefact •      |
|   export (DOCX/PDF/PPTX/JSON/SRT/MD/ZIP) • audit log                  |
+----------------------------------------------------------------------+
```

**Module Seams (Clean Architecture + Depth):**

| Module | Interface Is Test Surface | Depth Reasoning |
| --- | --- | --- |
| `ingestion` | `Ingestor::process(File) -> RawExtraction{markdown, transcripts, captions}` | Deep: hides Docling/Whisper/VLM differences behind one call; deletion concentrates all parser-specific bugs |
| `ccm-extractor` | `CcmExtractor::extract(RawExtraction) -> CanonicalContentModel` | Deep: schema validation, provenance tagging, repair-retry logic live here |
| `steering-engine` | `SteeringEngine::compile(ParamSelection) -> SteeringSpec` | Shallow adapter; mostly a typed mapping layer |
| `subagent-matrix` | `SubagentMatrix::generate(CCM, SteeringSpec, OutputTypes[]) -> Artefact[]` | Deep: fan-out orchestration, per-agent prompt templates, partial-failure isolation |
| `schema-gatekeeper` | `Gatekeeper::validate(Artefact) -> Valid | Repaired |
| `consistency-checker` | `ConsistencyChecker::diff(Artefact[]) -> ConflictReport` | Deep: entity/number cross-referencing logic |
| `renderer` | `Renderer::render(ArtefactType, Content) -> File` | Adapter over presenton/python-pptx/Mermaid/FFmpeg; one call per artefact type |
| `workbench` (Next.js) | State machine `JobState{status, artefacts[], versions[]}` via server-driven store | Shallow now — deepen via a `JobViewModel` hiding versioning + re-steer + export |

**Data Flow (single job) —**`[Upload: text/doc/image/video] → [Ingestion Service → RawExtraction] → [CCM Extractor → CanonicalContentModel + provenance] → [Steering Engine → SteeringSpec] → [Subagent Matrix: N parallel generators] → [Schema Gatekeeper: validate/repair] → [Consistency Checker: cross-artefact diff] → [Renderer: DOCX/PPTX/JSON/SRT] → [Workbench: review, edit, re-steer, export] → [Audit Log: full lineage recorded]`

#### 4.1.2 Project Structure (Enforced)

```
platform/
├── docker-compose.yml            # Full stack: dashboard, orchestrator, inference, DB, storage
├── services/
│   ├── ingestion/                 # Docling / Faster-Whisper / Qwen2-VL wrappers
│   │   ├── parsers/ pdf_parser.py docx_parser.py pptx_parser.py
│   │   ├── audio/  transcribe.py
│   │   └── vision/ caption_vlm.py
│   ├── ccm/                       # Canonical Content Model
│   │   ├── schema/ ccm_schema.py          # Pydantic v2 models
│   │   └── extractor/ ccm_extractor.py    # Instructor/Outlines-driven extraction
│   ├── steering/
│   │   └── steering_engine.py
│   ├── subagents/                 # LangGraph/CrewAI graph + per-format specialists
│   │   ├── advisory_agent.py
│   │   ├── exec_summary_agent.py
│   │   ├── linkedin_agent.py
│   │   ├── x_thread_agent.py
│   │   ├── presentation_agent.py
│   │   ├── video_suite_agent.py
│   │   ├── infographic_agent.py
│   │   └── graph.py                # Orchestration DAG / fan-out + fan-in
│   ├── gatekeeper/
│   │   └── schema_validator.py
│   ├── consistency/
│   │   └── consistency_checker.py
│   ├── renderer/
│   │   ├── deck_renderer.py         # presenton / python-pptx / Marp
│   │   ├── infographic_renderer.py  # Mermaid / QuickChart
│   │   └── video_assembler.py       # optional: Deck2Video / FFmpeg / TTS
│   └── audit/
│       └── lineage_logger.py
├── dashboard/                     # Next.js + Shadcn UI + WebSockets
│   ├── app/upload/
│   ├── app/parameters/
│   ├── app/workbench/
│   └── app/history/
└── tests/                         # unit + integration + regression corpora
```

**Build Constraints:**

- Python 3.11+ backend services; TypeScript/Next.js 14+ frontend.
- All inference containers pinned to CPU/GPU images that run without internet access at container start (model weights baked in or mounted, never pulled at runtime).
- Structured-output boundary (`Instructor`/`Outlines`) is mandatory at every LLM call that produces content consumed by another service — free-text-only LLM calls are confined to human-facing prose fields inside an already-validated schema.

#### 4.1.3 Concurrency & Orchestration Model

- **Ingestion:** Per-file async workers; heterogeneous file types in one job ingest concurrently and join before CCM extraction begins.
- **CCM extraction:** Single LLM call sequence per job (extraction → validation → optional repair), gating everything downstream.
- **Subagent fan-out:** All selected output-type subagents run as parallel graph nodes (LangGraph) sharing the same CCM + SteeringSpec as read-only inputs; each node's failure is isolated (AC-04.3).
- **Gatekeeper/Consistency:** Runs per-artefact as each subagent completes (not batched at the end), so early artefacts can reach "Ready" in the workbench while slower ones (e.g. video suite) are still generating.
- **Workbench:** WebSocket push of per-artefact status transitions (`Generating → Validating → Ready/Needs Review/Failed`) so the operator sees progress live rather than polling.

### 4.2 Integration Points

| Integration | Library / Project | Usage | Air-Gap Guarantee |
| --- | --- | --- | --- |
| **Workflow / model routing foundation** | `Dify` (Apache-2.0-based, license review required) | Base app platform, model abstraction, initial dashboard scaffolding | Yes — self-hosted Docker |
| **Document parsing** | `Docling` / `docling-serve` | PDF/DOCX/PPTX → structured Markdown/JSON | Yes — local service |
| **ASR** | `Faster-Whisper` | Timestamped video/audio transcription | Yes — local GPU inference |
| **Vision-language** | `Qwen2-VL` (or comparable open VLM) | Image/diagram captioning + OCR | Yes — local inference |
| **LLM inference** | `vLLM` or `Ollama` serving an open instruction-tuned model | CCM extraction, all subagent generation, judging | Yes — local inference, verify per-model license |
| **Orchestration** | `LangGraph` + `CrewAI` | Stateful DAG, parallel fan-out, human-in-the-loop review hooks | Yes — runs in-process/local |
| **Structured output** | `Instructor` + `Outlines` over `Pydantic v2` | CCM + every structured artefact schema enforcement | Yes — local library |
| **Presentation rendering** | `presenton` and/or `Marp CLI` + `python-pptx` | Editable PPTX/PDF generation | Yes — self-hosted/CLI |
| **Infographic rendering** | `Mermaid.js` / `QuickChart`-class | Layout preview from structured JSON | Yes — self-hosted/embeddable |
| **Optional video assembly** | `Deck2Video`-class + local TTS + `FFmpeg` | Narrated video from script/storyboard (stretch) | Yes — local, no cloud TTS |
| **Persistence** | Postgres + object storage | Jobs, CCM versions, artefacts, audit log | Yes — local |
| **Dashboard** | Next.js + Shadcn UI + WebSockets | Upload, parameters, workbench, history | Yes — self-hosted |

**Excluded by design:** Hosted/cloud-only generation APIs as the default path, GMS/App-store-style remote asset delivery, any dependency carrying a non-commercial or otherwise restrictive license (flagged via SBOM/license scan, K6).

### 4.3 Security & Privacy

- **Threat Model:** Adversary with network access to the deployment host attempting data exfiltration; insider risk of unauthorised artefact export; supply-chain risk from a restrictively-licensed or telemetry-phoning-home dependency being silently included.
- **Controls:**
    - **Air-gap enforcement:** No `INTERNET`equivalent egress required at runtime; CI includes a network-sandbox test that fails the build if any service attempts outbound DNS/HTTP during a full pipeline run.
    - **Access control:** Role-based access (Operator vs Administrator, US-11); classification/handling banner propagated from job to every artefact.
    - **Data at rest:** Source files, CCM, and artefacts encrypted at rest; export requires an explicit operator action, never automatic.
    - **Provenance & audit:** Every job's full lineage (source hash → CCM version → steering spec → model/version per subagent → operator identity) is immutable and queryable (AC-11.1–11.2).
    - **Dependency compliance:** SBOM generated per build; license scan blocks any NC/restrictive-licensed model or library from shipping in the release build (mirrors the general "MMS-TTS-style license trap" risk pattern in this class of AI system).
    - **Least privilege:** Ingestion and inference services run with no external network policy attached at the container-orchestration level in the air-gapped deployment profile.

### 4.4 Functional Requirements (Numbered — Testable)

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-01 | Dashboard accepts text, PDF/DOCX/PPTX, images, and video as source content, singly or combined in one job | P0 | Ingestion regression corpus, §3.2.7 |
| FR-02 | All ingested content is normalised into a schema-validated Canonical Content Model with provenance pointers | P0 | CCM schema unit tests + provenance spot check |
| FR-03 | Operator can set Audience, Tone, Language, Level of Detail, Communication Objective, and Content Style before generation | P0 | Steering-spec compile test, UI test |
| FR-04 | Operator can select any combination of the seven output-type families in one job and receive all of them from one CCM | P0 | Multi-output integration test |
| FR-05 | Presentation output is an editable PPTX/PDF with speaker notes, adaptive slide count by detail level | P0 | Deck renderer test, schema check |
| FR-06 | Video output bundle includes Script, Storyboard, Scene Descriptions, Narration Text, Subtitles, and Visual Recommendations as distinct sections | P0 | Video-suite schema test |
| FR-07 | LinkedIn and X/Twitter outputs are platform-formatted and share facts with sibling artefacts | P0 | Consistency-checker test, §3.2.2 |
| FR-08 | Advisory follows a fixed structured schema (severity/classification, summary, background, findings, recommendations, references) | P0 | Advisory schema validation test |
| FR-09 | Executive Summary respects a configurable length band driven by Level of Detail | P0 | Length-band unit test |
| FR-10 | Infographic output is structured JSON (headline, key-message blocks, layout/visual-hierarchy suggestions) plus a rendered layout preview | P0 | Infographic schema + render test |
| FR-11 | Every structured artefact is schema-validated before reaching "Ready" status; failed validation triggers one repair pass then escalates | P0 | Gatekeeper unit test, §3.2.4 |
| FR-12 | Operator workbench shows all artefacts of a job side by side with live status and supports inline edit + versioning | P0 | Workbench integration/UI test |
| FR-13 | Operator can re-steer and regenerate a single artefact without re-running the whole job | P0 | Re-steer integration test |
| FR-14 | Every job records full lineage (source hash, CCM version, steering spec, model/version, operator identity) | P0 | Audit-log integration test |
| FR-15 | Full stack deploys with zero required outbound network calls at runtime | P0 | Network-sandbox test, §3.2.6 |
| FR-16 | Consistency-checker flags cross-artefact factual disagreement without silently altering content | P1 | Consistency-checker unit test |
| FR-17 | Role-based access distinguishes Operator and Administrator capabilities | P1 | RBAC integration test |

### 4.5 Non-Functional Requirements

| ID | NFR | Target | Rationale |
| --- | --- | --- | --- |
| NFR-01 | **Job start latency** | Ingestion begins processing within 2 s of upload completion | Operator-facing responsiveness |
| NFR-02 | **Parallel scalability** | Adding an additional selected output type adds ≤15% to total job wall-clock time versus running it alone | True parallel fan-out, not hidden serialisation |
| NFR-03 | **Storage** | A completed job (source + CCM + all artefact versions) fits in a bounded per-job storage budget (e.g. ≤200 MB excluding raw video) | Predictable capacity planning |
| NFR-04 | **Reliability** | Partial subagent failure does not fail the whole job; failed artefact is independently retryable | AC-04.3 |
| NFR-05 | **Accessibility** | Dashboard meets WCAG AA contrast, keyboard navigation, and screen-reader labelling on all core flows | Government usability standards |
| NFR-06 | **Maintainability** | Clean separation of ingestion / CCM / steering / subagents / gatekeeper / renderer / workbench, each independently testable | Evaluator code review, module seam table §4.1.1 |
| NFR-07 | **Testability** | ≥80% unit coverage on CCM schema, gatekeeper, and consistency-checker; integration tests cover the full six-stage pipeline end to end | TDD discipline, §5.4 |
| NFR-08 | **Portability** | Entire stack reproducible via a single `docker compose up` on a fresh air-gapped host | Deployability KPI K6 |

### 4.6 UI/UX Specification

**Design System:** Clean, high-contrast, government-appropriate palette; no marketing-style gradients; clear status colour coding (Generating = amber, Ready = green, Needs Review = orange, Failed = red).

**Screens (5 + Dialogs):**

1. **Ingest / Upload Screen (Primary entry point)** — multi-file drop zone spanning text/PDF/DOCX/PPTX/image/video; live per-file ingestion status; free-form prompt text box for context-only jobs with no file.
2. **Parameter Configuration Screen** — six controls (Audience, Tone, Language, Detail, Objective, Style) as dropdown-plus-free-text; output-type multi-select grid (Video, LinkedIn, X/Twitter, Advisory, Infographic, Executive Summary, Presentation); saved-preset picker (AC-03.3).
3. **Workbench / Multi-Artefact Viewer** — tabbed or side-by-side card layout, one per selected output; inline edit; per-artefact "Re-steer" action; per-artefact and whole-job export.
4. **History / Audit Screen** — searchable job list, filter by date/operator/output type; opens the full lineage record for any past job (source hash, CCM version, parameters, models used).
5. **Administration Screen** — model/inference endpoint configuration, license/SBOM status, network-sandbox test result, role management.

**Guardrails:**

- No artefact may render in the workbench before passing the Schema Gatekeeper (US-10, FR-11) — a "Generating" state is shown until validation completes, never a partially-built document.
- Every artefact view carries a visible "View Source" affordance linking back to the specific CCM field(s)/source excerpt(s) it was generated from (AC-02.2, AC-11.2).
- Classification/handling banner (if set on the job) renders identically on every artefact's header, including exported files.

---

## 5. Risks & Roadmap

### 5.1 Technical Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation | Trigger Metric |
| --- | --- | --- | --- | --- | --- |
| R1 | **Hallucinated facts/numbers in generated artefacts** | High | P0 | Mandatory CCM-grounding for every subagent prompt; LLM-as-judge fact-check gate (K1); "Needs Review" flag instead of silent delivery | Unsupported-claim rate > threshold |
| R2 | **Cross-format factual drift** (Advisory says X, LinkedIn post says Y) | Med | P0 | Single shared CCM + SteeringSpec per job; post-generation consistency-diff agent (K2) | Entity/number mismatch across siblings |
| R3 | **Weak/ambiguous parameter adherence** | Med | P1 | Rubric-based LLM-judge scoring per parameter axis; curated presets to reduce free-text ambiguity | Adherence score < threshold |
| R4 | **Restrictive-license model or library slipping into the shipped build** (e.g. NC-licensed weights) | Med | P0 | SBOM + license scan gate (K6) before every release; `Dify` license terms reviewed explicitly before adoption | License scan failure |
| R5 | **Air-gap violation via a forgotten telemetry/update call** | Med | P0 | Network-sandbox CI test (K6); explicit no-egress deployment profile; least-privilege container networking | Any detected egress attempt |
| R6 | **Complex/scanned document parsing failures** (poor OCR, unusual layouts) | Med | P1 | Docling-class layout-aware parsing; fallback plain-text extraction with a visible "low-confidence ingestion" flag rather than silent failure | Ingestion pass rate < 95% (K7) |
| R7 | **Video artefact suite scope creep into full video rendering** | Med | P2 | Script/storyboard/narration/subtitles/visual-recs are the P0 deliverable; rendered MP4 assembly is explicitly a stretch goal (AC-06.5) | Timeline slip on P0 artefacts |
| R8 | **Presentation quality perceived as "generic AI slides"** | Low | P2 | Reuse a mature presentation engine (`presenton`) rather than hand-rolled slide layout; curated templates | Low reviewer rating on deck quality |
| R9 | **Orchestration deadlock/timeout on slow subagents blocking fast ones** | Low | P1 | Per-artefact independent completion and gatekeeping (§4.1.3); no single job-level barrier before delivering fast artefacts | Any subagent timeout blocking siblings |
| R10 | **Schema drift between CCM extraction and downstream subagent expectations** | Low | P1 | CCM schema versioned; subagents pinned to a CCM schema version; contract tests on schema change | Subagent schema-mismatch error rate |

### 5.2 Phased Rollout (8-Week Engineering Roadmap)

> As with the reference PRD structure, every phase follows TDD (failing test first) and a "verification before completion" checklist per module seam.
> 

#### Phase 0 — Inception (Week 0, 3 days)

- **Goals:** Repo init, `docker-compose.yml` skeleton (Postgres + object storage + placeholder inference container), CI with lint + unit test runner + network-sandbox smoke test.
- **Exit:** `docker compose up` boots an empty stack; CI green on an intentionally-failing `CcmSchemaTest` (RED).

#### Phase 1 — Ingestion & CCM Pipeline (Weeks 1–2)

- **Scope:** Wire Docling/Faster-Whisper/Qwen2-VL wrappers; define the CCM Pydantic schema; implement Instructor/Outlines-driven extraction with repair-retry.
- **Tasks (TDD):** `IngestionRegressionTest` (per-modality pass rate, §3.2.7), `CcmSchemaTest` (validation + provenance), `CcmExtractorTest` (repair-on-failure path).
- **Exit:** A sample multi-modal corpus produces schema-valid CCMs at ≥95% pass rate; no UI yet.

#### Phase 2 — Steering & Subagent Matrix (Weeks 3–4)

- **Scope:** Implement SteeringSpec compiler; build the LangGraph/CrewAI fan-out with the seven output-family subagents (Advisory, Executive Summary, LinkedIn, X/Twitter, Presentation, Video suite, Infographic).
- **Tasks (TDD):** `SteeringEngineTest`, one contract test per subagent asserting schema-valid output from a fixed CCM fixture, `PartialFailureIsolationTest`.
- **Exit:** All seven artefact types generate from one fixture CCM in parallel; partial-failure isolation verified.

#### Phase 3 — Gatekeeper, Consistency & Rendering (Weeks 5–6)

- **Scope:** Schema Gatekeeper validation/repair path; consistency-diff agent; renderer integrations (`presenton`/python-pptx for decks, Mermaid/QuickChart for infographics).
- **Tasks (TDD):** `SchemaGatekeeperTest`, `ConsistencyCheckerTest` (deliberately-conflicting fixture artefacts), `DeckRendererTest`, `InfographicRendererTest`.
- **Exit:** End-to-end pipeline (upload → CCM → 7 artefacts → validated/rendered files) runs on the test corpus with zero unvalidated artefacts delivered.

#### Phase 4 — Workbench, Audit & Hardening (Weeks 7–8)

- **Scope:** Next.js dashboard (5 screens), WebSocket status streaming, versioning + re-steer, audit-log lineage, RBAC, air-gap network-sandbox hardening.
- **Tasks:** `WorkbenchIntegrationTest`, `AuditLineageTest`, `NetworkSandboxTest` (K6), `LicenseScanTest` (K6), load test for K5 latency targets.
- **Exit (Pre-Deployment Verification):**
    - Zero egress detected in air-gapped run ✓
    - All structured artefacts schema-valid ✓
    - Consistency-diff clean on test corpus ✓
    - Latency targets (K5) met on reference hardware ✓
    - SIH deliverables assembled: source repo, README, ≤2-page architecture doc, ≤2-minute demo video, ≤5-slide technical presentation ✓

#### Phase 5 — V1.1 (Post-Submission, if time permits)

- **Scope:** Optional narrated-video assembly (AC-06.5) via Deck2Video/FFmpeg/local TTS; domain-specific schema packs (e.g. STIX-inspired threat-intel fields); saved-preset sharing across operators; multi-language UI.

#### Phase 6 — V2.0 (Beyond SIH)

- **Scope:** Fine-tuning track for domain tone/style; pluggable classification-aware redaction; enterprise RBAC/IAM integration; additional output-family plugins (e.g. press release, FAQ) via the same CCM-driven subagent pattern.

### 5.3 Milestones & Deliverables to SIH

| Milestone | Target Week | Artifact | Maps to Problem-Statement Deliverable |
| --- | --- | --- | --- |
| M1 — Ingestion + CCM Proven | W2 | Ingestion regression report + CCM schema | Foundation for "Analyse the input / understand context and intent" |
| M2 — Multi-Output Generation Proven | W4 | Contract-test report across all 7 output families | "Generate the requested output artefact(s)" + "Multiple Outputs" requirement |
| M3 — Validated, Rendered, Consistent Pipeline | W6 | End-to-end pipeline demo (internal) + consistency report | "Allow control over generation parameters" + quality gates |
| M4 — SIH Submission | W8 | **Source code repo link, README with setup instructions, Architecture Document (≤2 pages), Demo Video (≤2 minutes), Technical Presentation (≤5 slides)** | Exact deliverable list from PS 26154 |

### 5.4 Testing & Quality Strategy

**TDD Discipline:** No production code without a failing test first. Every service (`ingestion`, `ccm`, `steering`, `subagents`, `gatekeeper`, `consistency`, `renderer`) has a dedicated test module; watch RED → minimal GREEN → REFACTOR.

| Layer | Tool | Coverage Gate | Examples |
| --- | --- | --- | --- |
| **CCM & Schemas** | `pytest` + `pydantic` validators | 90% | `ccm_schema_test.py` (required fields, provenance pointers) |
| **Ingestion** | `pytest` + fixture corpus | 95% pass rate on regression corpus | `pdf_parser_test.py`, `transcribe_test.py`, `caption_vlm_test.py` |
| **Subagents** | `pytest` + fixed CCM fixtures | Schema-valid output on 100% of fixtures | `advisory_agent_test.py`, `video_suite_agent_test.py` |
| **Gatekeeper / Consistency** | `pytest` with deliberately-broken/conflicting fixtures | 100% detection on injected-error fixtures | `schema_validator_test.py`, `consistency_checker_test.py` |
| **Orchestration** | `pytest` + LangGraph test harness | Partial-failure isolation verified | `graph_partial_failure_test.py` |
| **Dashboard** | `Playwright`/`Jest` | Core flows (upload → parameters → workbench → export) | `workbench.spec.ts` |
| **End-to-End** | Full-stack integration run against `docker compose` | P0 paths only | Upload sample report → select all 7 outputs → verify all Ready + consistent |
| **Security/Air-Gap** | Network-sandbox capture + SBOM/license scanner | Zero egress, zero restrictive licenses | `network_sandbox_test.py`, `license_scan.py` |

**CI Pipeline:** `lint → unit tests (per service) → schema/contract tests → integration (docker compose) → network-sandbox + license scan → artifact bundle (repo zip + docs)`

---

## Appendix A — SIH Compliance Matrix

| PS 26154 Requirement | PRD Section | Compliance Summary |
| --- | --- | --- |
| Input: English text, documents, articles, reports, prompts, images, videos, contextual information | §2.2 US-01, §3.1, §4.1.1 Stage 1 | Docling + Faster-Whisper + Qwen2-VL ingestion, unified into CCM |
| Operator dashboard with configurable output-type selection | §2.2 US-04, §4.6 Screen 2 | Multi-select output grid over 7 families |
| Analyse input → understand context/intent → generate requested artefact(s) | §2.2 US-02–US-09, §4.1.1 Stages 2–5 | CCM extraction + steering + subagent matrix |
| Control over Audience, Tone, Language, Detail, Objective, Style | §2.2 US-03, FR-03 | Six explicit steering controls, shared spec across all outputs |
| Video: Script, Storyboard, Scene descriptions, Narration, Subtitles, Visual recs | §2.2 US-06, FR-06 | Full six-part bundle as distinct sections |
| LinkedIn Post | §2.2 US-07, FR-07 | Platform-formatted, CCM-grounded |
| Twitter/X Post (single or thread) | §2.2 US-07, FR-07 | Length-aware single/thread generation |
| Advisory (structured document) | §2.2 US-08, FR-08 | Fixed CERT-In-inspired schema, validated |
| Infographic content + layout recommendations | §2.2 US-09, FR-10 | Structured JSON + rendered layout preview |
| Executive Summary | §2.2 US-08, FR-09 | Length-band controlled by Detail parameter |
| Presentation (slides + speaker notes) | §2.2 US-05, FR-05 | Editable PPTX/PDF via presenton/python-pptx |
| Multiple Outputs from same source content | §2.2 US-04, FR-04 | Parallel fan-out from one CCM |
| Source Code Link | §5.3 M4 | Repository delivered per milestone M4 |
| README with Setup Instructions | §5.3 M4, §4.1.2 | Project structure documented; setup via `docker compose up` |
| Architecture Document (≤2 pages) | §5.3 M4 | Condensed from §4.1 architecture overview |
| Demo Video (≤2 minutes) | §5.3 M4 | Scripted from US-04 multi-output demo path |
| Technical Presentation (≤5 slides) | §5.3 M4 | Condensed from §1–§4 |

## Appendix B — Canonical Content Model (CCM) Schema Reference (Illustrative)

```python
class Provenance(BaseModel):
    source_id: str
    location: str          # page/section/timestamp reference

class Metric(BaseModel):
    label: str
    value: str
    provenance: Provenance

class CanonicalContentModel(BaseModel):
    core_thesis: str
    key_points: list[str]
    entities: list[str]
    metrics: list[Metric]
    timeline: list[str]
    visuals: list[dict]          # {caption, provenance}
    recommendations: list[str]
    open_questions: list[str]
    provenance_index: dict[str, Provenance]
    schema_version: str
```

## Appendix C — Glossary & References

- **CCM** — Canonical Content Model; the single structured, fact-preserving intermediate representation every artefact is generated from.
- **Subagent Matrix** — the set of parallel, per-output-type generation agents (LangGraph/CrewAI) that consume the same CCM + SteeringSpec.
- **Schema Gatekeeper** — the validation choke-point (Instructor/Outlines/Pydantic) every structured artefact must pass before delivery.
- **Air-gapped** — deployment with no required outbound network access at runtime, verified via network-sandbox testing.
- **SteeringSpec** — the compiled, structured representation of the six operator-selected generation parameters (Audience, Tone, Language, Detail, Objective, Style).
- Primary research: `Existing Solutions & Building Blocks` and `Similar Repos` documents — architecture pattern, tool shortlist, and competitive gap analysis sourced there; this PRD is authoritative for SIH build decisions where the PS and the research diverge (PS prevails).

## Appendix D — Open Risks / Decisions Needed (For Review)

- **D1 — Dify license review:** Confirm whether Dify's Apache-2.0-plus-conditions license is acceptable for an NTRO deployment before committing it as the workflow foundation; if not, fall back to a from-scratch LangGraph/CrewAI orchestration layer with a lighter dashboard framework.
- **D2 — Rendered video as MVP vs stretch:** Confirm with evaluators whether a fully rendered MP4 (AC-06.5) is expected for the demo, or whether the script/storyboard/narration/subtitles/visual-recommendations bundle alone satisfies the "Video" output requirement.
- **D3 — Official SIH evaluation weighting:** No numeric rubric was published for PS 26154 at the time of writing; §1.3 KPIs are proposed internal targets and should be reconciled against the official rubric once released.
- **D4 — Classification/handling scheme:** Confirm the exact classification banner taxonomy NTRO expects (if any) so US-11's classification propagation uses the correct labels rather than a generic placeholder.

---

*End of PRD — Next step: review D1–D4, then implement Phase 1 per TDD (write failing `CcmSchemaTest` first) — no production code before tests.*