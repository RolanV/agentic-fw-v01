# Handoff — A3 Healer Session Complete

> Created: 2026-09-07  
> Scope: Diagnose and fix only automation/framework defects in the A3 duplicate-email Cucumber suite. Do not change approved Gherkin or expected behavior.  
> Final state: All approved automation fixes applied; two requirement/application mismatches remain to be reviewed by QA/business.

---

## A3 test execution results

**Command:** `npx cucumber-js --config cucumber.duplicate-email.js --format progress`  
**Environment:** Chromium, local, live app `https://zincbank.cydeo.io`  
**Final run:**

```text
7 scenarios (5 passed, 2 failed)
72 steps (69 passed, 1 skipped, 2 failed)
1m 15s
```

| #   | Scenario                                                        | Status  |
| --- | --------------------------------------------------------------- | ------- |
| 1   | A brand-new email registers successfully                        | ✅ PASS |
| 2   | Registering again with the same email is rejected               | ✅ PASS |
| 3   | The duplicate-email message is shown exactly                    | ❌ FAIL |
| 4   | Duplicate detection ignores case (`Test@X.com`)                 | ✅ PASS |
| 5   | Duplicate detection ignores whitespace (`E2E-Case@example.com`) | ✅ PASS |
| 6   | Rejecting a duplicate does not change the existing account      | ✅ PASS |
| 7   | Rejected form keeps the name and email and clears the password  | ❌ FAIL |

---

## Automation defects found

### Defect 1 — Cucumber step timeout

- **Root cause:** `src/steps/duplicate-email.steps.ts` did not set a Cucumber step timeout. The Background’s full 6-step apply flow exceeded Cucumber’s default 5 s step timeout.
- **Impact:** Scenarios failed in the Background `Given` before scenario-specific assertions ran.
- **Class:** Automation/framework defect.

### Defect 2 — Wrong duplicate-message locator

- **Root cause:** `DuplicateEmailPage.duplicateEmailMessage` used brittle text matching against the approved Gherkin wording; the live app exposes the message at `data-testid="apply-error"` with different text. A partial fix was already present on disk; only the JSDoc was stale.
- **Class:** Automation/framework locator defect.

### Defect 3 — Boundary sentinel emails not mapped to registered-email variants

- **Root cause:** The Scenario Outline examples (`Test@X.com`, `E2E-Case@example.com`) are literal strings and cannot collide with the runtime-generated `registeredEmail`. Case-insensitive and whitespace-trimmed duplicate detection could not be exercised without mapping sentinels to variants of the actual registered email.
- **Class:** Automation/framework test-data mismatch.

### Defect 4 — Whitespace sentinel value was trimmed by the Gherkin parser

- **Root cause:** Gherkin table cells strip surrounding alignment whitespace, so the step received `E2E-Case@example.com`, not `E2E-Case@example.com`.
- **Class:** Automation/framework test-data mismatch (discovered after first rerun).

## Automation fixes applied

| Fix                       | File                                 | Change                                                                                                                                                 |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cucumber timeout          | `src/steps/duplicate-email.steps.ts` | Added `import { …, setDefaultTimeout }` and `setDefaultTimeout(60 * 1000);`                                                                            |
| Duplicate-message locator | `src/pages/duplicate-email.page.ts`  | JSDoc updated; locator was already `page.getByTestId('apply-error')`                                                                                   |
| Boundary sentinel mapping | `src/steps/duplicate-email.steps.ts` | `Test@X.com` → `registeredEmail.toUpperCase()`; `E2E-Case@example.com` → `` `  ${registeredEmail}  ` ``                                                |
| Whitespace sentinel match | `src/steps/duplicate-email.steps.ts` | Changed sentinel comparison to the trimmed Gherkin value `E2E-Case@example.com` while still padding the runtime email with two leading/trailing spaces |

The approved `tests/duplicate-email.feature` was **not modified** at any time.

---

## Remaining failures (requirement/application mismatches)

### Scenario 3 — The duplicate-email message is shown exactly

- **Failing step:** `And the message reads "An account with this email already exists. Please sign in instead."`
- **Expected (approved Gherkin/AC):** `"An account with this email already exists. Please sign in instead."`
- **Actual live app text:** `"An account with that email already exists"`
- **Locator status:** ✅ correct — `getByTestId('apply-error')` resolves and the element is visible.
- **Classification:** Requirement/application mismatch. The approved wording differs from the live application copy.
- **Recommended action:** File as a requirement clarification or application defect; decide whether to update the requirement to match the app, or request the app be updated to match the approved wording.

### Scenario 7 — Rejected form keeps the name and email and clears the password

- **Failing step:** `And the name and email fields still show the entered values`
- **Expected (approved scenario):** The original step-1 form inputs (first name, last name, email) still contain the entered values, and the password field is empty.
- **Actual live app behavior:** After rejection, the app keeps the user on the Review & confirm step. The step-1 input fields are unmounted from the DOM; name/email are surfaced only via `dl[data-testid="apply-review-summary"]`, and there is **no Password row** in the summary.
- **Locator status:** The automation correctly targets `apply-firstname-input`, but it does not exist on the rejection screen.
- **Classification:** Requirement/application mismatch. The approved scenario asserts state on UI elements that the app does not display.
- **Recommended action:** Clarify the intended UX on duplicate rejection: should the app navigate back to the form with retained values, or should the review summary be treated as the source of truth for retained name/email? The password state is not surfaced at all.

---

## Files modified

- `src/steps/duplicate-email.steps.ts` — Cucumber timeout, boundary sentinel mapping.
- `src/pages/duplicate-email.page.ts` — JSDoc correction for the duplicate-message locator.
- `handoffs/A3-healer-complete.md` — this handoff (new file).

The approved feature file `tests/duplicate-email.feature` remains unchanged.

---

## What has NOT been resolved

1. **Exact duplicate-message wording** — Scenario 3 still fails. No automation adjustment was made because the approved Gherkin text differs from the live app text.
2. **Form-state assertion target** — Scenario 7 still fails. No automation adjustment was made because the app does not expose the asserted input fields after rejection.
3. **No ZincTM recording** — The remaining failures have not been filed as defects or linked to the A3 requirements (ZTM-24 … ZTM-28).
4. **No Playwright spec** for A3 exists; only the Cucumber feature + steps + page object are in place.
5. **`cucumber.duplicate-email.js`** temp isolation config is still in the repo root; decide whether to keep or remove.
6. **Static checks** (`npx tsc --noEmit`, ESLint on modified files) were not run in this session.
7. **Live test account cleanup** — one or more `e2e-a3-*` accounts were created during execution; no backend teardown was performed.

---

## Recommended next step

Review the two remaining failures (Scenario 3 and Scenario 7) as potential application defects or requirement clarifications. Do not make any further automation changes until the business/QA team decides:

- For Scenario 3: should the approved Gherkin message text be updated to match the live app, or should the development team be asked to change the app text?
- For Scenario 7: what is the intended UX/AC for the rejected duplicate application? Should the app return to the form with fields pre-filled, or should the test assert against the review summary instead?

Only after those decisions are documented should the automation be adjusted (if at all).
