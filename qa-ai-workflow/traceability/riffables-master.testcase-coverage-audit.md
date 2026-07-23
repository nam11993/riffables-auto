# Test Case Coverage Audit: Riffables Master

## Metadata

| Field | Value |
| --- | --- |
| Feature | `riffables-master` |
| Audit date | `2026-07-23` |
| Test plan | `qa-ai-workflow/test-plans/riffables-master.test-plan.md` |
| Test cases | `qa-ai-workflow/test-cases/riffables-master.test-cases.md` |
| Requirements | `qa-ai-workflow/requirements/riffables-master.requirements.yaml` |
| Status | `Draft coverage audit` |

## Executive Verdict

The current test case suite is functionally covered enough for QA review after the 2026-07-23 PRD intake/update for password reset, Google OAuth state changes, site-editor Assistant status, and operator image asset library scope.

It covers all included requirement IDs and all major functional modules listed in the master test plan. It should not be marked approved-complete yet because some test data, environment constants, automation decisions, and open Product/Engineering decisions are still unresolved.

| Checkpoint | Result | Notes |
| --- | --- | --- |
| Included requirement ID coverage | Pass | `78/78` included requirements are referenced by at least one test case. |
| Test plan module coverage | Pass | All P0/P1/P2 modules in the test plan have matching test case groups. |
| Scenario depth | Pass for draft review | Positive, negative, boundary, security, integration, AI validation, accessibility, and regression cases are present. |
| AI-heavy coverage | Strong draft coverage | AI quote grounding, hallucination, malformed output, speaker attribution, citation timestamp, re-extraction, and batch limit are covered. |
| Execution readiness | Pass for draft execution | All `418` test cases expose `Workflow`, `Test Data`, `Automation Candidate`, and per-case `Status`. |
| Approval readiness | Not complete | Golden datasets, constants, environment details, and several open policies still need confirmation. |

## Test Case Count By Group

| Test Case Group | Count | Test Plan Area |
| --- | ---: | --- |
| `TC-AUTH-*` | 60 | Foundation authentication, Google OAuth, password controls, and reset-link flows |
| `TC-SOURCE-*` | 50 | Foundation source connection |
| `TC-TENANT-*` | 16 | Tenant security |
| `TC-INGEST-*` | 20 | Ingestion pipeline |
| `TC-INGEST-MODE-*` | 17 | Controlled ingestion mode |
| `TC-CATALOG-*` | 20 | Controlled ingestion catalog |
| `TC-CRAWL-*` | 17 | Controlled crawl and processing |
| `TC-AI-*` | 36 | AI extraction and citation |
| `TC-SEARCH-*` | 16 | Search |
| `TC-PUBLIC-*` | 34 | Public site, Baohan public verification, real labels, audience chat, and operator image assets |
| `TC-CONSOLE-*` | 48 | Creator console, Home, Sites, lifecycle, and backend API wiring |
| `TC-THEME-*` | 14 | Theme customization |
| `TC-A11Y-*` | 12 | Accessibility and UX |
| `TC-BUILDER-*` | 46 | Site builder regression, Baohan editor/publish flow, editor controls, and Assistant diff coverage |
| `TC-ONBOARD-*` | 12 | Onboarding regression and consent flow |
| Total | 418 | Full suite draft |

## Module Coverage Matrix

| Test Plan Module | Requirement Scope | Test Case Coverage | Coverage Status |
| --- | --- | --- | --- |
| Foundation Authentication | `REQ-CONSOLE-001`, `REQ-CONSOLE-008` to `REQ-CONSOLE-013`, `REQ-TENANT-*` | `TC-AUTH-001` to `TC-AUTH-060` | Covered with execution-level flows, reset-link cases, and blocked markers for full Google OAuth/email-token round trips where environment is not confirmed |
| Foundation Source Connection | `REQ-INGEST-001`, `REQ-INGEST-MODE-*`, `REQ-CATALOG-001` | `TC-SOURCE-001` to `TC-SOURCE-012` | Covered with execution-level flows |
| Tenant Security | `REQ-TENANT-001` to `REQ-TENANT-004` | `TC-TENANT-001` to `TC-TENANT-016` | Covered with execution-level flows |
| Ingestion Pipeline | `REQ-INGEST-001` to `REQ-INGEST-006` | `TC-INGEST-001` to `TC-INGEST-020` | Covered with data dependencies |
| Controlled Ingestion Mode | `REQ-INGEST-MODE-001` to `REQ-INGEST-MODE-006` | `TC-INGEST-MODE-001` to `TC-INGEST-MODE-017` | Covered with execution-level flows |
| Catalog Selection | `REQ-CATALOG-001` to `REQ-CATALOG-006` | `TC-CATALOG-001` to `TC-CATALOG-020` | Covered with execution-level flows |
| Crawl And Processing | `REQ-CRAWL-001` to `REQ-CRAWL-006` | `TC-CRAWL-001` to `TC-CRAWL-017` | Covered with observability dependencies |
| AI Extraction And Citation | `REQ-AI-001` to `REQ-AI-006` | `TC-AI-001` to `TC-AI-036` | Strongly covered with golden dataset dependency |
| Search | `REQ-SEARCH-*` | `TC-SEARCH-001` to `TC-SEARCH-016` | Covered with ranking dataset dependency |
| Public Site | `REQ-PUBLIC-*` | `TC-PUBLIC-001` to `TC-PUBLIC-034` | Covered with Baohan publish verification, domain/gating/label/chat dependency, and image asset upload/library/soft-remove cases |
| Creator Console | `REQ-CONSOLE-001` to `REQ-CONSOLE-013` | `TC-CONSOLE-001` to `TC-CONSOLE-048`, `TC-AUTH-013` to `TC-AUTH-060` | Covered, including Sites empty state, lifecycle, Home site states, backend wiring, auth reset-link states, and Settings sign-in-method detection |
| Theme Customization | `REQ-THEME-001` to `REQ-THEME-005` | `TC-THEME-001` to `TC-THEME-014` | Covered |
| Accessibility And UX | `REQ-A11Y-001` to `REQ-A11Y-005` | `TC-A11Y-001` to `TC-A11Y-012` | Covered with scope/tooling dependency |
| Site Builder Regression | `REQ-BUILDER-001` to `REQ-BUILDER-006` | `TC-BUILDER-001` to `TC-BUILDER-046` | Covered with Baohan editor/publish flow, editor controls, media panel baseline, and Assistant diff clarification dependency |
| Onboarding Regression | `REQ-ONBOARD-001` to `REQ-ONBOARD-003` | `TC-ONBOARD-001` to `TC-ONBOARD-012` | Covered |

## 2026-07-16 PRD Update Coverage

| Issue(s) | Requirement IDs | Test Case Coverage | Notes |
| --- | --- | --- | --- |
| `#66` | `REQ-BUILDER-006` | `TC-BUILDER-012` to `TC-BUILDER-019`, `TC-BUILDER-030` | Covers supported edit diff, accept/reject, ambiguous/unsupported prompts, malicious prompts, tenant/field boundaries, large/conflicting prompts, and no-auto-publish behavior. |
| `#67` | `REQ-CONSOLE-007` | `TC-CONSOLE-015` to `TC-CONSOLE-016` | Covers above-fold Pipeline card visibility and metric integrity after relocation. |
| `#68` | `REQ-ONBOARD-003` | `TC-ONBOARD-007` to `TC-ONBOARD-012` | Covers first-visit consent, new-user, returning-user, dismiss, grandfathered user, and editor honoring the choice. |
| `#69` | `REQ-CONSOLE-008` | `TC-AUTH-013` to `TC-AUTH-015` | Covers show/hide behavior, privacy reset, keyboard, screen-reader, aria state, and target size. |
| `#70`, `#71`, `#72` | `REQ-CONSOLE-009` to `REQ-CONSOLE-011` | `TC-AUTH-016` to `TC-AUTH-022` | Splits frontend start/error state, backend provider config, callback/env readiness, full round-trip, cancel/deny, and tenant/role security. |
| `#18` to `#32` | `REQ-INGEST-MODE-*`, `REQ-CATALOG-*`, `REQ-CRAWL-*` | Existing controlled-ingestion groups | Scope updated to regression baseline; existing execution-level cases remain valid. |
| `#34`, `#45` | `REQ-CONSOLE-006`, `REQ-A11Y-*` | `TC-CONSOLE-008`, `TC-A11Y-*` | Scope updated to regression baseline. |
| `#51` | `REQ-CONSOLE-012` | `TC-CONSOLE-017` to `TC-CONSOLE-022` | Covers backend hybrid search, schedules, site lifecycle, article editing, job status, and fake-route removal. |
| `#59` | `REQ-PUBLIC-005`, `REQ-PUBLIC-006` | `TC-PUBLIC-014` to `TC-PUBLIC-021` | Covers real labels, missing-label handling, tenant label isolation, label interaction regression, and audience chat real-agent path. |
| Baohan site workflow | `REQ-CONSOLE-002`, `REQ-CONSOLE-012`, `REQ-BUILDER-*`, `REQ-PUBLIC-*` | `TC-CONSOLE-041` to `TC-CONSOLE-048`, `TC-BUILDER-020` to `TC-BUILDER-030`, `TC-PUBLIC-022` to `TC-PUBLIC-024` | Covers create draft, site list/status, editor context, manual edits, save/preview/publish, lifecycle actions, role restriction, and Baohan public-site isolation. |

## 2026-07-23 PRD Update Coverage

| Issue(s) | Requirement IDs | Test Case Coverage | Notes |
| --- | --- | --- | --- |
| `#66` | `REQ-BUILDER-006` | Existing `TC-BUILDER-012` to `TC-BUILDER-019`, `TC-BUILDER-030`, `TC-BUILDER-041` | Issue is now closed and tracked as regression baseline. No new behavior was added; the existing Assistant diff/security cases remain the coverage set. |
| `#70` | `REQ-CONSOLE-011` | Existing `TC-AUTH-016` to `TC-AUTH-022`, plus `TC-AUTH-059` for trusted-origin reset behavior | Issue is open again, so full Google OAuth round-trip remains environment-gated until callback/origin readiness is confirmed. |
| `#71` | `REQ-CONSOLE-010` | Existing `TC-AUTH-016` to `TC-AUTH-022` | Backend Google provider issue is now closed and should be protected as regression baseline, while full E2E still depends on #70. |
| `#73` | `REQ-CONSOLE-013` | `TC-AUTH-053` to `TC-AUTH-060` | Covers Google-only Add password, existing-password Change password, reset token completion, invalid token, sign-in-only Forgot password, trusted origins, and no forced Google password. |
| `#74` | `REQ-PUBLIC-007` to `REQ-PUBLIC-009` | `TC-PUBLIC-025` to `TC-PUBLIC-034` | Covers supported uploads, public URLs, embed use, oversize/type rejection, duplicate upload, library listing, labels/alt text, pagination, soft remove, and cross-operator isolation. |

## Test Strategy Coverage Matrix

| Test Strategy From Plan | Coverage In Current Test Cases | Status |
| --- | --- | --- |
| Functional | Present across all modules | Covered |
| API | Present for tenant, manual ingest blocking, catalog tampering, theme persistence, and public search/widget checks | Covered; each case has automation candidate tagging |
| Integration | Present across ingestion, catalog, crawl, AI, search, public site, and builder flows | Covered |
| Negative | Present across invalid URLs, cross-tenant access, unauthorized roles, manual-mode bypass, malformed AI output, malicious theme prompts, invalid publish hosts | Covered |
| Boundary | Present for sync limits, media duration, catalog ceiling, batch size, cancellation, search input, citation tolerance, publish subdomain | Covered |
| Data Integrity | Present for catalog metadata-only behavior, selected-video ingest, duplicate prevention, theme persistence, builder binding | Covered |
| AI Validation | Present with detailed AI quote/citation/hallucination/speaker/malformed output cases | Strongly covered |
| Search Relevance | Present for keyword, semantic, exact quoted, fused, de-duplication, and boundaries | Covered, pending golden search dataset |
| Accessibility | Present for target size, headings, live-site button, keyboard, accessible names, alerts, landmarks, contrast baseline | Covered |
| Regression | Present for builder, onboarding, console, public site, accessibility, and backward-compatible ingest mode | Covered |
| Automation | Candidate areas exist in the test plan and every case includes `Automation Candidate` | Covered for planning; QA still needs to approve which candidates move to automation |

## Remaining Gaps Before Approval

These are not missing product functions. They are approval/execution gaps that need to be closed before the suite becomes official.

| Gap | Why It Matters | Recommended Action |
| --- | --- | --- |
| Full execution matrix is not created yet | QA still needs one place to filter by test data, automation candidate, status, and reviewer decision | Create `riffables-master.traceability-matrix.md` from the unified execution suite |
| Golden AI/search datasets are not approved | AI and search correctness cannot be objectively judged | Create small approved datasets before final execution |
| Environment constants are unresolved | Boundary cases need exact expected values | Confirm retry/backoff, batch size, max duration, timestamp tolerance, max results, URL formats |
| Role matrix and API error policy are unresolved | Security tests need a stable oracle | Confirm Viewer/Editor/Admin permissions and expected HTTP errors |
| Public site domain and member gating scope are unresolved | Public-site tests may be ambiguous | Confirm QA domain pattern and whether member-only behavior is in release scope |
| Accessibility scope/tooling is unresolved | A11Y cases need exact screen list and measurement method | Confirm screens and whether automated tooling is required |
| Google OAuth environment readiness is unresolved | Full round-trip tests may be blocked even though frontend start/error states are testable | Confirm #70 callback host, OAuth secrets, and trusted origins |
| Password reset-link email capture is unresolved | Token-completion cases for add/change/forgot password need mailbox access | Confirm deployed mailbox, email-capture service, or approved manual token fixture |
| Image asset API and ownership rule are unresolved | #74 tests need stable route names and isolation oracle | Confirm upload/list/update/remove routes, public URL pattern, and whether ownership is per operator, per tenant, or both |
| Site-editor Assistant diff oracle is unresolved | AI-generated edit correctness needs stable pass/fail criteria | Confirm supported edit operations and allowed diff fields for `REQ-BUILDER-006` |
| Public label and audience chat oracle is unresolved | Data correctness and chat tests need backend source fields and expected response shape | Confirm label fields and chat real-agent QA oracle |

## Conclusion

For the current goal of deriving test cases from the full PRD requirements and test plan, the answer is yes: the current test case artifact covers the system functions described in the master test plan and now uses one unified execution-level schema.

For the next QA gate, the answer is not yet: the suite still needs final test datasets, confirmed constants, QA-reviewed automation decisions, and a traceability/execution matrix before it should be treated as approved or automation-ready.

Recommended next artifact:

```text
qa-ai-workflow/traceability/riffables-master.traceability-matrix.md
```

That matrix should map:

```text
Test Plan Area -> Requirement ID -> Test Case ID -> Priority -> Type -> Test Data -> Automation Candidate -> Review Status
```
