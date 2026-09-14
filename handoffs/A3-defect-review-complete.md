# Handoff — A3 Defect Review Complete

> Created: 2026-09-07
> Scope: Document findings from A3 duplicate-email test analysis. Do not modify automation.
> Final state: Two requirement/application mismatches identified; next step is to prepare clarification records.

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

## Remaining failures (requirement/application mismatches)

### Scenario 3 — The duplicate-email message is shown exactly

- **Expected (approved Gherkin/AC):** "An account with this email already exists. Please sign in instead."
- **Actual live app text:** "An account with that email already exists"
- **Evidence:** Test failure shows exact text mismatch:
  ```
  Expected: "An account with this email already exists. Please sign in instead."
  Received: "An account with that email already exists"
  ```
- **Classification:** Unresolved requirement/application mismatch. The approved wording differs from the live application copy.
- **Next step:** Prepare clarification record to determine whether to update the requirement to match the app, or request the app be updated to match the approved wording.

### Scenario 7 — Rejected form keeps the name and email and clears the password

- **Expected (approved scenario):** The original step-1 form inputs (first name, last name, email) still contain the entered values, and the password field is empty.
- **Actual live app behavior:** After rejection, the app navigates to a review/confirmation screen where the form fields are unmounted from the DOM. Name/email are surfaced only via `dl[data-testid="apply-review-summary"]`, and there is no Password row in the summary.
- **Evidence:** Test failure shows timeout when looking for form elements:
  ```
  locator.inputValue: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByTestId('apply-firstname-input')
  ```
- **Classification:** Unresolved requirement/application mismatch. The approved scenario asserts state on UI elements that the app does not display.
- **Next step:** Prepare clarification record to determine the intended UX on duplicate rejection: should the app navigate back to the form with retained values, or should the review summary be treated as the source of truth for retained name/email?

---

## What has NOT been resolved

1. **Exact duplicate-message wording** — Scenario 3 still fails due to text mismatch between approved Gherkin and live app.
2. **Form-state assertion target** — Scenario 7 still fails because the app does not expose the asserted input fields after rejection.
3. **No defect/clarification records** — The two remaining failures have not been formally documented as requirements clarifications.

---

## Recommended next step

Prepare defect/clarification records for both Scenario 3 and Scenario 7 to be reviewed by product management, business analysis, and UX. The records should document:

- The discrepancy between approved requirements and actual implementation
- The evidence from test execution
- The impact on user experience
- Recommended resolution options

Do not make any automation changes until the business/QA team decides on the correct behavior for both scenarios.
