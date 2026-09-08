# A3 — Clarification: Form-state after duplicate rejection (Scenario 7)

> **Type:** Unresolved — requirement clarification (possible application-defect component)
> **Status:** Draft — not filed to ZincTM. No automation or feature-file changes.
> **Date:** 2026-09-07

## Title

After a duplicate-email rejection, the app does not retain the form inputs for assertion — requirement's expected UX is ambiguous/unimplemented

## Requirement

A3 — "Duplicate email registration" (`tests/duplicate-email.feature`, Scenario: "Rejected form keeps the name and email and clears the password"). Approved AC asserts that after rejection the step-1 fields still show the entered name/email and the password field is empty.

## Expected behavior

After a duplicate rejection, the previously entered first name, last name and email remain visible in their form fields, and the password field is empty.

## Actual behavior

The app keeps the user on the **Review & confirm** step, where the earlier-step inputs (`apply-firstname-input`, `apply-lastname-input`, `apply-email-input`, `apply-password-input`, `apply-confirm-input`) are **unmounted from the DOM**. Name/email are surfaced only via `dl[data-testid="apply-review-summary"]`; there is **no Password row** in the summary. The automation's `inputValue()` on the unmounted inputs times out.

## Steps to reproduce

1. Complete the 6-step apply flow to register an account, then start a second apply with the same email.
2. Fill Step 1 (first/last name, email) and set a password in Step 5, then submit on Step 6.
3. On the duplicate rejection, attempt to read the name/email/password input values from the form.

## Evidence

- Live-app verification (2026-09-07): after rejection the page stays on Review & confirm; Step-1 inputs and password inputs are not in the DOM; summary shows rows Accounts, Name, Email, SSN, Employment, Address — no Password.
- Test failure (verbatim):
  ```
  locator.inputValue: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByTestId('apply-firstname-input')
  ```
- Source: `src/steps/duplicate-email.steps.ts` — `Then('the name and email fields still show the entered values')` and `Then('the password field is empty')` call `inputValue()` on `applyPage.firstNameInput` / `lastNameInput` / `emailInput` / `passwordInput`.

## Severity recommendation

**S3 / P2 (medium)** — affects validation of the intended post-rejection UX and the security expectation that the password is not retained, but the core duplicate-rejection flow works. Needs a product decision.

## Classification

**Unresolved — requirement clarification** (with possible application-defect component). The requirement assumes a UX (return to a retained form with cleared password) that the app does not implement (it navigates to a review summary). Two readings:

- If the intended UX _is_ the review summary, the requirement's wording is wrong and the test target must change to the summary (and the "password cleared" assertion has no visible target) → **requirement clarification**.
- If the intended UX _is_ a returned form with retained values, then the app's behavior is a **likely application defect** (fields not re-populated / password not cleared).

## Resolution options

- (a) Declare the Review & confirm summary the source of truth for retained name/email; clarify how password clearing should be verified (or drop that assertion); or
- (b) Require the app to return to a pre-filled form with an empty password field.
