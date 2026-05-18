# Personal Knowledge Internalization Agent V1

## 1. Document Positioning

This document is the single source of truth for V1 product definition and development execution.

It includes:

1. PRD
2. Page and feature definition
3. Core data model
4. Workflow and status design
5. Technical architecture
6. Development phases and acceptance criteria
7. Confirmed and TBD decisions

Current UI prototype reference:

- `E:/my_vibecoding/private_assistant/background-base.html`

Prototype rule:

- `background-base.html` is a UI and interaction baseline reference.
- It is not the final frontend engineering architecture.
- Production implementation may adjust UI details to fit real data and workflow logic.

---

## 2. Product Goal

Build a personal knowledge internalization workspace that helps users complete:

1. Capture information
2. Understand and internalize information
3. Generate reusable notes
4. Build lightweight knowledge structure
5. Ask evidence-grounded questions from settled knowledge
6. Write valuable answers back into the knowledge base

V1 focuses on a full closed loop, not a general chatbot.

---

## 3. V1 Scope

### 3.1 Included

1. Web workspace
2. Inbox
3. Quick Capture
4. Record detail drawer
5. One-click internalization
6. Knowledge base graph view
7. AI Assistant
8. Source-backed answers
9. Writeback to notes
10. Basic reminders and weekly feedback UI
11. Async jobs and processing logs
12. Retry support for failed processing

### 3.2 Excluded

1. Mobile app
2. Desktop quick-capture window
3. Obsidian sync/export
4. Multi-user collaboration
5. Deep multi-layer graph system
6. General purpose chatbot capability
7. Browser extension

---

## 4. Users and Scenarios

Target user:

- Individual knowledge workers

Core scenarios:

1. Capture text, links, images, and documents quickly
2. Preserve personal understanding at capture time
3. Trigger one-click internalization
4. Reuse settled notes via AI Assistant
5. Navigate note relationships in the graph
6. Keep knowledge evolving through writeback

---

## 5. Page and Feature Definition

### 5.1 Inbox

Features:

1. Quick Capture input for text/document/image/link
2. Optional attachment upload
3. "My Understanding" input
4. Capture intent selection:
   - `Later` (`稍后看`)
   - `Favorite` (`收藏`, meaning "move to internalization queue")
5. Record list with filter/search
6. Record detail drawer
7. Actions by state:
   - Later: view original, move to pending internalization, one-click internalize, delete
   - Pending internalization: view original, one-click internalize, delete
   - Settled: view note details, ask about this note, locate in knowledge graph, delete

### 5.2 Knowledge Base

Features:

1. Global graph (star-map style)
2. Zoom and pan
3. Hover node highlights connected nodes
4. Click node opens detail and highlights current node
5. In detail, click related note jumps to that note and updates graph highlight

### 5.3 AI Assistant

Features:

1. User can ask questions anytime
2. Answers are grounded in settled knowledge only
3. Source references are shown with each grounded answer
4. Evidence-insufficient cases must explicitly return uncertainty

### 5.4 Reminders and Weekly Feedback

V1 includes baseline UI and workflow hooks for:

1. Daily reminders
2. Weekly feedback snapshots

Detailed reminder strategy can be iterated in later phases.

---

## 6. Capture and Parsing Rules

### 6.1 User Inputs at Capture Time

User provides:

1. Raw content: text / link / image / document
2. Optional attachments
3. Optional "My Understanding"
4. Capture intent: `Later` or `Favorite`

User does not provide title during initial capture.

### 6.2 Lightweight Parsing After Submission

Must complete:

1. Save raw input and files/links
2. Record capture time
3. Detect content type
4. Save source metadata
5. Save "My Understanding"
6. Set user-visible status

Best effort:

1. Extract/generate title
2. Generate preview summary
3. Auto-tag

Title/summary/tag generation can use:

1. Raw input content
2. Link-readable metadata/content snippets
3. File metadata/quickly extractable text
4. User "My Understanding"

If signals are insufficient for tags, show `-`.

No deep analysis at this stage:

1. No deep value extraction
2. No topic/subtopic structure decisions
3. No relation graph construction
4. No final note generation
5. No deep image/video/document semantics

### 6.3 Editable Fields After Capture

User can edit and save:

1. Title
2. Preview summary
3. Tags
4. My Understanding

After save:

1. The edited values overwrite previous values
2. The edited values become the latest canonical record
3. Display/filter/search/internalization all use the latest saved record
4. System does not auto re-run parsing after user save

---

## 7. Internalization Workflow

### 7.1 One-Click Internalization Mode

V1 uses direct internalization:

1. User clicks one-click internalize
2. No draft approval step is required
3. Agent generates and saves final note directly
4. Record moves to `Settled`

### 7.2 Agent Input

Internalization reads:

1. Raw captured content
2. Attachments
3. Link snapshots
4. User "My Understanding"
5. User-edited latest record fields
6. Existing settled knowledge context

### 7.3 Agent Output

Final note content:

1. Title
2. Core summary
3. Key insights
4. Reusable methods/conclusions
5. Applicable scenarios
6. Source basis

Structure outputs:

7. Related note suggestions
8. Topic/subtopic classification suggestions and structural updates

### 7.4 Post-Internalization Behavior

After completion:

1. User can edit note content
2. User cannot edit knowledge structure in V1
3. Agent maintains structure automatically

---

## 8. Knowledge Structure Rules

Structure is maintained by Agent in V1:

1. Topic/subtopic assignment
2. Related note linkage
3. Graph structure updates

User is not required to manage structure directly in V1.

TBD:

- Fallback strategy when structure confidence is low (see Decisions section).

---

## 9. View Original Rules

1. Text input: open modal with full text
2. Image: open image preview/file
3. Document: open doc preview/file
4. Link: open original URL

Link policy:

1. Save original URL
2. Save lightweight snapshot when possible
   - title
   - description
   - text snippets
   - source domain/platform
3. No full offline archive in V1

---

## 10. Deletion Rules

Deletion is hard delete with mandatory confirmation.

If a settled record is deleted:

1. Delete record
2. Delete corresponding note
3. Clean linked structures and derived entities:
   - note chunks
   - note relations
   - graph associations
   - source references linked to deleted note (by FK/cleanup policy)

Delete action is irreversible.

---

## 11. AI Assistant Rules

Answer scope:

1. Settled notes only (`notes`, `note_chunks`, knowledge relations, topic structure)
2. Do not answer from uninternalized records (`Later` / `Pending`)

Evidence behavior:

1. Show sources when evidence exists
2. Return explicit uncertainty when evidence is insufficient
3. Do not fabricate unsupported answers

---

## 12. Data Model (V1)

Core entities:

1. `records`
2. `attachments`
3. `internalization_jobs` (or generic `jobs`)
4. `notes`
5. `note_chunks`
6. `topics`
7. `subtopics` (or topic hierarchy field)
8. `note_relations`
9. `conversations`
10. `messages`
11. `answer_sources`
12. `processing_logs`
13. `reminder_snapshots` / `weekly_feedback_snapshots` (shape can evolve)

Implementation note:

- Final schema names may be adjusted, but behavior and ownership must stay aligned with this document.

---

## 13. User-Visible Status and Internal State

### 13.1 User-Visible Status

1. `Later` (`稍后看`)
2. `Pending Internalization` (`待内化`)
3. `Settled` (`已沉淀`)

Status mapping:

1. Capture with `Later` -> record enters `Later`
2. Capture with `Favorite` -> record enters `Pending Internalization`

### 13.2 Internal Processing States

Suggested internal states:

1. Parse pending/running/succeeded/failed
2. Internalization pending/running/succeeded/failed
3. Indexing pending/running/succeeded/failed

### 13.3 Job States

1. `pending`
2. `running`
3. `succeeded`
4. `failed`
5. `retrying`
6. `cancelled`

---

## 14. Technical Architecture

Confirmed stack:

1. Frontend: Next.js + TypeScript
2. Backend: FastAPI
3. Data/Auth/File: Supabase Auth + Postgres + Storage
4. Retrieval index: pgvector
5. Async execution: Postgres jobs + worker
6. AI provider access: backend unified orchestration only

Architecture principles:

1. Keep frontend free from direct model calls
2. Centralize workflow orchestration in backend
3. Keep AI outputs traceable and observable
4. Preserve lightweight, evolvable infrastructure for V1

---

## 15. Development Phases

### Phase 0 - Baseline Setup

1. Create frontend/backend project skeleton
2. Configure Supabase and environment conventions
3. Define API contracts

### Phase 1 - Prototype Migration

1. Move static prototype into frontend project as reference
2. Implement page/component structure in Next.js
3. Preserve key UI behavior while modularizing code

### Phase 2 - Real Capture Pipeline

1. Implement records/attachments CRUD
2. Wire capture submission to real persistence
3. Add lightweight parsing flow and logs

### Phase 3 - Internalization Closed Loop

1. Implement one-click internalization job
2. Generate/save notes and note chunks
3. Mark record as settled

### Phase 4 - Knowledge Base Realization

1. Implement topic/subtopic and note relations
2. Bind graph view to real data
3. Support node navigation and relation highlighting

### Phase 5 - AI Assistant and Retrieval

1. Implement retrieval from settled knowledge only
2. Source-backed answers and uncertainty behavior
3. Writeback support to notes

### Phase 6 - Reminder and Quality Gates

1. Daily reminder and weekly feedback pipelines
2. Prompt/version/evaluation tracking
3. End-to-end stability checks

---

## 16. Acceptance Criteria

Product acceptance:

1. User can capture, internalize, locate in graph, and ask from settled note
2. Main closed loop works end-to-end without manual data fixing

Data acceptance:

1. Record lifecycle and note lifecycle are consistent
2. Hard delete cleanup is complete and deterministic

AI acceptance:

1. Answers are source-backed when evidence exists
2. Answers are uncertain when evidence is insufficient

Observability acceptance:

1. Job status and failure reasons are traceable
2. Processing logs are queryable for diagnosis

---

## 17. Confirmed Decisions

### Decision-001: HTML Prototype Positioning

Confirmed:

- `background-base.html` is UI and interaction reference.
- It is not final frontend architecture.
- Production implementation may adjust UI according to real logic.

### Decision-002: V1 Stack

Confirmed:

1. Next.js + TypeScript
2. FastAPI
3. Supabase Auth + Postgres + Storage
4. pgvector
5. Postgres jobs + worker
6. Backend-only model orchestration

### Decision-003: Meaning of "Favorite"

Confirmed:

- "Favorite" means high-value item to be internalized.
- It maps to `Pending Internalization`, not settled.

### Decision-004: Post-Capture Parsing Scope

Confirmed:

1. Lightweight parsing only
2. Deep understanding deferred to one-click internalization
3. Title/summary/tag can use "My Understanding"
4. Tag displays `-` when signals are insufficient

### Decision-005: Post-Capture Editable Fields

Confirmed:

1. Title, summary, tags, and My Understanding are editable
2. User save overwrites previous values and becomes latest canonical record

### Decision-006: Auto Reparse After User Save

Confirmed:

- No automatic reparse after user manual save

### Decision-007: Internalization Output Shape

Confirmed:

1. Final note contains six core content fields
2. Structure suggestions include relations and topic/subtopic placement

### Decision-008: One-Click Internalization and Structure Ownership

Confirmed:

1. No user draft approval step before settlement
2. User can edit note content after settlement
3. User cannot edit structure in V1
4. Structure is maintained by Agent

### Decision-009: AI Assistant Scope

Confirmed:

- AI answers only from settled knowledge, not from uninternalized records

### Decision-010: Original Content and Snapshot Policy

Confirmed:

- Save lightweight link snapshots, no full offline webpage archive in V1

### Decision-011: Graph Implementation Strategy

Confirmed:

1. Lock product behavior first
2. Select graph library later from mature options
3. No custom low-level graph engine in V1

### Decision-012: Deleting Settled Content

Confirmed:

- Deleting a settled record also deletes its corresponding settled note and linked derivatives

### Decision-013: Deletion Mode

Confirmed:

1. Hard delete only
2. Mandatory second confirmation
3. Irreversible operation

### Decision-014: Source and Uncertainty Rules

Confirmed:

1. Source display required when evidence exists
2. Explicit uncertainty required when evidence is insufficient

---

## 18. TBD Decisions

### Decision-TBD-001: Structure Fallback Strategy

Status:

- TBD

Question:

- When Agent confidence is low for topic/subtopic placement or relation linkage, what fallback path should be used?

Candidate options:

1. Place into a dedicated "To Organize" topic
2. Create new topic/subtopic automatically
3. Attach to nearest existing topic/subtopic
4. Mark low confidence while still settling

Resolution timing:

- To be finalized before StructureAgent production hardening.

---

## 19. Change Governance

For any future changes:

1. Update this document first
2. Confirm change impact
3. Then update implementation

If a new requirement conflicts with this document, discuss and resolve in this document before coding.
