# Handoff — A3 Final Complete

> Created: 2026-09-08
> Scope: Final handoff for the ZincBank Module A3 "duplicate-email registration" work, ahead of the Git commit. Automation is complete; two requirement/application mismatches remain open and are tracked in ZincTM.

---

## 1. Requirement

- **Module:** A (Getting Started) · **Task:** A3 — duplicate-email registration
- **Requirement title (ZincTM):** "Someone signs up twice with the same email"
- **ZincTM requirement ID:** `60ad7a57-0b6e-4757-98ba-0abcd8dfa01c` (ref: `A3`)
- **Approved acceptance criteria:**
  - A3.1 Duplicate-email detection SHALL be case-insensitive and ignore leading/trailing whitespace.
  - A3.2 On duplicate email the system SHALL reject submission and display the message "An account with this email already exists. Please sign in instead."
  - A3.3 On duplicate email the system SHALL NOT create a new account and SHALL NOT change any existing balance.
  - A3.4 On duplicate email the form SHALL retain the entered name and email; only the password field is cleared.

## 2. Automation created

| File                                 | Role                                                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/duplicate-email.feature`      | Approved Gherkin source of truth (7 scenarios: 5 negative/boundary/regression + positive control). **Unchanged** throughout.            |
| `src/steps/duplicate-email.steps.ts` | Cucumber step definitions delegating to the Page Object; includes runtime duplicate-email sentinel mapping.                             |
| `src/pages/duplicate-email.page.ts`  | Page Object: duplicate-message locator (`apply-error`), review-summary accessors, form getters.                                         |
| `src/tests/duplicate-email.spec.ts`  | Playwright spec mirroring the feature; per-test unique `e2e-a3-*` seed accounts in `beforeEach`.                                        |
| `cucumber.duplicate-email.js`        | Temp isolated Cucumber config (`paths: ['tests/duplicate-email.feature']`) — belongs to this work; still in repo root (keep or remove). |

## 3. Framework design

A3 follows the repo's **dual-runner convention**:

- **Cucumber/Gherkin BDD** — `tests/duplicate-email.feature` + `src/steps/duplicate-email.steps.ts`, run via `npx cucumber-js --config cucumber.duplicate-email.js`.
- **Playwright spec** — `src/tests/duplicate-email.spec.ts`, run via `npx playwright test ... --project=Chromium`.
- **Shared Page Object** — both runners reuse the same POM (`DuplicateEmailPage`, backed by `OpenAccountPage` / `LoginPage`), selecting only by `data-testid` (contract: `{page}-{component}-{action|field}`).

## 4. Automation fixes made

| Fix                                      | File                                 | Change                                                                                                                                                                 |
| ---------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cucumber default timeout                 | `src/steps/duplicate-email.steps.ts` | Added `setDefaultTimeout(60 * 1000)` — the Background's 6-step apply flow exceeded Cucumber's default 5 s step timeout.                                                |
| Runtime duplicate-email sentinel mapping | `src/steps/duplicate-email.steps.ts` | Scenario Outline sentinels mapped to runtime variants: `Test@X.com` → `registeredEmail.toUpperCase()`; `E2E-Case@example.com` → `` `  ${registeredEmail}  ` ``.        |
| Whitespace sentinel fix                  | `src/steps/duplicate-email.steps.ts` | Gherkin table cells strip alignment whitespace; match the trimmed value `E2E-Case@example.com` while still padding the runtime email with two leading/trailing spaces. |
| Duplicate-message locator                | `src/pages/duplicate-email.page.ts`  | `duplicateEmailMessage` → `page.getByTestId('apply-error')` (replaced brittle text-based `getByText(...)`); stale JSDoc corrected.                                     |
| Playwright layer                         | `src/tests/duplicate-email.spec.ts`  | Spec + POM-driven tests with unique `e2e-a3-*` seed accounts per test (`beforeEach`), web-first assertions, no arbitrary sleeps.                                       |

The approved `tests/duplicate-email.feature` was **not modified** at any time.

## 5. Final execution results

**Cucumber** (`npx cucumber-js --config cucumber.duplicate-email.js --format progress`, Chromium, live app `https://zincbank.cydeo.io`):

```text
7 scenarios (5 passed, 2 failed)
72 steps (69 passed, 1 skipped, 2 failed)
1m 15s
```

**Playwright Chromium** (`npx playwright test src/tests/duplicate-email.spec.ts --project=Chromium`):

```text
7 tests (5 passed, 2 failed)
~40.8s
```

Both runners fail on the same two scenarios (see §6). A transient live-app "Internal server error" during `beforeEach` (looked like 4/3) was confirmed as flakiness, not the official result.

## 6. Known unresolved failures

### Scenario 3 / ZTM-25 — duplicate-email message exact text

- **Expected (approved message):** `"An account with this email already exists. Please sign in instead."`
- **Actual app:** `"An account with that email already exists"` (different article "that" vs "this"; omits "Please sign in instead.")
- **Locator status:** correct — `getByTestId('apply-error')` resolves and is visible.
- **Classification:** requirement/application mismatch (wording). Assertion intentionally kept failing — do not weaken.

### Scenario 7 / ZTM-28 — post-rejection form state

- **Approved expectation:** step-1 name/email fields retain entered values; password field is empty.
- **Actual app:** remains on Review & confirm; step-1 inputs (`apply-firstname-input`, `apply-lastname-input`, `apply-email-input`, `apply-password-input`, `apply-confirm-input`) are unmounted; name/email only in `dl[data-testid="apply-review-summary"]`; no Password row.
- **Classification:** unresolved requirement/application UX mismatch (two readings: review summary as source of truth, or app should return to a retained form). Assertion intentionally kept failing — do not weaken.

## 7. ZincTM work completed

- **A3 run ZTM-37 recorded** (`a4658021-c8ac-4ef3-b484-5da62022c27c`) — "ZincBank Module A3 - Duplicate email Playwright run (Chromium)", environment `prod`, trigger `agent`, status `completed`. Chromium execution recorded per test case:

| Test case | Result |
| --------- | ------ |
| ZTM-24    | PASS   |
| ZTM-25    | FAIL   |
| ZTM-26    | PASS   |
| ZTM-27    | PASS   |
| ZTM-28    | FAIL   |

- **Automation script links created for ZTM-24 … ZTM-28** — all `framework: playwright`, `filePath: src/tests/duplicate-email.spec.ts` (verified via `tm_list_scripts` read-back, 2026-09-08):
  - ZTM-24 → `automated`
  - ZTM-25 → `in_progress`
  - ZTM-26 → `automated`
  - ZTM-27 → `automated`
  - ZTM-28 → `in_progress`

## 8. Defect status

**Defect creation COMPLETED — both defects were filed and confirmed via read-back (`tm_get_defect`).** They exist in ZincTM, so they are not pending:

| Defect                                                                                   | Key        | UUID                                   | Status | Severity / Priority | Links                                                               | Labels                                           |
| ---------------------------------------------------------------------------------------- | ---------- | -------------------------------------- | ------ | ------------------- | ------------------------------------------------------------------- | ------------------------------------------------ |
| A3: Duplicate-email rejection message wording differs from approved requirement (ZTM-25) | **ZTM-38** | `6f34d93e-e870-4c26-a9ea-eee641b37efa` | `new`  | S4 / P3             | A3 (`60ad7a57-…`), ZTM-25 (`d59eafbd-…`), run ZTM-37 (`a4658021-…`) | `req:ambiguous`, `req:silent`, `duplicate-email` |
| A3: Post-rejection form-state UX differs from approved requirement (ZTM-28)              | **ZTM-39** | `35e6860a-a345-4540-8de0-7e3215253d3e` | `new`  | S3 / P2             | A3 (`60ad7a57-…`), ZTM-28 (`dc3547f9-…`), run ZTM-37 (`a4658021-…`) | `req:ambiguous`, `unresolved`, `duplicate-email` |

- **Plan Mode blocker note:** filing was initially blocked while the session was in Plan Mode (the two `tm_file_defect` calls were refused). Once the plan was approved and plan mode was exited, both defects were filed successfully and read back — the blocker did **not** prevent creation.
- Both defects remain in `new`; **no lifecycle transitions** have been made (a resolution — fixed / wont_fix / duplicate / cannot_reproduce / not_a_bug — will be required before either can reach `closed` or `rejected`).

## 9. Other known issue

- `npx tsc --noEmit` reports the **pre-existing** type-definition errors: `node` (3 errors) and `normalize-package-data` (3 errors).
- No compile error is attributed to the A3 spec (`src/tests/duplicate-email.spec.ts`) or the A3 pages/steps.

## 10. Files created/modified (from `git status` — all untracked on `main`)

- `cucumber.duplicate-email.js`
- `debug-report.md`
- `handoffs/` — `A3-analysis.md`, `A3-automation-ready.md`, `A3-defect-review-complete.md`, `A3-execution-results.md`, `A3-feature-complete.md`, `A3-healer-complete.md`, `A3-final-complete.md` (this file)
- `reports/A3-scenario-3-clarification.md`
- `reports/A3-scenario-7-clarification.md`
- `src/pages/duplicate-email.page.ts`
- `src/steps/duplicate-email.steps.ts`
- `src/tests/duplicate-email.spec.ts`
- `tests/duplicate-email.feature`

Tracked baseline unchanged: `main` at `c994e80` (A1 open-account + A2 sign-in).

## 11. Recommended next steps

1. **ZincTM defects:** already filed (ZTM-38, ZTM-39) — no further filing needed; optionally add a comment thread recording the decision once made.
2. **Obtain BA/Product clarification for ZTM-25 and ZTM-28** — decide: (a) update the requirement to match the app, or (b) require the app to match the approved wording/UX.
3. **Update requirement or application only after that decision** — via `tm_update_requirement` (the labelled fix) and/or a dev change; do not touch the automation assertions beforehand.
4. **Rerun Chromium** (`npx playwright test src/tests/duplicate-email.spec.ts --project=Chromium`) to confirm the baseline after any change.
5. **Then run the full cross-browser matrix** (Chromium + Firefox + WebKit) — previously deferred until Scenarios 3 & 7 are resolved.
6. **Retest the failed ZincTM cases** (ZTM-25, ZTM-28) and record results; transition ZTM-38/ZTM-39 to `fixed`/`closed` with the agreed resolution only after verification.

---

_No automation was modified while creating this handoff._
