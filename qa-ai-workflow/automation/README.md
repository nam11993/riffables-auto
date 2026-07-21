# Automation

Executable Playwright automation is stored in:

```text
automation/
```

Current automated coverage:

```text
TC-AUTH-001
TC-AUTH-003
TC-AUTH-004
TC-AUTH-023
TC-AUTH-024
TC-AUTH-025
TC-AUTH-044
TC-AUTH-045
TC-AUTH-046
TC-AUTH-047
TC-AUTH-048
TC-AUTH-049
TC-AUTH-050
TC-AUTH-051
TC-AUTH-052
TC-CONSOLE-003
TC-CONSOLE-009
TC-CONSOLE-011
TC-CONSOLE-023
TC-CONSOLE-024
TC-CONSOLE-025
TC-CONSOLE-026
TC-SOURCE-001
TC-SOURCE-003
TC-SOURCE-007
TC-SOURCE-009
TC-SOURCE-013
TC-SOURCE-014
TC-SOURCE-015
TC-SOURCE-016
TC-SOURCE-017
TC-SOURCE-018
TC-SOURCE-022
TC-SOURCE-023
TC-SOURCE-024
TC-SOURCE-025
TC-SOURCE-026
TC-SOURCE-031
TC-SOURCE-034A
TC-SOURCE-036
TC-SOURCE-037
TC-SOURCE-038A
TC-SOURCE-039
TC-SOURCE-040
TC-SOURCE-041
TC-SOURCE-042A
TC-SOURCE-043
TC-SOURCE-044
TC-SOURCE-045
TC-SOURCE-045A
TC-CATALOG-001
TC-CATALOG-010
TC-CATALOG-013
TC-CATALOG-014
TC-CATALOG-017
TC-CATALOG-019
TC-CATALOG-020
TC-CRAWL-013
TC-INGEST-016
TC-INGEST-018
TC-INGEST-020
TC-SEARCH-001
TC-SEARCH-004
TC-SEARCH-006
TC-SEARCH-011
TC-SEARCH-013
TC-SEARCH-015
TC-SEARCH-016
TC-PUBLIC-001
TC-PUBLIC-002
TC-PUBLIC-003
TC-PUBLIC-005
TC-PUBLIC-007
TC-PUBLIC-009
TC-PUBLIC-010
TC-PUBLIC-011
TC-PUBLIC-014
TC-PUBLIC-016
TC-PUBLIC-022
TC-PUBLIC-023
TC-PUBLIC-024
TC-CONSOLE-041
TC-CONSOLE-042
TC-CONSOLE-043
TC-CONSOLE-044
TC-CONSOLE-045
TC-CONSOLE-046
TC-CONSOLE-047
TC-CONSOLE-048
TC-BUILDER-020
TC-BUILDER-021
TC-BUILDER-022
TC-BUILDER-023
TC-BUILDER-024
TC-BUILDER-025
TC-BUILDER-026
TC-BUILDER-027
TC-BUILDER-029
TC-BUILDER-030
TC-A11Y-005
TC-ONBOARD-007
```

Latest full staging run:

```text
35 Playwright tests
32 passed
3 skipped
0 failed
```

Skipped in the latest full run:

```text
TC-PUBLIC-009 - missing PUBLIC_SITE_URL
TC-SOURCE-023 - current fixture now has a connected source
TC-SOURCE-002/TC-SOURCE-008 - full Google OAuth flow is gated by SOURCE_CONNECT_FULL=false
```

Known expected-fail checks counted as passed by Playwright:

```text
TC-SOURCE-016
TC-SOURCE-017
TC-SOURCE-018
```

These represent current source-input validation gaps on staging.

Latest connected-source no-data run:

```text
npm run test:sources:connected-no-data
7 passed
```

This run covers the connected YouTube source card, details modal, schedule modal review, read-only refresh, pipeline visibility, and empty Channel Videos panel. It does not submit crawl, backfill, schedule creation, catalog refresh, selected ingestion, delete, or mode-switch actions.

Latest connected-source action no-data run:

```text
npm run test:sources:action-no-data
4 Playwright checks passed
```

Per-case QA status for `TC-SOURCE-034A`, `TC-SOURCE-038A`, `TC-SOURCE-042A`, and `TC-SOURCE-045A` is partial until backend job/content count assertions are added.

Latest connected-source populated crawl-data run:

```text
npm run test:sources:crawl-data
6 Playwright checks
5 passed
1 failed
```

Pass coverage: populated catalog metadata/search, Failed row selectability, No insights disabled state, selected Failed retry, Queued transition, terminal failure, and no-audio/no-transcript content.

Fail coverage: `TC-SOURCE-034`, `TC-CRAWL-002`, and `TC-CRAWL-010` still fail for the full Run crawl contract because the expected multi-item successful crawl did not complete; earlier audio fixture `test 2` returned provider `Video unavailable`.

Latest successful audio-content run:

```text
npm run test:sources:crawl-success
1 passed
```

This verifies the newly ingested `test 3` content row has `TRANSCRIPT Available` and contributes to the `with transcript` count. Full multi-item Run crawl remains separate from this selected-ingest success check.

Latest exact selected two-video run:

```text
npm run test:sources:exact-selected
1 passed
```

This verifies the completed exact selected-ingest state for the two newest eligible clips: a `2/2` recent run, content count `3 with transcript`, and `Video 1` with `TRANSCRIPT Available`. The original mutating run selected `chiếc đèn cuối phố` plus `Video 1`; because those rows are now processed, full unselected-row coverage requires three fresh selectable clips in the catalog at the same time.

Latest unselected-row guard run:

```text
Visible in-app browser run
Catalog: 8 videos
Selected: video 5, video 4
Unselected guard: Clip 3 remained fresh/selectable
Recent run: 2/2
Last error: None
```

This completes full `TC-SOURCE-045` exact selected/unselected coverage for the current fixture. The selected rows later ended as `No insights`; that is acceptable for selection coverage, but it is not a generated-riffable success signal. Rerunning the mutating guard requires three new fresh selectable rows in the same catalog state.

Latest public show-content run:

```text
npm run test:public
9 Playwright tests
7 passed
2 skipped
1 expected-fail
0 unexpected failed
```

Pass coverage: Sunday public site load/refresh, library cards, keyword search, exact quoted search ranking, invalid public URL, and search boundary inputs.

Skipped coverage:

```text
TC-PUBLIC-005 - current detail page has quote/source text but no clickable media timestamp affordance.
TC-PUBLIC-002 / TC-PUBLIC-016 - missing Tenant B public URL and unique Tenant B label fixture.
```

Expected fail:

```text
TC-PUBLIC-014 - Sunday public page still exposes template/demo placeholder copy (`Sample Studio`, `demo show`, `Package preview`).
```

Latest Baohan site/editor run:

```text
npm run test:site
11 Playwright checks
7 passed
2 failed
2 skipped
```

Pass coverage: Baohan `/sites` manage/publish state, editor entry from `/sites`, authenticated editor context, editor refresh, Preview button, publish to `https://baohan.apps.riffables.com/`, invalid publish subdomain guard, layers/section selection, inspector tabs, and Assistant entrypoint.

Failures: `TC-BUILDER-021` could not expose an editable text field after section selection, and `TC-BUILDER-029` / `TC-PUBLIC-023` failed because the Baohan public site still shows template placeholders and `/search?q=test` returns `No matches`.

Skipped/blocked coverage: `TC-BUILDER-022` did not run in the final pass because the edit marker was not created, and lifecycle cases `TC-CONSOLE-044` to `TC-CONSOLE-048` still need exposed unpublish/delete controls or role fixtures.

Automation flow mapping is documented in:

```text
qa-ai-workflow/automation/smoke-flow.md
qa-ai-workflow/automation/auth-account-flow.md
qa-ai-workflow/automation/setup-organization-flow.md
qa-ai-workflow/automation/home-flow.md
qa-ai-workflow/automation/workspace-account-flow.md
qa-ai-workflow/automation/source-flow.md
qa-ai-workflow/automation/public-site-flow.md
qa-ai-workflow/automation/site-editor-flow.md
```

Luu script automation hoac tai lieu huong dan automation.

Chi dua test case vao automation khi case da on dinh, co expected result ro va co gia tri regression.
