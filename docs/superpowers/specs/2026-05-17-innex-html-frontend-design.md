# INNEX HTML Frontend Design Adoption

Date: 2026-05-17
Status: Approved for replacement

## Decision

Use the provided `innex (1).html` file from the local Downloads folder as the sole V1 frontend design baseline.

The previous static HTML prototypes in this repository are no longer design sources of truth:

- `ui-replica/index.html`
- `background-base.html`

They may remain in git history or be overwritten, but future frontend work should follow the INNEX HTML design instead of merging it with earlier mockups.

## Product Fit

This decision is consistent with the primary execution plan:

- Phase 1 requires a high-fidelity UI skeleton before real data integration.
- The INNEX HTML already covers the V1 core surfaces: inbox, knowledge base, AI assistant, detail drawers, reminders, daily information card, and weekly feedback.
- The design supports a mock-first workflow, then progressive replacement with real data and real agent capabilities.

## Adoption Scope

The INNEX HTML replaces the prior frontend design completely:

- Visual language: dark left navigation, warm light workspace, orange accent, compact operational interface.
- Information architecture: three primary work areas: Inbox, Knowledge Base, and AI Assistant.
- Interaction patterns: quick capture, record filtering, detail drawers, internalization entry points, graph exploration, source-backed AI answers, reminders, and feedback overlays.
- Mock data behavior: retained for Phase 1 demo continuity until real data is connected.

## Implementation Direction

Adoption should happen in two steps:

1. Static replacement: copy the INNEX HTML into the repository as the active static prototype, replacing the old prototype entry point.
2. Component migration: later split the confirmed design into Next.js + TypeScript components when the frontend application scaffold is introduced.

## Non-Goals

- Do not preserve visual elements from the previous prototypes unless they are already present in the INNEX HTML.
- Do not redesign the INNEX layout during replacement.
- Do not connect real backend data during this replacement step.
- Do not treat the old static HTML files as competing references.

## Acceptance Criteria

- The repository has one active static frontend prototype based on `innex (1).html`.
- Opening the active prototype shows the INNEX design, not the older UI replica.
- Existing old prototype files are either replaced or explicitly no longer used.
- The change remains aligned with Phase 1 of the execution plan.
