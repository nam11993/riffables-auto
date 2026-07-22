# Site Editor Automation Report - 2026-07-21

## Scope

Authenticated Baohan Site and Site Editor automation.

Command:

```powershell
npm run test:site
```

Runtime:

```text
BASE_URL=https://riffables.speedrunlabs.ai
SITE_WORKSPACE_NAME=baohan
SITE_SUBDOMAIN=baohan
SITE_FIXED_SUFFIX=apps.riffables.com
SITE_PUBLIC_URL=https://baohan.apps.riffables.com/
SITE_GOLDEN_KEYWORD=test
SITE_NEGATIVE_PROBE=Sunday Okay
SITE_DRAFT_MUTATION_ENABLED=true
SITE_PUBLISH_ENABLED=true
SITE_LIFECYCLE_MUTATION_ENABLED=true
```

## Result

```text
11 Playwright checks
7 passed
2 failed
2 skipped
```

## Passed And Partial

| Test case(s) | Result |
| --- | --- |
| `TC-CONSOLE-041`, `TC-CONSOLE-042` | Baohan site now exists; `/sites` loads the `Manage & publish` state and does not show the Sunday fixture probe. |
| `TC-CONSOLE-043`, `TC-BUILDER-020` | The editor opens from `/sites`, remains authenticated, shows Page sections, Section settings, Preview, Publish, and still works after refresh. |
| `TC-BUILDER-023` | Preview opens from the editor. |
| `TC-BUILDER-024`, `TC-PUBLIC-022` | Publish uses subdomain `baohan` and `https://baohan.apps.riffables.com/` loads without `NOT FOUND`. |
| `TC-BUILDER-025` | Invalid publish subdomain input with spaces/special characters is handled without exposing a live-site action. |
| `TC-BUILDER-026`, `TC-BUILDER-027` | A real page section can be selected from the layers panel and inspector tabs are visible. |
| `TC-BUILDER-030` | Assistant entrypoint opens and no auto-publish path is exercised. |

## Failed

| Test case(s) | Reason |
| --- | --- |
| `TC-BUILDER-029`, `TC-PUBLIC-023` | Public Baohan site still shows placeholder content such as `Sample Studio`/`Local sample`, and `/search?q=test` returns `No matches`. |

## Skipped Or Blocked

| Test case(s) | Reason |
| --- | --- |
| `TC-CONSOLE-048` | No lower-privilege Baohan role fixture is available for UI/API authorization verification. |
| `TC-PUBLIC-024` | Root-level negative probe for `Sunday Okay` passed, but full Sunday-only query coverage was not executed. |

## Lifecycle Re-check - 2026-07-22

Command:

```powershell
playwright test console/sites-editor.spec.ts --grep "TC-CONSOLE-04[4-8]" --workers=1
```

Result:

```text
4 Playwright checks
3 passed
1 skipped
```

| Test case(s) | Result |
| --- | --- |
| `TC-CONSOLE-044`, `TC-CONSOLE-045` | Pass. `/sites` exposes `Unpublish`; automation confirmed the site becomes offline, the public URL returns `NOT FOUND`/no published site, then publishing from the editor restores the same `baohan.apps.riffables.com` URL. |
| `TC-CONSOLE-046` | Pass. `Discard` appears in the editor after an unpublished draft change is created by duplicating a section; confirming `Discard changes` reverts the draft to the live snapshot and keeps the public URL published. |
| `TC-CONSOLE-047` | Pass. Delete cancel preserves the site; confirm-delete removes the current site, the old public URL returns no published site, and Template/editor recreates and republishes the configured site. |
| `TC-CONSOLE-048` | Skipped/blocked. Requires a lower-privilege Baohan role fixture. |

Requirement note: PRD issue `#54` and `REQ-CONSOLE-012` define lifecycle actions on the current site, not on multiple simultaneous template cards. The current UI exposes one `Your audience site` card; `Template`/`New Template` routes to `/sites/editor` and behaves as the path to start or replace/recreate that current site.

## Detailed Editor Re-check - 2026-07-22

Command:

```powershell
playwright test automation/tests/console/sites-editor.spec.ts --grep "TC-BUILDER-" --workers=1
```

Result:

```text
21 Playwright checks
20 passed
1 skipped/guarded
```

| Test case(s) | Result |
| --- | --- |
| `TC-BUILDER-021` | Pass. Selected Hero content field accepted a QA marker, created draft state, and Discard cleaned the draft. |
| `TC-BUILDER-022` | Expected fail. The field edit is accepted before reload but reverts to `A library of conversations` after reload in the current UI. |
| `TC-BUILDER-031` | Pass. Viewport toolbar controls `Tablet`, `Mobile`, `Desktop`, `Fit View`, and `Free Drag Mode` stayed usable, did not create draft state, and cleaned up view mode. |
| `TC-BUILDER-032` | Pass. Add panel exposed supported sections and elements without mutating the draft. |
| `TC-BUILDER-033` | Pass. Design, Media, and Assistant panels exposed expected states, including Upload/empty media library and disabled Assistant Send with no input. |
| `TC-BUILDER-034` | Pass. Section duplicate, undo, redo, delete, and discard were reversible and cleaned up draft state. |
| `TC-BUILDER-035` | Pass. Toolbar, rail, help, duplicate, and delete controls satisfied the 24px target-size check. |
| `TC-BUILDER-036` to `TC-BUILDER-042` | Pass. Content, Data, Theme, Media upload constraints, Assistant prompt input, and Help tour checks passed. |
| `TC-BUILDER-043` to `TC-BUILDER-046` | Manual/gated. Drag/drop insertion and real media upload validation need stable fixtures/selectors. |

## Notes

- The real public site created/published in this run is `https://baohan.apps.riffables.com/`.
- The current editor surface observed: `Site editor`, public host link, `Desktop`, `Tablet`, `Mobile`, `Fit View`, `Preview`, `Publish`, `Design`, `Media`, `Assistant`, `Page sections`, and `Section settings`.
- The public site is live but still renders template/placeholder library content rather than Baohan crawled content.
