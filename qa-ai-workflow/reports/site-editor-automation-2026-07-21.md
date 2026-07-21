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
| `TC-BUILDER-021` | After selecting a section, the editor still showed `Select a section...`; no editable text field was exposed in the final run. |
| `TC-BUILDER-022` | In an earlier mutation run, a draft marker was accepted before reload but reverted to `A library of conversations` after reload. In the final run it was skipped because `TC-BUILDER-021` could not create the marker. |
| `TC-BUILDER-029`, `TC-PUBLIC-023` | Public Baohan site still shows placeholder content such as `Sample Studio`/`Local sample`, and `/search?q=test` returns `No matches`. |

## Skipped Or Blocked

| Test case(s) | Reason |
| --- | --- |
| `TC-CONSOLE-044` to `TC-CONSOLE-048` | Lifecycle mutation was enabled, but the current UI did not expose unpublish/delete controls and no lower-privilege fixture is available. |
| `TC-PUBLIC-024` | Root-level negative probe for `Sunday Okay` passed, but full Sunday-only query coverage was not executed. |

## Notes

- The real public site created/published in this run is `https://baohan.apps.riffables.com/`.
- The current editor surface observed: `Site editor`, public host link, `Desktop`, `Tablet`, `Mobile`, `Fit View`, `Preview`, `Publish`, `Design`, `Media`, `Assistant`, `Page sections`, and `Section settings`.
- The public site is live but still renders template/placeholder library content rather than Baohan crawled content.
