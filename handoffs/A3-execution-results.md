# Handoff — A3 Execution Results (to Healer Session)

> This handoff records the first execution of the A3 duplicate-email suite against the live ZincBank app, the failures observed, their root causes, and exactly what is/is not fixed on disk. The next session should complete the automation-level fixes, re-run, and report the remaining requirement-vs-application mismatches as defects/requirement clarifications.

## Test execution state

**Date:** 2026-09-07 · **Environment:** local, live app `https://zincbank.cydeo.io`

### 1. Automated run (Cucumber, isolated A3)

- **Command:** `npx cucumber-js --config cucumber.duplicate-email.js --format progress`
- **Config:** temp isolated config `cucumber.duplicate-email.js` in repo root (`paths: ['tests/duplicate-email.feature']`, `require: ['src/steps/**/*.ts']`, `requireModule: ['ts-node/register']`) — avoids the all-feature glob in `cucumber.js` dragging in A1/A2.
- **Result (run made BEFORE any code fixes):**
  - `7 scenarios (7 failed)`
  - `72 steps (48 passed, 17 skipped, 7 failed)`
  - Duration 0m 53s

### 2. Live-app verification (manual, Playwright MCP)

Not an automated test — evidence-gathering against the real app:

- Registered `e2e-a3-live-20260907@example.com` through the full 6-step apply → approved ("Welcome to ZincBank, E2E").
- Second apply with the **same email** → stays on **Step 6 Review & confirm**; a note appears with `data-testid="apply-error"`, text **"An account with that email already exists"**.
- Apply with **uppercase** variant `E2E-A3-LIVE-20260907@EXAMPLE.COM` → same duplicate note (case is normalized).
- Apply with **whitespace** variant `  e2e-a3-live-20260907@example.com  ` → same duplicate note (surrounding whitespace is trimmed).
- On the review step the earlier-step inputs (`apply-firstname-input`, `apply-lastname-input`, `apply-email-input`, `apply-password-input`, `apply-confirm-input`) are **not in the DOM** (unmounted).
- Review summary is `dl[data-testid="apply-review-summary"]` with `<dt>/<dd>` rows: Accounts, Name, Email, SSN, Employment, Address. **No Password row.**

## Failing scenarios (exact)

All failures below are from the pre-fix run.

| #   | Scenario (feature line)                                                      | Failing step                                               | Error (verbatim)                                                                                                                                                                               | Root cause class                                   |
| --- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | A brand-new email registers successfully (line 11)                           | `Given an account is already registered…` (`steps.ts:50`)  | `Error: function timed out, ensure the promise resolves within 5000 milliseconds`                                                                                                              | Automation (step timeout)                          |
| 2   | Registering again with the same email is rejected (line 17)                  | `Given …` (`steps.ts:50`)                                  | `function timed out … 5000 milliseconds`                                                                                                                                                       | Automation (step timeout)                          |
| 3   | The duplicate-email message is shown exactly (line 23)                       | `Then a duplicate-email message is shown` (`steps.ts:150`) | `expect(locator).toBeVisible() failed — Locator: getByText('An account with this email already exists. Please sign in instead.') — Expected: visible — Timeout: 5000ms — element(s) not found` | Automation (locator) + Requirement mismatch (text) |
| 4   | Duplicate detection ignores case … (line 36, example `Test@X.com`)           | `Given …` (`steps.ts:50`)                                  | `function timed out … 5000 milliseconds`                                                                                                                                                       | Automation (step timeout)                          |
| 5   | Duplicate detection ignores case … (line 37, example `E2E-Case@example.com`) | `Given …` (`steps.ts:50`)                                  | `function timed out … 5000 milliseconds`                                                                                                                                                       | Automation (step timeout)                          |
| 6   | Rejecting a duplicate does not change the existing account (line 40)         | `Then the application is rejected` (`steps.ts:144`)        | `function timed out … 5000 milliseconds` (expect on text locator never resolved)                                                                                                               | Automation (locator)                               |
| 7   | Rejected form keeps the name and email and clears the password (line 47)     | `Then the application is rejected` (`steps.ts:144`)        | `function timed out … 5000 milliseconds` (expect on text locator never resolved)                                                                                                               | Automation (locator)                               |

## Suspected root causes

1. **Cucumber step timeout (dominant, scenarios 1, 2, 4, 5):** the Background's full 6-step apply flow (`applyForCheckingAccount`) exceeds Cucumber's **5s default step timeout**. `Before` hook has no `this.setDefaultTimeout(...)`.
2. **Duplicate-message locator (scenarios 3, 6, 7):** `duplicateEmailMessage` used `page.getByText('An account with this email already exists. Please sign in instead.')` — no `data-testid` and the text is wrong. Live app: `getByTestId('apply-error')` with text **"An account with that email already exists"**.
3. **Boundary sentinels (latent, scenarios 4/5):** the Scenario Outline examples `Test@X.com` / `E2E-Case@example.com` are sentinels — no static `.feature` string can name the runtime-generated `registeredEmail` — but the step passes them through **literally**. After the timeout is fixed, applying a literal variant would be _accepted_ (different email), so `Then the application is rejected` would fail. Must map sentinels to real variants: `Test@X.com` → `registeredEmail.toUpperCase()` (case), `E2E-Case@example.com` → `` `  ${registeredEmail}  ` `` (whitespace). App normalization of both verified live.
4. **Form-state assertion (latent, scenario 7):** on the review step the form inputs are unmounted, so `inputValue()` on them fails. App surfaces name/email in `apply-review-summary` and exposes **no password row**. The approved scenario wording ("fields still show the entered values", "password field is empty") cannot be asserted against form fields — see requirement mismatch below.

## Files involved

| File                                                        | Status                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `tests/duplicate-email.feature`                             | **Unchanged** (approved, read-only source of truth)                                         |
| `src/pages/duplicate-email.page.ts`                         | **PARTIALLY modified** — see below                                                          |
| `src/steps/duplicate-email.steps.ts`                        | **UNCHANGED** — no fixes applied yet                                                        |
| `cucumber.duplicate-email.js`                               | Temp isolated config created this session; **still present in repo root** (reuse or remove) |
| `src/pages/open-account.page.ts`, `src/pages/login.page.ts` | Referenced, unchanged                                                                       |

## What has been changed on disk (partial — POM only)

Applied to `src/pages/duplicate-email.page.ts`:

1. `duplicateEmailMessage` → `page.getByTestId('apply-error')` (was text-based `getByText(...)`).
2. Added `reviewSummary = page.getByTestId('apply-review-summary')` and `getReviewSummaryValue(term)` helper (assertion-free; reads the `<dd>` for a `<dt>` term) — added for investigation.

**Known cosmetic defect:** the JSDoc block above `duplicateEmailMessage` is now stale (still describes the old text-based locator). A JSDoc-update edit was shown and cancelled — re-apply or leave; it does not affect execution.

## Which failures look like AUTOMATION issues (fix in code)

1. **Step timeout** — add Cucumber `setDefaultTimeout(60000)` (module-level, e.g. `import { … , setDefaultTimeout } from '@cucumber/cucumber'` then `setDefaultTimeout(60000);`) — NOT YET APPLIED.
2. **Duplicate-message locator** — `getByTestId('apply-error')` — APPLIED (unverified by re-run).
3. **Boundary sentinel mapping** in `the user applies for an account using the email {string}` — map `Test@X.com` → `registeredEmail.toUpperCase()` and `E2E-Case@example.com` → `` `  ${registeredEmail}  ` `` — NOT YET APPLIED.

## Which failures look like APPLICATION / REQUIREMENT mismatches (keep assertion, let fail, report as defect or AC clarification)

Per user direction these are NOT to be "fixed" in the test — keep the original assertions, let them fail, and report:

1. **Duplicate-message exact text (scenario 3, `the message reads`):** approved AC/feature wording is `"An account with this email already exists. Please sign in instead."` but the live app shows `"An account with that email already exists"`. Requirement text ≠ application text. Even with the correct `apply-error` locator, `toHaveText(approved wording)` fails. → candidate defect (req: wording mismatch) or AC clarification.
2. **Form-state after rejection (scenario 7):** approved scenarios assert the _fields_ "still show the entered values" and "the password field is empty", but the app keeps the user on the Review & confirm step where the form inputs are **unmounted**; it surfaces name/email in `apply-review-summary` and reflects **no password**. `inputValue()` on the inputs cannot pass. → candidate requirement clarification (how does the app actually surface retained state?) or defect (password not visibly cleared/omitted).

## What has NOT been fixed yet / next steps for the healer

1. `src/steps/duplicate-email.steps.ts` — apply: `setDefaultTimeout(60000)` (Cucumber API) + sentinel mapping (root causes 1 & 3).
2. Re-run isolated A3: `npx cucumber-js --config cucumber.duplicate-email.js --format progress` — expect scenarios 1, 2, 4, 5, 6 to pass; scenarios 3 & 7 to fail on the requirement mismatches above.
3. Static checks: `npx tsc --noEmit`; `npx eslint src/pages/duplicate-email.page.ts src/steps/duplicate-email.steps.ts --config eslint.config.js`.
4. Remove temp `cucumber.duplicate-email.js` when done (or keep if the isolated-run pattern should be the norm).
5. Report scenarios 3 & 7 as potential defects / AC clarifications (candidate labels: req:ambiguous/req:silent on exact message text; form-state semantics) — ZincTM record pending user approval.
6. Optional cleanup: live test account `e2e-a3-live-20260907@example.com` was registered during verification; no backend delete was performed.
7. Still outstanding from original handoff: no Playwright spec for A3; no ZincTM linking/run recording for ZTM-24 … ZTM-28.
