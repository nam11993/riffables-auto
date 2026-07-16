# Requirements Status

Created: 2026-07-09
Last updated: 2026-07-16

## Current State

The master requirement catalog for the full project is:

```text
qa-ai-workflow/requirements/riffables-master.requirements.yaml
```

The QA-readable review file is:

```text
qa-ai-workflow/requirements/riffables-master.review.md
```

These files are the main input for:

```text
qa-ai-workflow/test-plans/riffables-master.test-plan.md
qa-ai-workflow/test-cases/riffables-master.test-cases.md
qa-ai-workflow/traceability/riffables-master.traceability-matrix.md
```

The current draft test plan is:

```text
qa-ai-workflow/test-plans/riffables-master.test-plan.md
```

The current draft test case file is:

```text
qa-ai-workflow/test-cases/riffables-master.test-cases.md
```

Current coverage status:

- 74/74 included requirement IDs have test case mapping.
- 276 draft test cases.
- Foundation smoke cases now explicitly cover authentication, protected routes, workspace context, password visibility, Google OAuth start/error states, and YouTube source connection.
- All 276 cases now use the same execution-level schema with `Workflow`, `Test Data`, `Automation Candidate`, and `Status`.
- Acceptance-criteria execution cases cover areas that were thin in the first draft.
- The 2026-07-16 PRD update added coverage for site-editor Assistant diffs, onboarding consent, console backend API wiring, public labels, and audience chat.

Module requirement files remain the detailed source for `acceptance_criteria`, `assumptions`, `open_questions`, and `related_requirements`.

`REQ-GLOBAL-*` is kept as governance/quality gate coverage, but it is not used directly to generate detailed product test cases.

## Completed So Far

Created a full-project requirement draft from the read `speedrun-labs/riffables-prd` GitHub issues.

## Module Files

| Order | Module | File | Requirement IDs |
| ---: | --- | --- | --- |
| 1 | Global context / QA baseline | `global-context.requirements.yaml` | `REQ-GLOBAL-*` |
| 2 | Ingestion Pipeline V1 | `ingestion-pipeline.requirements.yaml` | `REQ-INGEST-*` |
| 3 | Controlled Ingestion | `controlled-ingestion.requirements.yaml` | `REQ-INGEST-MODE-*`, `REQ-CATALOG-*`, `REQ-CRAWL-*` |
| 4 | AI extraction / citation / re-extraction | `ai-extraction-citation.requirements.yaml` | `REQ-AI-*` |
| 5 | Search / Public audience site | `search-public-site.requirements.yaml` | `REQ-SEARCH-*`, `REQ-PUBLIC-*` |
| 6 | Creator console / curation UI | `creator-console.requirements.yaml` | `REQ-CONSOLE-*` |
| 7 | Site builder / onboarding | `site-builder-onboarding.requirements.yaml` | `REQ-BUILDER-*`, `REQ-ONBOARD-*` |
| 8 | Accessibility / UX hardening | `accessibility-ux.requirements.yaml` | `REQ-A11Y-*` |
| 9 | Theme customization | `theme-customization.requirements.yaml` | `REQ-THEME-*` |
| 10 | Tenant security | `tenant-security.requirements.yaml` | `REQ-TENANT-*` |

## Status

All artifacts are still in:

```text
draft
```

They should not be marked `reviewed` or `approved` until QA/Product/Engineering review is complete.

## Recommended Next Step

Create the traceability/execution matrix:

```text
qa-ai-workflow/traceability/riffables-master.traceability-matrix.md
```

The matrix should map:

```text
Test Plan Area -> Requirement ID -> Test Case ID -> Priority -> Type -> Test Data -> Automation Candidate -> Review Status
```
