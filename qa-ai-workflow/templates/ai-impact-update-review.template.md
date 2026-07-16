# PRD Change QA Review: <timestamp>

## Source

| Field | Value |
| --- | --- |
| Repository | `<owner>/<repo>` |
| Sync report | `<path>` |
| Previous snapshot | `<path>` |
| Current snapshot | `<path>` |
| Impact JSON | `<path>` |

## Summary

| Metric | Count |
| --- | ---: |
| New issues | 0 |
| Changed issues | 0 |
| Removed issues | 0 |
| Files updated | 0 |
| Items needing clarification | 0 |

## Issue Impact Analysis

| Issue | Change Summary | Classification | Decision |
| --- | --- | --- | --- |
| `#<id>` | `<what changed>` | `requirement-impact` | `<updated / no-impact / needs-review>` |

## Requirements Updated

| Requirement ID | Action | Source Issue | Notes |
| --- | --- | --- | --- |
| `REQ-...` | `added / changed / deprecated / no-change` | `#<id>` | `<summary>` |

## Test Plans Updated

| Test Plan | Action | Source Issue | Notes |
| --- | --- | --- | --- |
| `<file>` | `changed / no-change / not-created-yet` | `#<id>` | `<summary>` |

## Test Cases Updated

| Test Case ID | Action | Source Issue | Notes |
| --- | --- | --- | --- |
| `TC-...` | `added / changed / deprecated / no-change / not-created-yet` | `#<id>` | `<summary>` |

## Automation Impact

| Area | Impact | Recommended Action |
| --- | --- | --- |
| `<suite/script/API>` | `<impact>` | `<action>` |

## No-Impact Decisions

| Issue | Reason |
| --- | --- |
| `#<id>` | `<why no doc update was needed>` |

## Needs Confirmation

| Question | Owner | Blocking |
| --- | --- | --- |
| `<question>` | `QA/Product/Engineering` | `yes/no` |

## Files Changed

- `<path>`

## QA Review Checklist

- [ ] Requirement changes match PRD issue changes.
- [ ] No unrelated modules were rewritten.
- [ ] Deprecated items were marked instead of silently deleted.
- [ ] Test plan impact is documented.
- [ ] Test case impact is documented.
- [ ] Open questions are assigned.
- [ ] Traceability remains valid.

