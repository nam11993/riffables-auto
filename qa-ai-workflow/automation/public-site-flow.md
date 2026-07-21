# Public Show Content Automation Flow

## Scope

This flow covers public audience-facing show content on:

```text
https://sunday.apps.riffables.com/
```

Executable Playwright spec:

```text
automation/tests/public/show-content.spec.ts
```

Run command:

```powershell
npm run test:public
```

Direct Playwright command when `npm` is not available in the bundled runtime:

```powershell
.\node_modules\.bin\playwright.cmd test automation/tests/public --workers=1
```

## Testcase Mapping

| Testcase ID | Automation status | Coverage |
| --- | --- | --- |
| `TC-PUBLIC-001` | Auto PASS | Loads the Sunday public site, verifies tenant context text, and confirms refresh keeps the public site usable. |
| `TC-PUBLIC-009` | Auto PASS | Replaces the previous missing-URL skip with the real Sunday `PUBLIC_SITE_URL` smoke. |
| `TC-PUBLIC-003` | Auto PASS | Opens `/library`, verifies multiple riff/source cards, then verifies `/search?q=K-pop` updates results. |
| `TC-PUBLIC-007` | Auto PASS | Checks required card fields before and after search: source label, riff sequence, title, and summary/snippet. |
| `TC-PUBLIC-011` | Auto PASS | Verifies public insight/riff cards display required fields consistently. |
| `TC-PUBLIC-010` | Auto PASS | Opens invalid public path and verifies not-found state does not expose Sunday content cards. |
| `TC-SEARCH-001` | Auto PASS | Keyword search for `K-pop` returns expected Sunday tenant result. |
| `TC-SEARCH-006` | Auto PASS | Declared search total stays within configured max result count. |
| `TC-SEARCH-011` | Auto PASS | Known keyword returns expected matching insight card. |
| `TC-SEARCH-004` | Auto PASS | Quoted exact phrase search ranks the exact wording match first. |
| `TC-SEARCH-013` | Auto PASS | Exact quoted search returns the exact expected title as the first riffable result. |
| `TC-SEARCH-015` | Auto PASS | Empty and whitespace search inputs show safe guidance/no-match states. |
| `TC-SEARCH-016` | Auto PASS | Long search input remains safe and does not crash. |
| `TC-PUBLIC-005` | Auto SKIP | Current page exposes quote/source text but no clickable media timestamp affordance. |
| `TC-PUBLIC-002` | Auto SKIP | Requires a Tenant B public URL and unique Tenant B text fixture. |
| `TC-PUBLIC-016` | Auto SKIP | Requires a Tenant B public URL and unique Tenant B text fixture. |
| `TC-PUBLIC-014` | Auto EXPECTED FAIL | Current page exposes template/demo placeholder labels such as `Sample Studio`, `demo show`, and `Package preview`. |

## Required Environment

Defaults are safe for the current Sunday QA fixture:

```text
PUBLIC_SITE_URL=https://sunday.apps.riffables.com/
PUBLIC_EXPECTED_TEXT=Sunday Okay
PUBLIC_SEARCH_KEYWORD=K-pop
PUBLIC_SEARCH_EXPECTED_TEXT=Fancams are an engine of K-pop virality
PUBLIC_EXACT_SEARCH_PHRASE=Fancams are an engine of K-pop virality
PUBLIC_SEARCH_MAX_RESULTS=60
PUBLIC_INVALID_URL=https://sunday.apps.riffables.com/__invalid-public-url-for-automation__
PUBLIC_RIFF_DETAIL_PATH=/riffs/efe73e16-5f80-4f2a-856a-4fd41cadd798
PUBLIC_RIFFABLE_DETAIL_PATH=/riffables/54817862-efa0-4b49-9eb1-18e00c588e42
```

Optional fixtures for skipped security/citation cases:

```text
PUBLIC_TENANT_B_URL=
PUBLIC_TENANT_B_UNIQUE_TEXT=
```

## Latest Result

Date: `2026-07-21`

```text
9 Playwright tests
7 passed
2 skipped
1 expected-fail
0 unexpected failed
```

Skipped:

```text
TC-PUBLIC-005 - no clickable media timestamp affordance on current public detail page.
TC-PUBLIC-002 / TC-PUBLIC-016 - missing Tenant B public fixture.
```

Expected fail:

```text
TC-PUBLIC-014 - current Sunday public page exposes template/demo placeholder copy.
```
