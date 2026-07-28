# Test Cases

Stores manual test cases and automation candidates.

## Current Main File

The master Markdown table test case file for the whole project is:

```text
qa-ai-workflow/test-cases/riffables-master.test-cases.md
```

Current status:

- 88/88 included requirement IDs are covered.
- 466 total test cases.
- 152 test cases currently have automation status.
- Foundation smoke cases cover authentication, protected routes, workspace context, password visibility, Google OAuth start/error states, and YouTube source connection.
- All 466 cases use the same execution-level schema with `Workflow`, `Test Data`, `Automation Candidate`, and `Status`.
- Acceptance-criteria execution cases add missing depth from the first draft.
- The latest update adds A11Y baseline automation for target size, editor headings, landmarks/names/alt baseline, visible focus indicator, validation alert semantics, icon-button names, and keyboard navigation.
- The 2026-07-28 PRD update adds atomic coverage for two site templates, editor/public parity, FAQ/podcast links, section styling, image picker, getting-started checklist, builder image attachments, and image-understanding security.

Covered modules:

- Foundation authentication and source connection
- Tenant security
- Ingestion pipeline
- Controlled ingestion
- AI extraction/citation/re-extraction
- Search/public site
- Creator console
- Theme customization
- Accessibility/UX
- Site builder/onboarding regression


## Export Vietnamese Excel

Run this command from the repo root to generate an Excel workbook translated to Vietnamese from the current master testcase Markdown file:

```powershell
pnpm export:testcases:vi
```

Default output:

```text
qa-ai-workflow/test-cases/exports/riffables-master.test-cases.vi.xlsx
```

The workbook contains a fully translated Vietnamese testcase sheet, a summary sheet, and translation notes. Stable IDs, URLs, product names, standard automation statuses, tenant terminology, and UI labels in backticks are intentionally preserved.
The file is kept as Markdown tables for QA review and execution. If automation import is needed later, approved cases can be converted to YAML using stable IDs.

Suggested machine-readable format:

```text
<feature-name>.test-cases.yaml
```
