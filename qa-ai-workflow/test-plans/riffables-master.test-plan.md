# Test Plan: Riffables Master

## Metadata

| Field | Value |
| --- | --- |
| Feature | `riffables-master` |
| PRD | `https://github.com/speedrun-labs/riffables-prd/issues` |
| Requirement source | `qa-ai-workflow/requirements/riffables-master.requirements.yaml` |
| Version/Commit | `github-issues-read-2026-07-16` |
| Owner | `QA` |
| Status | `Draft` |
| Last updated | `2026-07-16` |

## Objective

Validate the Riffables product behavior described by the curated master requirements before release. This plan covers tenant isolation, ingestion, controlled ingestion, AI extraction and citation verification, public search/site behavior, creator console flows, password and Google OAuth authentication, console backend API wiring, site-editor Assistant diffs, theme customization, accessibility hardening, and regression coverage for closed site builder/onboarding issues.

This test plan is the bridge between:

```text
PRD issues -> master requirements -> test plan -> test cases -> execution/report
```

## Source Artifacts

| Artifact | Path |
| --- | --- |
| Master requirements | `qa-ai-workflow/requirements/riffables-master.requirements.yaml` |
| Requirement review | `qa-ai-workflow/requirements/riffables-master.review.md` |
| PRD issue inventory | `qa-ai-workflow/prd-sources/riffables-issues-inventory.md` |
| PRD sync process | `qa-ai-workflow/docs/prd-sync-command.md` |

Detailed acceptance criteria remain in the module requirement files under `qa-ai-workflow/requirements/`.

## Scope

### In Scope

- 33 release-scope requirements from the master catalog.
- 41 regression-baseline requirements from closed PRD issues and delivered behavior that must remain protected.
- P0 validation for tenant security, ingestion pipeline, controlled ingestion, AI citation, and public search/site.
- P0 validation for password visibility, Google OAuth start/provider/callback readiness, and auth security boundaries.
- P1 validation for creator console, console backend API wiring, site-editor Assistant diffs, theme customization, and accessibility/UX hardening.
- P2 regression validation for site builder live catalog binding and guided onboarding where behavior is lower-risk.
- Manual, API, UI, integration, negative, data integrity, accessibility, and regression testing.
- Test data and golden dataset planning for AI citation, search relevance, speaker separation, and tenant isolation.
- PRD change impact handling before final QA approval.

### Out of Scope

- Full penetration testing beyond tenant isolation and obvious authorization checks.
- Large-scale production load testing beyond the bounded-batch and fairness scenarios in requirements.
- Final AI quality evaluation without an approved golden transcript/search dataset.
- Custom domain behavior unless Product confirms it is in the release.
- Paid member tier behavior unless audience member gating is confirmed in scope.
- Exact implementation validation for unresolved open questions until Product/Engineering confirms expected behavior.

## Requirement Coverage Summary

| Priority | Module | Scope | Requirement IDs | Planned Test Group |
| --- | --- | --- | --- | --- |
| P0 | Foundation smoke | Mixed | `REQ-CONSOLE-001`, `REQ-CONSOLE-008` to `REQ-CONSOLE-011`, `REQ-TENANT-*`, `REQ-INGEST-001`, `REQ-INGEST-MODE-*`, `REQ-CATALOG-001` | `TC-AUTH-*`, `TC-SOURCE-*` |
| P0 | Tenant security | Release | `REQ-TENANT-001` to `REQ-TENANT-004` | `TC-TENANT-*` |
| P0 | Ingestion pipeline | Release | `REQ-INGEST-001` to `REQ-INGEST-006` | `TC-INGEST-*` |
| P0 | Controlled ingestion | Regression | `REQ-INGEST-MODE-*`, `REQ-CATALOG-*`, `REQ-CRAWL-*` | `TC-INGEST-MODE-*`, `TC-CATALOG-*`, `TC-CRAWL-*` |
| P0 | AI extraction/citation | Release | `REQ-AI-001` to `REQ-AI-006` | `TC-AI-*` |
| P0 | Search/public site | Mixed | `REQ-SEARCH-*`, `REQ-PUBLIC-*` | `TC-SEARCH-*`, `TC-PUBLIC-*` |
| P1 | Creator console | Mixed | `REQ-CONSOLE-001` to `REQ-CONSOLE-012` | `TC-CONSOLE-*`, `TC-AUTH-*` |
| P1 | Theme customization | Release | `REQ-THEME-001` to `REQ-THEME-005` | `TC-THEME-*` |
| P1 | Accessibility/UX | Regression | `REQ-A11Y-001` to `REQ-A11Y-005` | `TC-A11Y-*` |
| P1/P2 | Site builder/onboarding | Mixed | `REQ-BUILDER-001` to `REQ-BUILDER-006`, `REQ-ONBOARD-001` to `REQ-ONBOARD-003` | `TC-BUILDER-*`, `TC-ONBOARD-*` |

`REQ-GLOBAL-*` is not used as a direct test case source. It is used for coverage governance and exit criteria.

## Test Strategy

| Test Type | Approach |
| --- | --- |
| Functional | Validate each user-facing workflow from the creator and audience perspective using the requirement acceptance criteria. |
| API | Validate tenant isolation, ingest gating, catalog selection, re-extraction, and search behavior at API level where available. |
| Integration | Validate end-to-end flow across ingestion, transcription/extraction, curation, publish, public search, and citation playback. |
| Negative | Attempt invalid source URLs, cross-tenant access, manual-mode automatic ingest, unsupported theme variables, malicious theme prompts, stale IDs, and unauthorized role actions. |
| Boundary | Validate max import duration strategy, batch size, catalog ceiling, max search results, batch extraction limit, and retry boundaries once constants are confirmed. |
| Data Integrity | Check that catalog metadata does not create Riffs, selected video ingestion only queues selected IDs, re-extraction avoids duplicates, and tenant-scoped data never leaks. |
| AI Validation | Use golden transcript and negative AI output datasets to verify quote grounding, hallucination rejection, and citation timestamp behavior. |
| AI-Assisted Editing | Validate site-editor Assistant prompt handling, previewable diff generation, accept/reject behavior, unsupported requests, and unsafe prompt refusal. |
| Search Relevance | Use a golden search dataset to validate keyword, exact quoted, semantic, and fused result ranking behavior. |
| Accessibility | Validate tap target size, heading structure, accessible names, landmarks, contrast baseline, alt text, and alert semantics on scoped screens. |
| Regression | Re-run controlled ingestion, site builder binding, publish subdomain, guided tours, auth password controls, Google OAuth start/error states, pipeline card layout, public labels, console navigation, public site load, and known passing accessibility baseline. |
| Automation | Prioritize stable P0/P1 smoke and regression paths for automation after manual expectations are reviewed. |

## Test Levels

| Level | Purpose | Candidate Areas |
| --- | --- | --- |
| Smoke | Confirm the app is testable before deeper execution. | Login, tenant workspace, password control, Google sign-in start/error state, console navigation, source registration, public site load. |
| Feature | Validate acceptance criteria for each requirement. | Ingestion, catalog, AI citation, search, curation, theme customization. |
| Integration | Validate cross-module workflows. | Source -> ingest -> extract -> curate -> publish -> public search -> citation playback. |
| Security | Validate isolation and authorization. | Tenant scoping, direct ID tampering, role actions, unsafe theme prompt rejection. |
| Regression | Protect previously closed PRD behaviors. | Site builder, guided tours, publish subdomain, public site baseline. |

## Execution Order

1. Foundation smoke for login, auth, workspace access, password visibility, Google sign-in start/error state, and source connection.
2. Tenant security P0 checks.
3. Smoke checks for creator console and public site.
4. Ingestion pipeline P0 checks.
5. Controlled ingestion P0 regression checks.
6. AI extraction and citation P0 checks.
7. Search and public site P0 checks, including real public labels.
8. Creator console P1 checks, including pipeline visibility and backend API wiring.
9. Site-editor Assistant P1 checks for previewable diffs.
10. Theme customization P1 checks.
11. Accessibility and UX P1 regression checks.
12. Site builder and onboarding P2 regression checks, including onboarding consent.

This order intentionally tests tenant/security foundations first because failures there can invalidate results from other modules.

## Module Test Plan

### P0: Tenant Security

Validate that all tenant data access is scoped correctly and that users cannot bypass isolation through UI, direct URL, API parameter, token, or role manipulation.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-TENANT-001` | Positive tenant-scoped access for console, API, search, and admin/support-like views if available. |
| `REQ-TENANT-002` | Negative tests for direct resource ID tampering, tenant parameter changes, and token/resource mismatch. |
| `REQ-TENANT-003` | Role matrix tests for Viewer, Editor, Admin, including API-level enforcement. |
| `REQ-TENANT-004` | Review logs/support visibility for tenant data exposure where QA has access. |

Test data needs:

- At least two tenants with distinct sources, content, users, and public sites.
- Users mapped to Viewer, Editor, and Admin roles.
- Known resource IDs from both tenants for negative checks.

### P0: Ingestion Pipeline

Validate source registration, automatic import, processing state visibility, long media handling, speaker-separated transcripts, retry behavior, and actionable failures.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-INGEST-001` | Add supported YouTube, Spotify podcast, and Blog RSS sources; reject unsupported or invalid URLs. |
| `REQ-INGEST-002` | Confirm new source content is detected and enqueued by background sync within configured limits. |
| `REQ-INGEST-003` | Verify Queued, Processing, Ready, and Failed states in the console. |
| `REQ-INGEST-004` | Validate long media processing using real, synthetic, or mocked long-duration media. |
| `REQ-INGEST-005` | Validate speaker separation with a golden multi-speaker media sample. |
| `REQ-INGEST-006` | Trigger transient and permanent import failures to verify retry and error display behavior. |

Open dependencies:

- Exact valid URL formats per source type.
- Retry count/backoff.
- Strategy for long media and speaker-separation golden dataset.

### P0: Controlled Ingestion Regression

Validate Auto/Manual mode selection, manual-mode ingest blocking, catalog creation, selected video ingestion, crawl progress, cancellation, bounded batches, fairness, and restart recovery as a P0 regression baseline. Issues #18-#32 are closed in the 2026-07-16 PRD intake, so the expected behavior stays testable even though it is no longer tracked as open implementation work.

| Area | Requirements | Planned Coverage |
| --- | --- | --- |
| Ingest mode | `REQ-INGEST-MODE-001` to `REQ-INGEST-MODE-006` | Connect channel in Auto and Manual mode, switch modes, verify side-effect-free switching, and verify automatic ingest is refused for Manual channels. |
| Catalog | `REQ-CATALOG-001` to `REQ-CATALOG-006` | Build metadata-only catalog, browse/search, show ingest states, restrict selection, ingest only selected videos, refresh new uploads without re-ingest. |
| Crawl processing | `REQ-CRAWL-001` to `REQ-CRAWL-006` | Validate bounded batches, live progress, cancellation, per-source locks, priority/fairness, and restart recovery. |

High-risk checks:

- Manual mode must not spend transcription/extraction budget on connect.
- Manual mode must block Run, Backfill, scheduled ingest, and direct API automatic ingest.
- Catalog selection must not include videos outside the selected channel.
- Large backfill must not block fresh or interactive work.
- Restart recovery must not duplicate already processed videos.

Open dependencies:

- API error code/message for refused Manual-mode automatic ingest.
- Batch size constant.
- Test hook or observable signal for queue fairness and service restart recovery.

### P0: AI Extraction And Citation

Validate that AI-generated quotes and insights are grounded in source transcripts, unsupported statements are rejected, citations deep-link to the exact timestamp, and re-extraction behavior is safe.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-AI-001` | Compare generated quote text against source transcript using golden transcript examples. |
| `REQ-AI-002` | Feed unsupported/hallucinated outputs and verify rejection or mismatch warnings. |
| `REQ-AI-003` | Verify citation badge metadata and timestamp deep-link behavior. |
| `REQ-AI-004` | Trigger single-item re-extraction from authorized and unauthorized users. |
| `REQ-AI-005` | Repeat re-extraction and verify no duplicate quote cards or stale public insights. |
| `REQ-AI-006` | Validate bulk pending re-extraction limit and authorization. |

Test data needs:

- Golden transcripts with known exact quotes and timestamps.
- Negative AI output samples that are not present in transcripts.
- Content items with previous insights to validate replacement/duplicate behavior.

### P0: Search And Public Site

Validate keyword search, semantic search, exact quoted search, fused ranking, result limits, public site load, tenant-scoped public library, audience gating when in scope, and citation playback.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-SEARCH-001` | Keyword and semantic concept search over tenant library. |
| `REQ-SEARCH-002` | Exact quoted search prioritizes exact wording. |
| `REQ-SEARCH-003` | Keyword and semantic results are fused, ranked, limited, and responsive. |
| `REQ-PUBLIC-001` | Published public site URL loads with correct tenant context. |
| `REQ-PUBLIC-002` | Public site displays searchable insight library and filters. |
| `REQ-PUBLIC-003` | Validate audience login/member gating only if confirmed in release scope. |
| `REQ-PUBLIC-004` | Citation action opens source media at cited timestamp. |
| `REQ-PUBLIC-005` | Verify public guest/show/bio labels come from real creator or tenant data, or are omitted when unavailable, with no synthetic placeholders. |
| `REQ-PUBLIC-006` | Verify audience chat uses the real agent/content path instead of canned Echo-style stub responses. |

Open dependencies:

- Golden search dataset and expected result ranking.
- QA domain pattern for published tenant sites.
- Timestamp tolerance for citation playback.
- Audience member gating scope.
- Public label source fields and audience chat real-agent QA oracle.

### P1: Creator Console

Validate creator authentication, workspace access, navigation, curation, crawl feedback UI, Last run/Last error data, content filter visual hierarchy, Sources page pipeline visibility, password field affordances, Google OAuth readiness, and console backend API wiring.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-CONSOLE-001` | Login, workspace access, tenant scoping, sign out. |
| `REQ-CONSOLE-002` | Navigate core console routes and preserve active tenant context. |
| `REQ-CONSOLE-003` | Review, edit, approve, and reject extracted insights. |
| `REQ-CONSOLE-004` | Show crawl running, success, and failure feedback. |
| `REQ-CONSOLE-005` | Populate Last run and Last error from backend crawl data. |
| `REQ-CONSOLE-006` | Verify filter UI is visually distinct from content cards. |
| `REQ-CONSOLE-007` | Verify the Pipeline status card is above the fold in the right column on standard desktop without changing its data. |
| `REQ-CONSOLE-008` | Verify password show/hide toggle behavior, reset-to-masked behavior, keyboard operation, accessible label, aria-pressed, and 24px target size. |
| `REQ-CONSOLE-009` | Verify Continue with Google calls social sign-in, follows consent URL when available, and shows pending/error states safely. |
| `REQ-CONSOLE-010` | Verify BetterAuth Google provider is enabled only when configured and disabled safely when credentials are absent. |
| `REQ-CONSOLE-011` | Verify OAuth callback URI, auth host/origins, session cookie behavior, new-account setup route, and existing-email account linking when environment is ready. |
| `REQ-CONSOLE-012` | Verify backend-backed content search, schedules CRUD, site lifecycle actions, article editing, job/queue status, and removal of fake hardcoded site routes. |

Open dependencies:

- Final top-level route list.
- Editable fields in curation UI.
- Crawl feedback data contract.
- Standard desktop viewport for pipeline visibility.
- Google OAuth environment readiness because #70 is closed while #71 remains open in the latest intake.
- Exact UI ownership of job/queue status and schedule editing for #51.

### P1: Theme Customization

Validate conversational theme requests, widget preview updates, save behavior, allowlisted style variables, and malicious script refusal.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-THEME-001` | Submit supported and unsupported natural language style requests. |
| `REQ-THEME-002` | Verify preview updates after supported theme changes. |
| `REQ-THEME-003` | Save theme changes and verify persistence after refresh/revisit. |
| `REQ-THEME-004` | Attempt unsupported style variables and verify they are rejected or ignored. |
| `REQ-THEME-005` | Attempt script/JavaScript injection prompts and verify refusal plus no saved unsafe config. |

Test data needs:

- Positive style prompts.
- Unsupported variable prompts.
- Malicious script/JavaScript prompts.
- Expected allowed style variable list.

### P1: Accessibility And UX

Validate scoped WCAG-related hardening and known passing baseline.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-A11Y-001` | Measure interactive target size or actual hit area on scoped controls. |
| `REQ-A11Y-002` | Verify View live site appears only after successful publish. |
| `REQ-A11Y-003` | Validate dashboard heading structure. |
| `REQ-A11Y-004` | Validate editor headings for layers, canvas, inspector, and major regions. |
| `REQ-A11Y-005` | Regression for contrast, accessible names, alt text, landmarks, and alert semantics. |

Open dependencies:

- Whether QA measures rendered visual size or actual hit area.
- Exact dashboard/editor screen list for accessibility scope.
- Whether automated accessibility tooling is part of release regression.

### P1/P2: Site Builder, Assistant, And Onboarding Regression

Validate closed site builder and onboarding issues as regression baseline, and validate the new site-editor Assistant as release-scope AI-assisted editing behavior.

| Requirement | Planned Coverage |
| --- | --- |
| `REQ-BUILDER-001` | Collection/repeated section renders live catalog items in editor preview and published site. |
| `REQ-BUILDER-002` | Bound fields resolve current item values instead of static values. |
| `REQ-BUILDER-003` | Inspector Data tab guides binding and lists only real bindable sources. |
| `REQ-BUILDER-004` | Selecting a section in layers scrolls the editor canvas to it. |
| `REQ-BUILDER-005` | Publish host uses fixed platform suffix and tenant subdomain format. |
| `REQ-BUILDER-006` | Site-editor Assistant accepts supported natural-language edit requests, proposes previewable diffs, supports accept/reject, and refuses unsafe or unsupported edits. |
| `REQ-ONBOARD-001` | Main console screen tours start once, can be closed, and can be replayed. |
| `REQ-ONBOARD-002` | Site editor tour introduces editor regions and can be replayed. |
| `REQ-ONBOARD-003` | First authenticated visit asks whether the user is new before auto-running tours; no/dismiss/grandfathered flows are explicit. |

Regression note:

Builder/onboarding regression cases should run after P0/P1 release checks unless a release specifically touches site builder, publishing, or onboarding. `REQ-BUILDER-006` should run earlier with P1 AI-assisted editing because it is a new open PRD item and needs Product/Engineering clarification on supported edit operations.

## Environment

| Area | Requirement |
| --- | --- |
| App build | QA/staging build identified before execution. |
| Browser | Latest stable Chrome for primary execution; add Firefox/Safari only if release scope requires. |
| Devices | Desktop web primary; mobile/tablet only for scoped responsive/accessibility checks. |
| Backend | QA/staging APIs, worker, queue, database, search/vector index, media/transcription/extraction services. |
| Auth | Test users for at least two tenants and Viewer/Editor/Admin roles. |
| Data | Test tenants, sources, videos, transcripts, insights, public sites, theme configs, and search dataset. |
| Observability | Access to logs/job status/API responses needed for ingestion, retry, queue, and AI validation. |

## Test Data Plan

| Data Set | Purpose |
| --- | --- |
| Two-tenant dataset | Tenant isolation, cross-tenant negative tests, public site scoping. |
| Role dataset | Viewer, Editor, Admin permission matrix. |
| Source URL dataset | Valid and invalid YouTube, Spotify, RSS sources. |
| Channel catalog dataset | Manual/Auto channel modes, catalog states, selected video ingestion. |
| Large channel/backfill dataset | Bounded batches, fairness, progress, cancellation, restart recovery. |
| Golden transcript dataset | Quote verification, hallucination rejection, citation timestamp validation. |
| Golden search dataset | Keyword, exact, semantic, and fused ranking validation. |
| Google OAuth environment dataset | Google test account, callback URI, configured and unconfigured provider states, and expected session/account-linking behavior. |
| Public label dataset | Tenants with real creator/show labels, tenants with missing label fields, and cross-tenant label controls. |
| Audience chat dataset | Golden audience prompts, expected non-Echo response shape, tenant-scoped creator content, and unsupported/rate-limited prompt examples. |
| Site-editor Assistant prompt dataset | Supported edit prompts, ambiguous prompts, unsupported edit prompts, malicious prompt-injection samples, and expected diff constraints. |
| Onboarding consent dataset | New user, returning user, dismissed consent, grandfathered completed-home-tour user, and cleared-browser-storage scenarios. |
| Theme prompt dataset | Supported style prompts, unsupported variable prompts, malicious script prompts. |
| Accessibility screen list | Tap targets, headings, landmarks, accessible names, contrast baseline. |

## Entry Criteria

- PRD issue inventory and master requirements are available.
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml` has been reviewed enough to start draft test design.
- Test environment URL and app build are known.
- Required test users, tenants, and role assignments are available.
- QA has access to necessary APIs, logs, or job state views for backend-heavy scenarios.
- Golden datasets are available or open dataset gaps are accepted as test risks.
- PRD sync has been run or intentionally skipped with the decision recorded.

## Exit Criteria

- All planned P0 test cases are executed or formally waived.
- All planned P1 test cases are executed or deferred with approval.
- No open Critical bugs.
- No open High bugs in tenant security, ingestion gating, AI citation correctness, public site load, or cross-tenant search.
- P0 citation and tenant isolation checks pass.
- Smoke checks pass on the selected QA/staging build.
- Regression baseline has no release-blocking failures.
- Test report is reviewed by QA and shared with Product/Engineering.
- Any AI-generated test cases, bug reports, and impact updates are reviewed by QA.

## Suspension And Resumption Criteria

Testing should pause if:

- Test environment is unavailable or unstable.
- Authentication or tenant setup blocks all major flows.
- Source ingestion worker, queue, search index, or extraction service is unavailable for P0 modules.
- PRD changes invalidate the current requirement/test scope.

Testing can resume when:

- Blocking environment issues are resolved.
- Updated build/version is deployed.
- PRD impact report is reviewed and affected requirement/test artifacts are updated.
- Required test data is restored or recreated.

## Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| PRD issues change during test design | Requirement/test mismatch | Run PRD sync before review and use impact-update workflow. |
| Golden AI/search datasets are missing | Cannot verify AI/search correctness objectively | Create small approved golden datasets before detailed test case execution. |
| Queue fairness is hard to observe | P0 non-functional behavior may be under-tested | Ask Engineering for logs, metrics, test hooks, or controlled queue setup. |
| Service restart recovery is hard to simulate | Restart requirement may remain unverified | Use staging maintenance window or worker-level controlled restart. |
| Tenant role matrix is not finalized | Authorization tests may be ambiguous | Confirm role matrix before marking tenant tests approved. |
| Long media tests are expensive or slow | Execution time increases | Use a mix of real media, synthetic media, and mocked worker duration. |
| Theme assistant behavior is model-dependent | Test results may be inconsistent | Use fixed prompt set and validate saved config, not only natural-language response. |
| Public site domain differs by environment | Published site tests may fail due config | Document QA domain pattern before execution. |
| Google OAuth infra and backend are not aligned | Full Google sign-in may be blocked even when the button works | Split tests into frontend start/error-state, backend provider, callback/env readiness, and full round-trip; mark round-trip blocked until #71/env is confirmed. |
| Site-editor Assistant has unclear supported edit scope | AI diff tests may have no stable oracle | Confirm supported edit operations and allowed diff fields before approving `REQ-BUILDER-006` cases. |
| Public label fields are not finalized | Label correctness tests may reject acceptable omitted labels | Confirm source fields and allowed omitted-label behavior before execution. |

## Defect Management

Defects should include:

- Bug ID using `BUG-<MODULE>-###`.
- Linked requirement ID.
- Linked test case ID once test cases exist.
- Source PRD issue when relevant.
- Environment/build.
- Steps to reproduce.
- Expected result.
- Actual result.
- Evidence such as screenshot, API response, logs, or job ID.
- Severity and priority.

Severity guidance:

| Severity | Examples |
| --- | --- |
| Critical | Cross-tenant data leak, manual mode spends budget automatically, public site cannot load, unsupported AI quote is published as verified. |
| High | Selected catalog ingestion includes wrong videos, citation timestamp is materially wrong, unauthorized user can re-extract, search leaks another tenant. |
| Medium | Crawl progress stale, Last error incorrect, theme preview does not update, accessibility heading issue on scoped screen. |
| Low | Copy, minor visual polish, non-blocking guided tour issue. |

## Automation Candidates

| Priority | Candidate |
| --- | --- |
| High | Login, protected route, sign out, and workspace auth smoke. |
| High | Tenant isolation API negative tests. |
| High | Login, tenant workspace, and console smoke. |
| High | YouTube source connection smoke for Auto and Manual mode. |
| High | Manual mode refuses automatic ingest API paths. |
| High | Catalog selected-video ingest validates exact selected IDs. |
| High | Public site loads and search is tenant-scoped. |
| High | Theme assistant rejects malicious script prompts by saved-config assertion. |
| Medium | Ingestion state transitions with mocked worker/job state. |
| Medium | Citation timestamp links using golden content. |
| Medium | Accessibility heading and accessible-name checks. |
| Medium | Site builder publish subdomain regression. |
| Low | Guided tour replay/seen-state behavior. |

Automation rule:

Automate stable P0/P1 checks first. Keep model-quality, semantic relevance, and fairness checks partly manual until datasets and observability are reliable.

## Test Case Generation Rules

The current QA-reviewable test case artifact is:

```text
qa-ai-workflow/test-cases/riffables-master.test-cases.md
```

For actual QA execution, use `qa-ai-workflow/test-cases/riffables-master.test-cases.md` as one unified suite. All test case tables use execution-level columns, including `Workflow`, `Test Data`, `Automation Candidate`, and `Status`.

If a machine-readable YAML version is needed later, use the same IDs and prefixes:

- `TC-AUTH-*` for login, session, protected route, workspace, and role-auth smoke tests.
- `TC-SOURCE-*` for source connection and YouTube connect smoke tests.
- `TC-TENANT-*` for tenant isolation and role tests.
- `TC-INGEST-*` for ingestion pipeline tests.
- `TC-INGEST-MODE-*` for Auto/Manual mode tests.
- `TC-CATALOG-*` for catalog and selected video ingest tests.
- `TC-CRAWL-*` for crawl progress, cancellation, batches, fairness, and restart tests.
- `TC-AI-*` for AI extraction, citation, and re-extraction tests.
- `TC-SEARCH-*` and `TC-PUBLIC-*` for search/public site tests.
- `TC-CONSOLE-*` for creator console tests.
- `TC-THEME-*` for theme customization tests.
- `TC-A11Y-*` for accessibility/UX tests.
- `TC-BUILDER-*` and `TC-ONBOARD-*` for regression baseline tests.

Each test case must include:

- `id`
- `title`
- `requirement_ids`
- `priority`
- `type`
- `preconditions`
- `steps`
- `expected_result`
- `test_data`
- `automation_candidate`
- `status`

## PRD Change Handling

Before finalizing this test plan or generating official test cases:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1
```

If changes are detected:

1. Review the generated impact report under `qa-ai-workflow/prd-sources/change-reports/`.
2. Use `qa-ai-workflow/prompts/08-impact-update-assistant.md` to analyze affected requirements/test plan/test cases.
3. Update only affected artifacts.
4. Create a QA review report under `qa-ai-workflow/reports/prd-change-reviews/`.
5. Reconfirm traceability before execution.

## Approval

| Role | Name | Status | Notes |
| --- | --- | --- | --- |
| QA | TBD | Draft | Review scope, priorities, and test data needs. |
| Product | TBD | Draft | Confirm open questions and release scope. |
| Engineering | TBD | Draft | Confirm test hooks, constants, API errors, and environment readiness. |
| Security | TBD | Draft | Review tenant isolation and unsafe theme prompt coverage. |
