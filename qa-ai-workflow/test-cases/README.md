# Test Cases

Stores manual test cases and automation candidates.

## Current Main File

The master Markdown table test case file for the whole project is:

```text
qa-ai-workflow/test-cases/riffables-master.test-cases.md
```

Current status:

- 74/74 included requirement IDs are covered.
- 384 draft test cases.
- Foundation smoke cases cover authentication, protected routes, workspace context, password visibility, Google OAuth start/error states, and YouTube source connection.
- All 384 cases use the same execution-level schema with `Workflow`, `Test Data`, `Automation Candidate`, and `Status`.
- Acceptance-criteria execution cases add missing depth from the first draft.
- The latest update adds focused coverage for Baohan site creation, editor editing, publish lifecycle, Baohan public-site verification, site-editor Assistant diffs, onboarding consent, console backend API wiring, public labels, and audience chat.

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

The file is kept as Markdown tables for QA review and execution. If automation import is needed later, approved cases can be converted to YAML using stable IDs.

Suggested machine-readable format:

```text
<feature-name>.test-cases.yaml
```
