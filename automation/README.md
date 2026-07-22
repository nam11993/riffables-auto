# Riffables Automation

This folder contains executable Playwright automation derived from the QA AI workflow test cases.

Flow-to-testcase mapping is tracked in:

```text
qa-ai-workflow/automation/smoke-flow.md
qa-ai-workflow/automation/auth-account-flow.md
qa-ai-workflow/automation/auth-negative-password-flow.md
qa-ai-workflow/automation/setup-organization-flow.md
qa-ai-workflow/automation/home-flow.md
qa-ai-workflow/automation/workspace-account-flow.md
qa-ai-workflow/automation/source-flow.md
qa-ai-workflow/automation/public-site-flow.md
qa-ai-workflow/automation/site-editor-flow.md
```

## Current Smoke Scope

The first smoke flow covers:

| Test Case ID | Coverage |
| --- | --- |
| `TC-AUTH-003` | Unauthenticated user cannot open protected console route. |
| `TC-AUTH-001` | Valid creator login reaches authenticated console/workspace. |
| `TC-CONSOLE-011` | Core console navigation loads. |
| `TC-SOURCE-007` | Source connection entry point opens when present. |
| `TC-AUTH-004` | Sign out blocks protected route again. |
| `TC-PUBLIC-009` | Published public site loads when `PUBLIC_SITE_URL` is provided. |

## Current Auth Negative/Password Scope

| Test Case ID | Coverage |
| --- | --- |
| `TC-AUTH-002`, `TC-AUTH-008` | Wrong password and generated unknown email are rejected with generic `Invalid email or password`; no protected session is created. |
| `TC-AUTH-009` | Blank email and blank password states keep submit disabled and protected route remains gated. |
| `TC-AUTH-013` | Password visibility toggle reveals and masks without changing typed value or submitting the form. |
| `TC-AUTH-014` | Returning from password step to email step resets the next password step to masked state. |
| `TC-AUTH-015` | Password toggle has accessible label, keyboard operation, `aria-pressed`, and 24x24 px target baseline. |
| `TC-AUTH-034` | Forgot-password request for generated unknown email returns generic confirmation without account-existence leak. |
| `TC-AUTH-043` | Signed-out `/settings` is gated and cannot trigger `Change password`. |

## Current Source Scope

| Test Case ID | Coverage |
| --- | --- |
| `TC-SOURCE-001`, `TC-SOURCE-007` | Sources page opens, supported source choices are visible, and availability states match staging. |
| `TC-SOURCE-002`, `TC-SOURCE-008` | Full YouTube channel connect in Auto mode. Gated by `SOURCE_CONNECT_FULL=true`; currently blocked by Google OAuth automation security. |
| `TC-SOURCE-003`, `TC-SOURCE-009` | Manual mode can be selected before Google owner verification. |
| `TC-SOURCE-013` | YouTube source form accepts `SOURCE_YOUTUBE_HANDLE`, currently `@nhnbaohan`, and starts Google owner verification. |
| `TC-SOURCE-014` | Existing connected YouTube channel is active in Auto mode with crawl controls. Passes when the selected workspace has `SOURCE_YOUTUBE_HANDLE` connected. |
| `TC-SOURCE-015` | Blank YouTube source input cannot be submitted. |
| `TC-SOURCE-016` | Malformed YouTube handles are rejected before source creation. Expected-fail on current staging. |
| `TC-SOURCE-017` | Unsupported external domains are rejected. Expected-fail on current staging. |
| `TC-SOURCE-018` | Unsupported YouTube URL types are rejected in the channel connector. Expected-fail on current staging. |
| `TC-SOURCE-022` | Source types marked `Crawling soon` cannot be submitted as active sources. |
| `TC-SOURCE-023` | No-source workspace shows first-source empty state and no ingestion runs. |
| `TC-SOURCE-024`, `TC-SOURCE-039` | Connected Auto source card, metadata, crawl controls, pipeline, and recent runs are visible before crawl data exists. |
| `TC-SOURCE-025`, `TC-SOURCE-026` | Source Details modal and details-to-content navigation stay scoped to the active workspace/source. |
| `TC-SOURCE-031` | Schedule modal exposes recurring crawl cadence choices and closes without creating a schedule. |
| `TC-SOURCE-036`, `TC-SOURCE-037` | Force rerun and backfill controls are visible without submitting run/backfill work. Partial pass until crawl data/job fixtures exist. |
| `TC-SOURCE-040` | Page Refresh reloads visible state without changing connected source configuration. |
| `TC-SOURCE-041`, `TC-SOURCE-043` | Channel Videos panel handles empty catalog state, search, and pagination without ingestion. |
| `TC-SOURCE-034A` | Run crawl handles empty or no-eligible-data source state. |
| `TC-SOURCE-038A` | Backfill handles valid request with no matching data. |
| `TC-SOURCE-042A` | Catalog Refresh handles empty provider result. |
| `TC-SOURCE-045A` | Ingest selected with zero selected or empty catalog is blocked safely. |
| `TC-SOURCE-042`, `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013`, `TC-CATALOG-014` | Populated channel catalog refresh shows known video metadata and states. |
| `TC-SOURCE-043`, `TC-CATALOG-017` | Populated catalog search filters known titles without ingest. |
| `TC-SOURCE-044`, `TC-CATALOG-019`, `TC-CATALOG-020` | Catalog row state controls selectability for current Failed and No insights fixture rows. |
| `TC-SOURCE-045`, `TC-INGEST-016`, `TC-INGEST-020`, `TC-CRAWL-013` | Failed catalog video retry queues one selected item, shows Queued, then surfaces terminal failure. |
| `TC-INGEST-018`, `TC-CRAWL-013` | Successful audio clip content shows transcript after ingest. |
| `TC-SOURCE-045`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-CRAWL-013`, `TC-INGEST-018` | Exact selected two-video ingest completed with `2/2` run total and transcript content. |
| `TC-SOURCE-034`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-INGEST-018` | Full populated Run crawl success contract. Current staging fails because the audio fixture returns provider `Video unavailable`. |

## Current Home Scope

| Test Case ID | Coverage |
| --- | --- |
| `TC-CONSOLE-003` | Home dashboard links reach main creator workflows and return Home. |
| `TC-CONSOLE-009` | Top-level console sections remain identifiable after refresh. |
| `TC-CONSOLE-023` | Home Overview summary modules show Sources, Riffs, Articles, and Site workspace status. |
| `TC-CONSOLE-024` | Home Overview summary modules navigate to Sources, Content, Content, and Sites. |
| `TC-CONSOLE-025` | Home Next step CTA routes to the recommended Sources workflow. |
| `TC-CONSOLE-026` | Home How it works sequence explains connect, extract, and publish. |
| `TC-A11Y-005` | Dashboard screens have one visible `h1` and ordered headings. |
| `TC-ONBOARD-007` | First authenticated Home visit asks whether the user is new. |

## Current Workspace/Account Scope

| Test Case ID | Coverage |
| --- | --- |
| `TC-AUTH-049` | Home workspace menu lists workspace rows plus `Create workspace` and `Account settings`. |
| `TC-AUTH-050` | Account Settings opens from the Home workspace menu and shows sign-in methods. |
| `TC-AUTH-051` | Create workspace modal validates blank input, auto-generates slug, rejects invalid slug, and cancels cleanly. |
| `TC-AUTH-052` | Created workspace becomes active, persists after sign-out/sign-in, and is selectable from setup organization. |

## Current Public Show Content Scope

| Test Case ID | Coverage |
| --- | --- |
| `TC-PUBLIC-001`, `TC-PUBLIC-009` | Sunday public site loads, refreshes, and keeps tenant context visible. |
| `TC-PUBLIC-003`, `TC-PUBLIC-007`, `TC-PUBLIC-011` | Public library/search cards show source label, riff sequence, title, and snippet. |
| `TC-PUBLIC-010` | Invalid public path shows not-found state without exposing library content. |
| `TC-SEARCH-001`, `TC-SEARCH-006`, `TC-SEARCH-011` | Keyword search for `K-pop` returns expected matching insight and stays within result limit. |
| `TC-SEARCH-004`, `TC-SEARCH-013` | Quoted exact phrase search ranks the exact wording match first. |
| `TC-SEARCH-015`, `TC-SEARCH-016` | Empty, whitespace, and long search inputs do not crash or expose errors. |
| `TC-PUBLIC-005` | Skipped until the public detail page exposes clickable media timestamp/citation affordance. |
| `TC-PUBLIC-002`, `TC-PUBLIC-016` | Skipped until Tenant B public URL and unique label fixtures are available. |
| `TC-PUBLIC-014` | Expected-fail while Sunday page exposes template/demo placeholder copy. |

## Current Site Editor Scope

| Test Case ID | Coverage |
| --- | --- |
| `TC-CONSOLE-041` | Baohan site exists and `/sites` loads the `Manage & publish` state. |
| `TC-CONSOLE-042` | Baohan manage/publish state is tenant scoped and no Sunday fixture data is visible. |
| `TC-CONSOLE-043`, `TC-BUILDER-020` | Opening the Baohan editor from `/sites` keeps authenticated context, loads Page sections, Section settings, Preview, Publish, and survives refresh. |
| `TC-BUILDER-021` | Content field edit accepts a marker, creates draft state, and Discard cleans the draft. |
| `TC-BUILDER-022` | Expected-fail: content edit is accepted before reload but still reverts after reload in the current UI. |
| `TC-BUILDER-023` | Editor Preview opens from the Baohan editor without publishing. Draft-vs-live marker assertions need a controlled draft mutation fixture. |
| `TC-BUILDER-024`, `TC-PUBLIC-022` | Baohan site publishes and `https://baohan.apps.riffables.com/` loads. |
| `TC-BUILDER-025` | Invalid publish subdomain with spaces/special characters is rejected or kept non-live. |
| `TC-CONSOLE-044`, `TC-CONSOLE-045` | Pass. `/sites` exposes `Unpublish`; automation confirmed the site goes offline and then republished the same `baohan.apps.riffables.com` URL from the editor. |
| `TC-CONSOLE-046` | Pass. Editor `Discard` appears after an unpublished draft change, confirmation reverts the draft to the live snapshot, and the live public site remains published. |
| `TC-CONSOLE-047` | Pass. `Delete` modal cancels safely, confirm-delete removes the current site, the old public URL returns no published site, and Template/editor recreates and republishes the configured site. |
| `TC-CONSOLE-048` | Skipped/blocked until a lower-privilege Baohan role fixture is available. |
| `TC-BUILDER-026`, `TC-BUILDER-027` | Layers/section selection and inspector tabs are visible and usable for the Baohan editor. |
| `TC-BUILDER-029`, `TC-PUBLIC-023` | Fail because the published public site still shows template placeholders and `/search?q=test` returns `No matches`. |
| `TC-PUBLIC-024` | Partial pass for root-level Sunday probe; full Sunday-only query coverage remains. |
| `TC-BUILDER-030` | Assistant entrypoint opens without auto-publish. Prompt-level safety remains manual until QA approves an AI mutation fixture. |
| `TC-BUILDER-031` | Viewport toolbar controls `Tablet`, `Mobile`, `Desktop`, `Fit View`, and `Free Drag Mode` are usable without creating draft state, then clean up view mode. |
| `TC-BUILDER-032` | Add panel exposes section and element libraries without mutating the draft. |
| `TC-BUILDER-033` | Design, Media, and Assistant side panels expose the expected empty/input states. |
| `TC-BUILDER-034` | Section duplicate, undo, redo, delete, and discard are reversible and clean up draft state. |
| `TC-BUILDER-035` | Editor toolbar, rail, help, duplicate, and delete icon controls meet the 24px minimum pointer target check. |
| `TC-BUILDER-036` | Selected section Content tab exposes editable fields and structured controls. |
| `TC-BUILDER-037` | Selected section Data tab explains binding workflow and real collections. |
| `TC-BUILDER-038` | Selected section Theme tab exposes allowed color, spacing, and font controls. |
| `TC-BUILDER-039` | Theme field edit creates draft state and Discard cleans it up. |
| `TC-BUILDER-040` | Media panel exposes upload empty state and image file constraints. |
| `TC-BUILDER-041` | Assistant prompt input enables Send without creating a draft before submission. |
| `TC-BUILDER-042` | Editor Help tour opens, navigates Next/Back, and closes. |
| `TC-BUILDER-043` to `TC-BUILDER-046` | Manual/gated coverage for drag/drop section insertion, element insertion, valid media upload/application, and invalid media validation. |

## Setup

Install dependencies:

```powershell
npm install
npx playwright install chromium
```

Create a local `.env` from `.env.example` or set the same variables in your shell.

Required:

```text
BASE_URL
SMOKE_EMAIL
SMOKE_PASSWORD
```

Recommended:

```text
LOGIN_PATH
PROTECTED_PATH
CONSOLE_PATH
AUTH_STORAGE_STATE
PUBLIC_SITE_URL
PUBLIC_EXPECTED_TEXT
PUBLIC_SEARCH_KEYWORD
PUBLIC_SEARCH_EXPECTED_TEXT
PUBLIC_EXACT_SEARCH_PHRASE
PUBLIC_SEARCH_MAX_RESULTS
PUBLIC_INVALID_URL
PUBLIC_RIFF_DETAIL_PATH
PUBLIC_RIFFABLE_DETAIL_PATH
PUBLIC_TENANT_B_URL
PUBLIC_TENANT_B_UNIQUE_TEXT
SITE_WORKSPACE_NAME
SITE_SUBDOMAIN
SITE_FIXED_SUFFIX
SITE_PUBLIC_URL
SITE_GOLDEN_KEYWORD
SITE_GOLDEN_EXPECTED_TEXT
SITE_NEGATIVE_PROBE
SITE_DRAFT_MUTATION_ENABLED
SITE_PUBLISH_ENABLED
SITE_LIFECYCLE_MUTATION_ENABLED
TENANT_EXPECTED_TEXT
SOURCE_EXPECTED_CHOICES
SOURCE_YOUTUBE_URL
SOURCE_YOUTUBE_HANDLE
SOURCE_ACTION_NO_DATA
SOURCE_BACKFILL_EMPTY_DATE
SOURCE_CRAWL_DATA
SOURCE_CRAWL_MUTATION
SOURCE_EXPECTED_VIDEO_COUNT
SOURCE_CRAWL_AUDIO_TITLE
SOURCE_CRAWL_SILENT_TITLE
SOURCE_CRAWL_SUCCESS_TITLE
SOURCE_CRAWL_AUDIO_EXPECTED_STATE
SOURCE_CRAWL_SILENT_EXPECTED_STATE
SOURCE_CRAWL_SEARCH_KEYWORD
SOURCE_CRAWL_WAIT_MS
SOURCE_EXACT_SELECTED_TITLES
SOURCE_EXACT_SELECTED_EXPECTED_TOTAL
SOURCE_EXACT_SELECTED_EXPECTED_TRANSCRIPT_COUNT
```

The sign-in page also has a `Continue with Google` option, but this smoke suite prioritizes the direct email/password form submit. If a future account is routed through Google OAuth, Playwright may be blocked by Google's browser automation protections. In that case the authenticated smoke tests are skipped with an explicit reason. To run that OAuth variant, provide one of these:

- A non-Google QA email/password login.
- An app-supported QA auth bypass for staging.
- A pre-captured Playwright storage state path through `AUTH_STORAGE_STATE`.
- A test session cookie/token that can be loaded before the smoke flow.

Selector overrides are optional and should only be used if the default accessible label/placeholder detection does not work:

```text
SELECTOR_EMAIL
SELECTOR_PASSWORD
SELECTOR_SUBMIT
SELECTOR_SIGN_OUT
```

## Run

All automated tests:

```powershell
npm test
```

Latest full staging check:

```text
25 passed
1 skipped
```

The skipped test is `TC-PUBLIC-009`, which requires `PUBLIC_SITE_URL`.

Smoke only:

```powershell
npm run test:smoke
```

Auth account flows:

```powershell
npm run test:auth
```

Auth negative/password focused run:

```powershell
pnpm run test:auth:negative
```

Latest smoke staging check:

```text
3 passed
1 skipped
```

The skipped test is `TC-PUBLIC-009`, which requires `PUBLIC_SITE_URL`.

Latest auth account staging check:

```text
15 Playwright tests
7 auth-negative/password checks passed
8 account/setup checks previously passed
```

The auth suite covers login rejection, blank validation, password visibility/accessibility, unknown-email forgot-password safety, signed-out settings protection, `TC-AUTH-023`, `TC-AUTH-024`, `TC-AUTH-025`, and setup-organization cases `TC-AUTH-044` through `TC-AUTH-048`. Password reset/change completion cases that require mailbox or reset-link capture remain manual/gated.

Latest workspace/account staging check:

```text
4 tests passed
```

The workspace/account suite covers `TC-AUTH-049` through `TC-AUTH-052`. It creates a real staging workspace for `TC-AUTH-052`, so use a dedicated QA account for repeatable runs.

Public show-content regression:

```powershell
npm run test:public
```

Latest public show-content run:

```text
9 Playwright tests
7 passed
2 skipped
1 expected-fail
0 unexpected failed
```

The skipped cases need additional public fixtures: `TC-PUBLIC-005` needs a clickable media timestamp/citation affordance, and `TC-PUBLIC-002` / `TC-PUBLIC-016` need a Tenant B public URL plus unique Tenant B label. The expected-fail case is `TC-PUBLIC-014`, because the current Sunday public page still shows template/demo placeholder copy.

Site editor regression:

```powershell
npm run test:site
```

Latest Baohan site/editor staging check:

```text
playwright test automation/tests/console/sites-editor.spec.ts --grep "TC-BUILDER-" --workers=1
21 Playwright checks
20 passed
1 skipped/guarded
```

The live Baohan public URL is `https://baohan.apps.riffables.com/`. `TC-BUILDER-022` is tracked as an expected-fail for the current draft persistence bug after reload. Baohan public content/search binding remains a product/data issue in `TC-BUILDER-029` / `TC-PUBLIC-023`.

Latest detailed editor re-check:

```text
playwright test automation/tests/console/sites-editor.spec.ts --grep "TC-BUILDER-" --workers=1
21 Playwright checks
20 passed
1 skipped/guarded
```

Latest source staging check with no-source workspace fixture:

```text
11 tests run: 6 active pass checks, 3 expected-fail validation checks, 2 skipped gated/fixture checks
```

The no-source source suite uses `SOURCE_YOUTUBE_HANDLE=@nhnbaohan`. The expected-fail checks are `TC-SOURCE-016`, `TC-SOURCE-017`, and `TC-SOURCE-018`, because current staging enables `Verify with Google` for malformed handles, unsupported domains, and unsupported YouTube URL types. `TC-SOURCE-014` is skipped for a no-source workspace and should be run with a connected-source fixture.

Latest connected-source verification after manual Google owner handoff:

```text
TC-SOURCE-014: 1 passed
```

Full YouTube channel creation (`TC-SOURCE-002`/`TC-SOURCE-008`) is available behind `SOURCE_CONNECT_FULL=true`, plus `SOURCE_GOOGLE_EMAIL` and `SOURCE_GOOGLE_PASSWORD`. The latest attempt reached Google OAuth for `@nhnbaohan`, but Google blocked the automated browser with `This browser or app may not be secure` before consent. To complete this case, use a pre-authorized storage state, a manual Google consent handoff, or a staging OAuth bypass. Full Manual-mode save (`TC-SOURCE-003`/`TC-SOURCE-009`) has the same OAuth boundary after the pre-OAuth mode selection check.

Manual Google owner consent handoff:

```powershell
npm run source:oauth:manual
```

This opens real Chrome or Edge with a dedicated local profile at `.auth/chrome-oauth-profile`. Complete Riffables sign-in, open Sources, enter the approved YouTube channel, click `Verify with Google`, and finish Google consent in that real browser window. After the source is connected, run:

```powershell
npm run test:sources:connected
```

That verifies `TC-SOURCE-014` against the connected-source state without trying to automate Google's sign-in page.

Connected-source no-data regression:

```powershell
npm run test:sources:connected-no-data
```

Latest connected-source no-data staging check:

```text
7 tests passed
```

This suite is intentionally read-only for expensive or destructive source actions. It verifies connected-source UI, details, schedule review, refresh, pipeline, and empty catalog browsing, but does not click `Run crawl`, `Backfill`, `Create schedule`, `Refresh`, `Ingest selected`, `Delete`, or `Switch to manual`.

Connected-source action no-data regression:

```powershell
$env:SOURCE_ACTION_NO_DATA='true'
npm run test:sources:action-no-data
```

Latest connected-source action no-data staging check:

```text
4 tests passed
```

This suite submits the no-data variants of `Run crawl`, `Backfill`, catalog `Refresh`, and `Ingest 0 selected`. Keep it on a controlled connected-source fixture. These Playwright checks prove UI/action stability; the corresponding QA testcase status remains partial until backend job, queue, catalog, and content counts are asserted.

Connected-source populated crawl-data regression:

```powershell
$env:SOURCE_CRAWL_DATA='true'
$env:SOURCE_CRAWL_MUTATION='true'
npm run test:sources:crawl-data
```

Latest populated crawl-data staging check:

```text
6 tests run
5 passed
1 failed
```

The passing checks cover populated catalog metadata, catalog search, Failed/No insights selectability, selected Failed retry, queued state, terminal failure feedback, and no-audio/no-transcript content. The failing check is the full successful Run crawl contract: current staging showed latest run `0/1 · 1 failed` instead of the expected two-video success, and the audio fixture returned provider `Video unavailable`.

Successful audio-content check:

```powershell
$env:SOURCE_CRAWL_DATA='true'
npm run test:sources:crawl-success
```

Latest successful audio-content staging check:

```text
1 passed
```

This check uses `SOURCE_CRAWL_SUCCESS_TITLE`, currently `test 3`, and verifies the ingested content is visible with `TRANSCRIPT Available` and at least one item with transcript.

Exact selected two-video check:

```powershell
$env:SOURCE_CRAWL_DATA='true'
npm run test:sources:exact-selected
```

Latest exact selected staging check:

```text
1 passed
```

The fresh run selected the two newest eligible catalog rows, `chiếc đèn cuối phố` and `Video 1`, submitted `Ingest 2 selected`, and reached run total `2/2`. The repeatable automation check validates the completed state even after newer runs exist: a `2/2` recent run is present, `Video 1` has `TRANSCRIPT Available`, and the content list shows `3 with transcript`.

Exact selected unselected-row guard:

```powershell
$env:SOURCE_CRAWL_DATA='true'
$env:SOURCE_CRAWL_MUTATION='true'
npm run test:sources:exact-selected-mutation
```

Latest unselected-row guard result:

```text
Visible in-app browser run passed
Catalog: 8 videos
Selected: video 5, video 4
Unselected guard: Clip 3 remained fresh/selectable
Recent run: 2/2
Last error: None
```

Full `TC-SOURCE-045` exact selected/unselected coverage passed on 2026-07-20. The run selected `video 5` and `video 4`, submitted `Ingest 2 selected`, verified both selected rows moved to `Queued`, verified unselected `Clip 3` did not enter the pipeline, and confirmed Recent runs reached `2/2`. The selected rows later ended as `No insights`; that is acceptable for selection coverage, but it is not a generated-riffable success signal. Rerunning this mutating guard requires three new fresh selectable rows.

Headed mode:

```powershell
npm run test:smoke:headed
```

Debug mode:

```powershell
npm run test:debug
```

Open HTML report:

```powershell
npm run report
```

## Information Needed From QA

Before making the smoke suite stable, provide:

- QA/staging console URL. Current target: `https://riffables.speedrunlabs.ai`.
- Direct email/password staging account. Keep the real credentials in local environment variables only.
- Protected route path, for example `/console/sources`. Current smoke can log in from `/sign-in` and start from `/`.
- Expected tenant/workspace label after login.
- Whether source connection can be opened safely.
- Public tenant site URL if public smoke should run.
- Any selectors for login fields if labels/placeholders are not standard.
