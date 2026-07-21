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
| `TC-BUILDER-021` | Fail | Final run could not expose an editable text field after section selection. |
| `TC-BUILDER-022` | Fail | Previous mutation run showed draft marker reverting after reload; final run skipped because marker creation failed. |
| `TC-BUILDER-023` | Partial pass | Preview opens without publish. Draft-vs-live marker check requires controlled draft mutation. |
| `TC-BUILDER-024` | Pass | Site published with `baohan` subdomain. |
| `TC-BUILDER-025` | Partial pass | Invalid host with spaces/special characters is rejected or not made live. Remaining invalid values still need expansion. |
| `TC-CONSOLE-044` | Blocked | UI did not expose an executable Unpublish control. |
| `TC-CONSOLE-045` | Blocked | Requires an unpublished fixture/state. |
| `TC-CONSOLE-046` | Blocked | Discard control was not exposed. |
| `TC-CONSOLE-047` | Blocked | No disposable site/delete control was available. |
| `TC-CONSOLE-048` | Blocked | Requires lower-privilege Baohan account/API fixture. |
| `TC-BUILDER-026` | Pass | Selects a real page section from the layers panel. |
| `TC-BUILDER-027` | Partial pass | Verifies inspector tabs after section selection. Field hover/focus highlight needs deeper selector support. |
| `TC-BUILDER-029` | Fail | Published public site still shows template placeholders and search has no Baohan content result. |
| `TC-PUBLIC-022` | Pass | `https://baohan.apps.riffables.com/` loads without Not Found. |
| `TC-PUBLIC-023` | Fail | `/search?q=test` returns `No matches`. |
| `TC-PUBLIC-024` | Partial pass | Root-level Sunday fixture probe is absent; full Sunday-only search probe remains. |
| `TC-BUILDER-030` | Partial pass | Assistant entrypoint opens. Prompt-level safety remains manual/gated. |

## Latest Run

Date: 2026-07-21

```text
11 Playwright checks
7 passed
2 failed
2 skipped
```

Final public URL: `https://baohan.apps.riffables.com/`.
