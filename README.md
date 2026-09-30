<div align="center">

<img src="https://img.shields.io/badge/SIH%202026-Problem%2026154-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Organization-NTRO-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Theme-Smart%20Automation-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/Category-Software-purple?style=for-the-badge" />

---

# 🧠 GenAI Automated Platform

### *AI-Powered Multi-Modal Content Transformation for Government & Enterprise*

**One source. Seven output formats. Parallel. Air-gapped. Audit-ready.**

[📖 Architecture](#-architecture) • [🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠 Tech Stack](#-tech-stack) • [📊 KPIs](#-success-criteria--kpis) • [🗺 Roadmap](#-roadmap)

</div>

---

## 🎯 The Problem

Intelligence analysts, communications officers, and policy teams at organisations like **NTRO** routinely need to convert a single source — a threat report, policy advisory, incident writeup — into **multiple distinct communication artefacts** for different audiences:

| Audience | Format |
|---|---|
| Executives | Executive Summary, Presentation |
| Public / Partners | LinkedIn Post, X/Twitter Thread |
| Technical Teams | Advisory Document, Infographic |
| Training Programs | Video Script, Storyboard, Narration |

Today, this is done **entirely by hand** — analysts read the source and separately draft each deliverable, introducing inconsistency, duplicating effort, and creating risk when facts drift between versions. Existing tools solve only narrow slices:

- ✗ **Writing assistants** (Jasper, Copy.ai) — text-in/text-out only, no visual or video output
- ✗ **Design tools** (Gamma, Canva) — visual-first, no formal document or video output
- ✗ **Video tools** (Opus Clip) — video-in/video-out only, no cross-format generation
- ✗ **Distribution tools** (Repurpose.io) — republish existing content, never transform it
- ✗ **None** combine multi-modal input + parallel multi-format output + on-prem/air-gapped deployment

---

## 💡 The Solution

> **GenAI Automated Platform** is a self-hostable, air-gapped, operator-controlled content transformation engine.

Upload any source content. Set your audience, tone, and intent. Receive **all seven output formats simultaneously** — each schema-validated, fact-consistent, and traceable back to the original source.

```
[Text / PDF / DOCX / PPTX / Image / Video]
                    ↓
      ┌─── Canonical Content Model ───┐
      │  (structured, fact-preserving) │
      └────────────┬──────────────────┘
                   │  parallel fan-out
        ┌──────────┼──────────┐
        ↓          ↓          ↓ ...
   Advisory   LinkedIn    Presentation
   Exec Summ  X/Twitter   Video Suite
   Infographic            (7 total)
```

The core architectural principle: **never generate a final artefact straight from raw input.** Always route through the Canonical Content Model (CCM) first — so facts, numbers, and entities stay consistent across every format.

---

## ✨ Features

### 📥 Multi-Modal Ingestion
- **Documents:** PDF, DOCX, PPTX — layout-aware parsing preserving headings, tables, and reading order (Docling)
- **Audio/Video:** Timestamped transcription with keyframe sampling (Faster-Whisper + FFmpeg)
- **Images:** Visual captioning, OCR, and diagram semantic extraction (Qwen2-VL)
- **Text:** Plain/rich text paste and free-form prompt jobs with no file

### 🧩 Canonical Content Model (CCM)

A Pydantic-v2-validated intermediate representation extracted from every source:

```python
class CanonicalContentModel(BaseModel):
    core_thesis: str
    key_points: list[str]
    entities: list[str]
    metrics: list[Metric]          # each with provenance pointer
    timeline: list[str]
    visuals: list[dict]            # caption + source reference
    recommendations: list[str]
    open_questions: list[str]
    provenance_index: dict[str, Provenance]
    schema_version: str
```

> Every field carries a **provenance pointer** back to the exact source page/section/timestamp — enabling full human review before anything goes out.

### ⚙️ Parameter-Controlled Generation

Six operator-facing steering controls, shared identically across every output in a run:

| Parameter | Options |
|---|---|
| **Target Audience** | Executive, Technical, General Public, Press, Tactical |
| **Tone** | Neutral, Urgent, Formal, Conversational, Authoritative |
| **Language** | English + multilingual output |
| **Level of Detail** | High-level summary → Full detailed report |
| **Communication Objective** | Inform, Alert, Educate, Persuade, Document |
| **Content Style** | Analytical, Narrative, Bullet-driven, Data-led |

Presets can be saved and reused (e.g. *"Tactical / Urgent / Technical"* vs *"Executive / Neutral / High-level"*).

### 🚀 Parallel Multi-Output Generation

All seven output families generated **simultaneously** from a single CCM + steering spec:

| # | Output Type | Key Characteristics |
|---|---|---|
| 1 | **Advisory** | Fixed schema (severity, findings, recommendations, references), CERT-In-inspired, DOCX/PDF/MD export |
| 2 | **Executive Summary** | Configurable length band (150–300 words) driven by detail level |
| 3 | **LinkedIn Post** | Professional conventions, tone-aware, hashtag-optional |
| 4 | **X/Twitter Post / Thread** | Character-limit aware, auto thread on long content |
| 5 | **Presentation** | Editable PPTX + speaker notes, adaptive slide count (≤6 Executive / ≤15 Detailed) |
| 6 | **Video Artefact Suite** | Script, Storyboard, Scene Descriptions, Narration Text (timed), Subtitles (SRT/VTT), Visual Recommendations |
| 7 | **Infographic** | Structured JSON + rendered layout preview (Mermaid/QuickChart) |

### 🛡️ Schema Gatekeeper & Consistency Checker

- Every structured artefact must pass **Pydantic v2 / Instructor / Outlines** schema validation before it's marked *Ready*
- Failed validation triggers one automated repair re-prompt, then escalates to *Failed* for operator visibility
- A **cross-artefact consistency-diff agent** automatically flags any numeric or entity disagreement between sibling outputs

### 🔒 Air-Gapped / On-Premises Deployment

- **Zero outbound network calls** at runtime — verified by network-sandbox CI test
- All models (LLM, ASR, VLM, TTS) are self-hosted via vLLM / Ollama
- Single-command stack start: `docker compose up`
- No restrictive (NC) licensed model weights — SBOM scan gates every release

### 📋 Operator Workbench & Full Audit Trail

- **Side-by-side multi-artefact viewer** with live WebSocket status (Generating → Validating → Ready / Needs Review / Failed)
- **Inline editing** with full version history — edits never mutate original generations
- **Re-steer** single artefacts with new parameters without re-running the whole job
- **One-click export** per artefact (DOCX / PDF / PPTX / JSON / SRT / MD) or ZIP bundle
- **Immutable audit log** per job: source hash, CCM version, steering spec, model/version per subagent, operator identity

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│           Operator Dashboard (Next.js + Shadcn UI)              │
│  Upload (multi-modal) • Parameters • Workbench • Audit • Admin  │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│              Stage 1 — Multi-Modal Ingestion Service            │
│   Docling (PDF/DOCX/PPTX) • Faster-Whisper (audio/video)       │
│   Qwen2-VL (images/diagrams) • PyMuPDF / FFmpeg (helpers)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│         Stage 2 — Canonical Content Model (CCM) Extraction      │
│   Pydantic v2 schema + Instructor/Outlines + local LLM          │
│   → Core Thesis, Key Points, Entities, Metrics, Timeline,       │
│     Recommendations, Provenance pointers                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                Stage 3 — Parameter Steering Engine              │
│   Audience / Tone / Language / Detail / Objective / Style       │
│   → structured SteeringSpec shared by ALL subagents             │
└────────────────────────┬────────────────────────────────────────┘
                         │  parallel fan-out
┌────────────────────────▼────────────────────────────────────────┐
│        Stage 4 — Parallel Subagent Synthesis Matrix             │
│   Advisory | Exec Summary | LinkedIn | X/Twitter | Presentation │
│   Video Script/Storyboard/Narration/Subtitles | Infographic     │
│    (LangGraph orchestration — partial-failure isolated)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│     Stage 5 — Schema Gatekeeper, Consistency Check & Render     │
│   Instructor/Outlines validation → consistency-diff agent       │
│   presenton/python-pptx (deck) • Mermaid/QuickChart (info)     │
│   Deck2Video/FFmpeg (optional narrated video assembly)          │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│        Stage 6 — Operator Workbench, Versioning & Dispatch      │
│   Side-by-side viewer • Inline edit • Re-steer • Export         │
│   Audit Log: full lineage per job                               │
└─────────────────────────────────────────────────────────────────┘
```

### Module Seams

| Module | Interface | Depth |
|---|---|---|
| `ingestion` | `Ingestor::process(File) → RawExtraction` | **Deep** — hides Docling/Whisper/VLM differences |
| `ccm-extractor` | `CcmExtractor::extract(RawExtraction) → CCM` | **Deep** — schema validation, provenance, repair-retry |
| `steering-engine` | `SteeringEngine::compile(Params) → SteeringSpec` | Shallow adapter |
| `subagent-matrix` | `SubagentMatrix::generate(CCM, Spec, Types[]) → Artefact[]` | **Deep** — fan-out, prompts, failure isolation |
| `schema-gatekeeper` | `Gatekeeper::validate(Artefact) → Valid\|Repaired\|Failed` | **Deep** — mandatory choke-point |
| `consistency-checker` | `ConsistencyChecker::diff(Artefact[]) → ConflictReport` | **Deep** — entity/number cross-reference logic |
| `renderer` | `Renderer::render(Type, Content) → File` | Adapter over presenton/Mermaid/FFmpeg |

---

## 🛠 Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | Next.js 14 + Shadcn UI + WebSockets | Operator dashboard, real-time status streaming |
| **Orchestration** | LangGraph + CrewAI | Stateful DAG, parallel subagent fan-out |
| **Document Ingestion** | Docling | PDF/DOCX/PPTX → structured Markdown/JSON |
| **Audio/Video Ingestion** | Faster-Whisper + FFmpeg | Timestamped ASR transcription |
| **Vision Ingestion** | Qwen2-VL | Image captioning, OCR, diagram extraction |
| **LLM Inference** | vLLM / Ollama (Llama-3 / Mistral-class) | CCM extraction, subagent generation, judging |
| **Structured Output** | Instructor + Outlines + Pydantic v2 | Schema-enforced generation at every LLM boundary |
| **Presentation Rendering** | presenton + python-pptx + Marp CLI | Editable PPTX/PDF generation |
| **Infographic Rendering** | Mermaid.js / QuickChart | Layout preview from structured JSON |
| **Video Assembly (Stretch)** | Deck2Video + Edge-TTS + FFmpeg | Narrated video from script/storyboard bundle |
| **Persistence** | PostgreSQL + Object Storage | Jobs, CCM, artefacts, audit log |
| **Deployment** | Docker Compose | Single-command, air-gapped stack |

---

## 📊 Success Criteria / KPIs

| KPI | Threshold | Stretch | Measurement |
|---|---|---|---|
| **K1 Factual Fidelity** | ≤2% unsupported claims/artefact | ≤1% | LLM-as-judge + 10% human spot audit |
| **K2 Cross-Format Consistency** | ≥95% entity/number agreement across siblings | ≥99% | Automated entity/number diff |
| **K3 Parameter Adherence** | ≥90% adherence to steering spec | ≥95% | Rubric-based LLM scoring |
| **K4 Schema Compliance** | 100% structured artefacts pass validation | — | Pydantic gate — Pass/Fail |
| **K5 Generation Latency** | Text < 45s P95 · Deck < 90s · Video Suite < 120s | N outputs ≤1.3× slowest single | Wall-clock instrumentation |
| **K6 Air-Gap / License** | Zero egress · Zero NC-licensed dependencies | — | Network sandbox + SBOM scan |
| **K7 Ingestion Coverage** | ≥95% of multi-modal corpus → valid CCM | — | Per-modality regression corpus |

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose (v2.20+)
- NVIDIA GPU recommended (CPU-only mode supported)
- 32 GB RAM minimum for full model stack

### 1. Clone & Configure

```bash
git clone https://github.com/Yashvin12/GenAI-Automated-Platform.git
cd GenAI-Automated-Platform

# Copy environment template
cp .env.example .env

# (Optional) Mount local model weights to skip download
# Edit .env: MODEL_WEIGHTS_PATH=/path/to/weights
```

### 2. Start the Full Stack

```bash
docker compose up
```

This single command boots:
- 🖥 **Dashboard** — `http://localhost:3000`
- ⚙️ **Orchestration API** — `http://localhost:8000`
- 🤖 **LLM Inference** (vLLM/Ollama) — `http://localhost:11434`
- 🗄 **PostgreSQL** + Object Storage

> ✅ **No outbound network calls are made after container start.** All model weights are bundled or side-loaded via mounted volumes.

### 3. Run Your First Job

1. Open `http://localhost:3000`
2. **Upload** a source document (PDF, DOCX, PPTX, image, video, or paste text)
3. **Configure parameters** — set Audience, Tone, Language, Detail, Objective, Style
4. **Select outputs** — check any/all of the 7 output families
5. **Generate** — watch artefacts appear live in the Workbench as they complete
6. **Review, edit, and export** — inline edit, re-steer individual artefacts, download as ZIP

### 4. Air-Gap Verification (Optional)

```bash
# Confirm zero egress during a full pipeline run
docker compose run --rm network-sandbox-test

# License / SBOM compliance scan
docker compose run --rm license-scan
```

---

## 📁 Project Structure

```
platform/
├── docker-compose.yml              # Full stack: dashboard, orchestrator, inference, DB, storage
├── services/
│   ├── ingestion/                  # Docling / Faster-Whisper / Qwen2-VL wrappers
│   │   ├── parsers/                #   pdf_parser.py  docx_parser.py  pptx_parser.py
│   │   ├── audio/                  #   transcribe.py
│   │   └── vision/                 #   caption_vlm.py
│   ├── ccm/                        # Canonical Content Model
│   │   ├── schema/                 #   ccm_schema.py  (Pydantic v2)
│   │   └── extractor/              #   ccm_extractor.py  (Instructor/Outlines)
│   ├── steering/
│   │   └── steering_engine.py
│   ├── subagents/                  # LangGraph DAG + per-format specialists
│   │   ├── advisory_agent.py
│   │   ├── exec_summary_agent.py
│   │   ├── linkedin_agent.py
│   │   ├── x_thread_agent.py
│   │   ├── presentation_agent.py
│   │   ├── video_suite_agent.py
│   │   ├── infographic_agent.py
│   │   └── graph.py                #   Orchestration DAG / fan-out + fan-in
│   ├── gatekeeper/
│   │   └── schema_validator.py
│   ├── consistency/
│   │   └── consistency_checker.py
│   ├── renderer/
│   │   ├── deck_renderer.py        #   presenton / python-pptx / Marp
│   │   ├── infographic_renderer.py #   Mermaid / QuickChart
│   │   └── video_assembler.py      #   (stretch) Deck2Video / FFmpeg / TTS
│   └── audit/
│       └── lineage_logger.py
├── dashboard/                      # Next.js + Shadcn UI
│   ├── app/upload/                 #   Multi-modal drop zone
│   ├── app/parameters/             #   6-control steering panel + output selector
│   ├── app/workbench/              #   Multi-artefact viewer + re-steer + export
│   └── app/history/                #   Searchable job audit log
└── tests/
    ├── unit/                       # Per-service pytest modules
    ├── integration/                # Full pipeline tests via docker compose
    ├── regression/                 # Multi-modal ingestion corpus
    └── security/                   # Network sandbox + license scan
```

---

## 🧪 Testing

```bash
# Unit tests (per service)
pytest services/ -v

# Integration — full pipeline end-to-end
docker compose -f docker-compose.test.yml run integration-tests

# Ingestion regression corpus (K7)
pytest tests/regression/ -v

# Schema / consistency contract tests
pytest tests/unit/gatekeeper/ tests/unit/consistency/ -v

# Network sandbox + license compliance (K6)
pytest tests/security/ -v

# Dashboard (Playwright)
cd dashboard && npx playwright test
```

**Coverage targets:**
- CCM schema & gatekeeper: **≥90%** unit coverage
- Ingestion corpus: **≥95%** modality pass rate  
- Schema validation: **100%** detection on injected-error fixtures
- End-to-end: Upload sample report → select all 7 outputs → all *Ready* + consistent

**CI Pipeline:** `lint → unit tests → schema/contract tests → integration (docker compose) → network-sandbox + license scan → artefact bundle`

---

## 🗺 Roadmap

| Phase | Weeks | Scope | Exit Criteria |
|---|---|---|---|
| **Phase 0** — Inception | W0 (3 days) | Repo init, Docker skeleton, CI with network-sandbox smoke test | `docker compose up` boots; CI green on RED `CcmSchemaTest` |
| **Phase 1** — Ingestion & CCM | W1–2 | Docling/Whisper/VLM wrappers, CCM schema, Instructor extraction + repair | Multi-modal corpus → ≥95% schema-valid CCMs |
| **Phase 2** — Steering & Subagents | W3–4 | SteeringSpec compiler, LangGraph fan-out, all 7 output-family subagents | 7 artefact types generated in parallel from fixture CCM |
| **Phase 3** — Gatekeeper & Render | W5–6 | Schema gatekeeper, consistency-diff agent, presenton/Mermaid renderers | Zero unvalidated artefacts in full pipeline run |
| **Phase 4** — Workbench & Hardening | W7–8 | Next.js dashboard (5 screens), WebSocket streaming, RBAC, air-gap hardening | Zero egress ✓ · All artefacts schema-valid ✓ · K5 latency targets met ✓ |
| **Phase 5** — V1.1 | Post-SIH | Narrated video (AC-06.5), domain schema packs, preset sharing | — |
| **Phase 6** — V2.0 | Beyond SIH | Fine-tuning pipeline, pluggable redaction, enterprise RBAC, output-family plugins | — |

---

## 🔐 Security & Compliance

| Control | Implementation |
|---|---|
| **Air-gap enforcement** | No egress required at runtime; CI network-sandbox test fails build on any outbound call |
| **Access control** | Role-based: Operator (create/edit jobs) · Administrator (config, models, audit logs) |
| **Data at rest** | Source files, CCM, artefacts encrypted at rest; export is always an explicit operator action |
| **Audit immutability** | Every job: source hash → CCM version → steering spec → model/version per subagent → operator ID |
| **Classification propagation** | Optional handling banner on a job propagates identically to every artefact header/footer and export |
| **Dependency compliance** | SBOM generated per build; license scan blocks NC-licensed models or libraries from shipping |
| **Least privilege** | Ingestion and inference containers run with no external network policy in air-gapped profile |

---

## 👥 User Personas

| Persona | Role | Primary Output |
|---|---|---|
| **P1 — Intelligence / Threat Analyst** | Turns threat reports into distributable advisories | Advisory, Executive Summary |
| **P2 — Communications / Outreach Officer** | Converts approved reports into public-facing social content | LinkedIn Post, X/Twitter |
| **P3 — Briefing / Training Officer** | Builds leadership decks and video explainers | Presentation, Video Suite |
| **P4 — Executive / Decision-Maker** | Reviews generated summaries and decks | Executive Summary, Presentation |
| **P5 — Platform Administrator** | Configures deployment, verifies air-gap, runs the demo | All (verification) |

---

## 📋 SIH Compliance Matrix

| PS 26154 Requirement | Status |
|---|---|
| Input: text, documents, articles, reports, prompts, images, videos | ✅ Full multi-modal ingestion (Docling + Whisper + Qwen2-VL) |
| Operator dashboard with configurable output-type selection | ✅ Multi-select grid across 7 output families |
| Analyse input → understand context → generate artefacts | ✅ CCM extraction + steering + subagent matrix |
| Control: Audience, Tone, Language, Detail, Objective, Style | ✅ 6 explicit steering controls, shared SteeringSpec |
| Video: Script, Storyboard, Scene Desc, Narration, Subtitles, Visual Recs | ✅ Full 6-part bundle as distinct downloadable sections |
| LinkedIn Post | ✅ Platform-formatted, CCM-grounded |
| Twitter/X Post or Thread | ✅ Character-limit aware, auto-thread on long content |
| Advisory (structured document) | ✅ Fixed CERT-In-inspired schema, validated |
| Infographic content + layout recommendations | ✅ Structured JSON + rendered layout preview |
| Executive Summary | ✅ Length-band controlled by Detail parameter |
| Presentation (slides + speaker notes) | ✅ Editable PPTX/PDF via presenton/python-pptx |
| Multiple Outputs from same source | ✅ Parallel fan-out from one CCM |
| README with setup instructions | ✅ This document |
| Architecture Document (≤2 pages) | ✅ `docs/architecture.md` |
| Demo Video (≤2 minutes) | 🎬 `docs/demo.mp4` |
| Technical Presentation (≤5 slides) | 📊 `docs/presentation.pptx` |

---

## 🤝 Contributing & Development

```bash
# Python backend (3.11+)
cd services
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt

# Next.js frontend (Node 20+)
cd dashboard
npm install
npm run dev
```

**TDD Discipline:** No production code without a failing test first.  
Watch `RED → minimal GREEN → REFACTOR` per module seam.

---

<div align="center">

**Built for Smart India Hackathon 2026 · Problem Statement 26154**

*National Technical Research Organisation (NTRO) · Smart Automation Theme*

</div>
