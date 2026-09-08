# A3 — Clarification: Duplicate-email message wording mismatch (Scenario 3)

> **Type:** Requirement clarification (`req:ambiguous` / `req:silent`)
> **Status:** Draft — not filed to ZincTM. No automation or feature-file changes.
> **Date:** 2026-09-07

## Title

Duplicate-email rejection message text does not match approved requirement wording

## Requirement

A3 — "Duplicate email registration" (`tests/duplicate-email.feature`, Scenario: "The duplicate-email message is shown exactly"). Approved AC wording:

> "An account with this email already exists. Please sign in instead."

## Expected behavior

When a user applies with an email that is already registered, the app shows the exact message:
**"An account with this email already exists. Please sign in instead."**

## Actual behavior

The live app shows **"An account with that email already exists"** — different article ("that" vs "this") and omits the guiding sentence "Please sign in instead."

## Steps to reproduce

1. Open `https://zincbank.cydeo.io` and complete the 6-step apply flow to register a new account (e.g. `e2e-a3-…@example.com`).
2. Start a second apply using the same email and complete all steps to Step 6 (Review & confirm).
3. Submit. Observe the inline note at `data-testid="apply-error"`.

## Evidence

- Live-app verification (2026-09-07): `data-testid="apply-error"` reads `"An account with that email already exists"`.
- Test failure (verbatim):
  ```
  Expected: "An account with this email already exists. Please sign in instead."
  Received: "An account with that email already exists"
  ```
- `tests/duplicate-email.feature` line: `And the message reads "An account with this email already exists. Please sign in instead."`

## Severity recommendation

**S4 / P3 (low)** — cosmetic copy discrepancy only; the rejection and sign-in guidance both function. Not data- or security-affecting.

## Classification

**Requirement clarification** (wording mismatch, `req:ambiguous` / `req:silent`). The approved requirement wording and the live application copy disagree, and there is no product statement about which is the source of truth. Not a functional defect on its own.

## Resolution options

- (a) Accept the app copy and update the requirement/AC wording to match; or
- (b) Require the app be updated to the approved wording, including the "Please sign in instead." guidance.
