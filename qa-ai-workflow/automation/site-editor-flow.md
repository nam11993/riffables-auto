# Baohan Site Editor Automation Flow

## Purpose

This flow covers the console Site and Site Editor test cases for the Baohan workspace. It is separate from the public Sunday show-content suite because this flow starts inside the authenticated creator console and validates the draft/editor/publish surface.

## Command

```powershell
npm run test:site
```

Direct Playwright command:

```powershell
playwright test automation/tests/console/sites-editor.spec.ts --workers=1
```

## Runtime Data

| Variable | Purpose | Default |
| --- | --- | --- |
| `BASE_URL` | Authenticated app URL. | `https://riffables.speedrunlabs.ai` |
| `SMOKE_EMAIL` | Baohan QA account email. | Required at runtime |
| `SMOKE_PASSWORD` | Baohan QA account password. | Required at runtime |
| `SITE_WORKSPACE_NAME` | Expected workspace/tenant label. | `baohan` |
| `SITE_SUBDOMAIN` | Expected publish subdomain. | `baohan` |
| `SITE_FIXED_SUFFIX` | Expected public host suffix. | `apps.riffables.com` |
| `SITE_PUBLIC_URL` | Published Baohan public URL for public-site checks. | Empty, guarded |
| `SITE_GOLDEN_KEYWORD` | Baohan public search golden query. | Empty, guarded |
| `SITE_GOLDEN_EXPECTED_TEXT` | Expected public result/copy for the golden query. | Empty, guarded |
| `SITE_NEGATIVE_PROBE` | Text that must not leak from another fixture. | `Sunday Okay` |
| `SITE_DRAFT_MUTATION_ENABLED` | Allows draft text edit/save checks. | `false` |
| `SITE_PUBLISH_ENABLED` | Allows publish/live URL mutation checks. | `false` |
| `SITE_LIFECYCLE_MUTATION_ENABLED` | Allows unpublish/republish/discard/delete checks. | `false` |

## Covered Test Cases

| Test Case ID | Automation Result | Notes |
| --- | --- | --- |
| `TC-CONSOLE-041` | Pass | A real Baohan site now exists and `/sites` loads `Manage & publish`. |
| `TC-CONSOLE-042` | Pass | Tenant-scoped manage/publish state is visible and Sunday fixture probe is absent. |
| `TC-CONSOLE-043` | Pass | Editor opens from `/sites`, remains authenticated, loads core editor regions, and survives refresh. |
| `TC-BUILDER-020` | Pass | Editor chrome includes Page sections, Section settings, Preview, Publish, and core controls. |
| `TC-BUILDER-021` | Pass | Content field edit accepts a marker, creates draft state, and Discard cleans the draft. |
| `TC-BUILDER-022` | Expected fail | Current UI accepts the edit before reload, but the value reverts after reload. |
| `TC-BUILDER-023` | Partial pass | Preview opens without publish. Draft-vs-live marker check requires controlled draft mutation. |
| `TC-BUILDER-024` | Pass | Site published with `baohan` subdomain. |
| `TC-BUILDER-025` | Partial pass | Invalid host with spaces/special characters is rejected or not made live. Remaining invalid values still need expansion. |
| `TC-CONSOLE-044` | Pass | `/sites` exposes `Unpublish`; confirm takes `baohan.apps.riffables.com` offline and the public URL returns `NOT FOUND`/no published site. |
| `TC-CONSOLE-045` | Pass | Publish from the editor restores the same `baohan.apps.riffables.com` URL and `/sites` returns to published/live state. |
| `TC-CONSOLE-046` | Pass | `Discard` appears inside the editor after duplicating a section as an unpublished draft change; confirm reverts the editor to the live snapshot and keeps the public URL published. |
| `TC-CONSOLE-047` | Pass | Delete cancel preserves the site; confirm-delete removes the current site, the old public URL returns no published site, and Template/editor recreates and republishes the configured site. |
| `TC-CONSOLE-048` | Blocked | Requires lower-privilege Baohan account/API fixture. |
| `TC-BUILDER-026` | Pass | Selects a real page section from the layers panel. |
| `TC-BUILDER-027` | Partial pass | Verifies inspector tabs after section selection. Field hover/focus highlight needs deeper selector support. |
| `TC-BUILDER-029` | Fail | Published public site still shows template placeholders and search has no Baohan content result. |
| `TC-PUBLIC-022` | Pass | `https://baohan.apps.riffables.com/` loads without Not Found. |
| `TC-PUBLIC-023` | Fail | `/search?q=test` returns `No matches`. |
| `TC-PUBLIC-024` | Partial pass | Root-level Sunday fixture probe is absent; full Sunday-only search probe remains. |
| `TC-BUILDER-030` | Partial pass | Assistant entrypoint opens. Prompt-level safety remains manual/gated. |
| `TC-BUILDER-031` | Pass | Viewport toolbar controls switch through Tablet/Mobile/Desktop/Fit/Free Drag, keep editor state non-draft, and clean up view mode. |
| `TC-BUILDER-032` | Pass | Add panel exposes supported sections and elements without creating `Discard` state. |
| `TC-BUILDER-033` | Pass | Design, Media, and Assistant side panels expose expected states; Assistant Send is disabled with empty input. |
| `TC-BUILDER-034` | Pass | Section duplicate, undo, redo, delete, and discard all behave reversibly and cleanup draft state. |
| `TC-BUILDER-035` | Pass | Toolbar, rail, help, duplicate, and delete controls satisfy 24px target-size check. |
| `TC-BUILDER-036` | Pass | Selected section Content tab exposes editable inputs, textareas, and selects. |
| `TC-BUILDER-037` | Pass | Data tab explains collection binding and lists `riffables`, `riffs`, and `articles`. |
| `TC-BUILDER-038` | Pass | Theme tab exposes allowed color, spacing, and font controls. |
| `TC-BUILDER-039` | Pass | Theme field edit creates draft state and Discard cleans it up. |
| `TC-BUILDER-040` | Pass | Media panel exposes upload empty state and image file constraints. |
| `TC-BUILDER-041` | Pass | Assistant prompt enables Send without creating a draft before submission. |
| `TC-BUILDER-042` | Pass | Editor Help tour opens, navigates Next/Back, and closes. |
| `TC-BUILDER-043` to `TC-BUILDER-046` | Manual/gated | Drag/drop insertion and real media upload validation need stable fixtures/selectors. |

## Latest Run

Date: 2026-07-21

```text
11 Playwright checks
7 passed
2 failed
2 skipped
```

Final public URL: `https://baohan.apps.riffables.com/`.

## Lifecycle Re-check

Date: 2026-07-22

```text
playwright test console/sites-editor.spec.ts --grep "TC-CONSOLE-04[4-8]" --workers=1
4 Playwright checks
3 passed
1 skipped
```

Passed: `TC-CONSOLE-044`, `TC-CONSOLE-045`, `TC-CONSOLE-046`, and `TC-CONSOLE-047`.

Skipped/blocked: `TC-CONSOLE-048` because no lower-privilege Baohan role fixture is available.

Requirement interpretation: `REQ-CONSOLE-012` and PRD issue `#54` describe lifecycle actions on a site (`POST /sites/:id/discard`, `DELETE /sites/:id`). They do not define multiple simultaneous template/site cards. In the current UI, `Template`/`New Template` routes to the same editor path and works as the way to start or replace/recreate the current site, not as a separate disposable secondary site.

## Detailed Editor Re-check

Date: 2026-07-22

```text
playwright test automation/tests/console/sites-editor.spec.ts --grep "TC-BUILDER-" --workers=1
21 Playwright checks
20 passed
1 skipped/guarded
```

Passed: editor chrome, content edit/discard, Preview, invalid publish guard, layers/inspector, viewport toolbar, Add panel section/element library, Design/Media/Assistant side panels, reversible section duplicate/undo/redo/delete/discard workflow, Content/Data/Theme/Media/Assistant input/Help tour detail checks, public fixture guard, and 24px icon target-size checks.

Expected fail: `TC-BUILDER-022` records the current draft persistence bug after reload.
