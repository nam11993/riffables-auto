# Public Show Content Automation Report - 2026-07-21

## Scope

Target:

```text
https://sunday.apps.riffables.com/
```

Command:

```powershell
.\node_modules\.bin\playwright.cmd test automation/tests/public --workers=1
```

Spec:

```text
automation/tests/public/show-content.spec.ts
```

## Result

```text
9 tests
7 passed
2 skipped
1 expected-fail
0 unexpected failed
```

## Passed Testcases

| Testcase ID | Evidence |
| --- | --- |
| `TC-PUBLIC-001` | Sunday public site loaded with `Sunday Okay` context and refreshed successfully. |
| `TC-PUBLIC-009` | `PUBLIC_SITE_URL` is now real: `https://sunday.apps.riffables.com/`. |
| `TC-PUBLIC-003` | `/library` displayed multiple source/riff cards and `/search?q=K-pop` returned matching cards. |
| `TC-PUBLIC-007` | Library/search cards showed source label, riff sequence, title, and summary/snippet. |
| `TC-PUBLIC-011` | Required public card fields rendered consistently across multiple cards. |
| `TC-PUBLIC-010` | Invalid path returned `No published site was found here` without exposing Sunday library cards. |
| `TC-SEARCH-001` | Keyword query `K-pop` returned expected result `Fancams are an engine of K-pop virality`. |
| `TC-SEARCH-006` | Declared `K-pop` search total stayed within configured max result count `60`. |
| `TC-SEARCH-011` | Keyword search returned expected matching Sunday insight. |
| `TC-SEARCH-004` | Quoted exact phrase search ranked exact title first. |
| `TC-SEARCH-013` | Exact quoted search returned the exact expected title as first riffable result. |
| `TC-SEARCH-015` | Empty and whitespace search states remained safe. |
| `TC-SEARCH-016` | Long repeated `K-pop` query did not crash or expose internal errors. |

## Skipped / Fixture Gaps

| Testcase ID | Reason |
| --- | --- |
| `TC-PUBLIC-005` | Current riffable detail page exposes quote/source text but no clickable media timestamp/citation affordance. |
| `TC-PUBLIC-002`, `TC-PUBLIC-016` | Need `PUBLIC_TENANT_B_URL` and `PUBLIC_TENANT_B_UNIQUE_TEXT` to verify cross-tenant public isolation. |

## Expected Fail

| Testcase ID | Current behavior |
| --- | --- |
| `TC-PUBLIC-014` | Sunday public page still exposes template/demo placeholder copy: `Sample Studio`, `demo show`, `Package preview`, `Local sample`. |

## QA Notes

1. This batch is based on existing `TC-PUBLIC-*` and `TC-SEARCH-*` testcase IDs in `riffables-master.test-cases.md`.
2. Semantic search validation (`TC-SEARCH-002`, `TC-SEARCH-012`) still needs a golden semantic oracle before automation can pass or fail it fairly.
3. Audience chat cases (`TC-PUBLIC-018`, `TC-PUBLIC-019`) were not automated in this batch because the inspected public page did not expose a chat input flow beyond search/CTA links.
4. Citation timestamp playback should be automated after the product exposes a clickable source media link with timestamp metadata.
