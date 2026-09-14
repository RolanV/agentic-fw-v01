# Handoff — A3: Feature Writer stage complete

> This handoff records what was completed in the **Feature Writer** stage of A3 automation. The next session should continue with the **Page Object Builder** and **Step Definition Generator** stages.

## Requirement

- **Ref:** A3
- **Requirement ID:** `60ad7a57-0b6e-4757-98ba-0abcd8dfa01c`
- **Module:** Getting Started (A)
- **Title:** Someone signs up twice with the same email

## What was analyzed

- Source of truth: `handoffs/A3-analysis.md` (previous session's requirement analysis) and the A3 section of `reports/requirement-analysis-module-A.html`.
- The refined atomic requirements (already written back to ZincTM):
  - **A3.1** Duplicate-email detection SHALL be case-insensitive and ignore leading/trailing whitespace.
  - **A3.2** On duplicate email the system SHALL reject submission and display `"An account with this email already exists. Please sign in instead."`
  - **A3.3** On duplicate email the system SHALL NOT create a new account and SHALL NOT change any existing balance.
  - **A3.4** On duplicate email the form SHALL retain the entered name and email; only the password field is cleared.
- Acceptance criteria AC-A3.1 … AC-A3.5 and test cases TC-A3.1 … TC-A3.5 (= ZTM-24 … ZTM-28) were mapped to the scenarios.
- Repo conventions reviewed: existing `tests/open-account.feature` (A1) and `tests/zinc-bank-login.feature` (A2), `.clinerules/cucumber.md`, `.clinerules/locator-rules.md`, `.clinerules/naming-conventions.md`, and the Feature-Writer-stage agents (Feature Generator, Scenario Writer, Outline Writer, Tag Generator).

## Feature file created

- **Path:** `tests/duplicate-email.feature`

## Scenarios included in the feature

| Scenario                                                                      | Covers                                                                                              | Type                    | Tags |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------- | ---- |
| A brand-new email registers successfully                                      | positive baseline; boundary — a genuinely different email is still accepted after an account exists | `@positive @critical`   |      |
| Registering again with the same email is rejected                             | ZTM-24 / TC-A3.1, AC-A3.1                                                                           | `@negative @critical`   |      |
| The duplicate-email message is shown exactly                                  | ZTM-25 / TC-A3.2, AC-A3.2 (byte-for-byte)                                                           | `@functional @critical` |      |
| Scenario Outline: Duplicate detection ignores case and surrounding whitespace | ZTM-26 / TC-A3.3, AC-A3.3                                                                           | `@boundary`             |      |
| Rejecting a duplicate does not change the existing account                    | ZTM-27 / TC-A3.4, AC-A3.4 (no new account, balance unchanged)                                       | `@regression @critical` |      |
| Rejected form keeps the name and email and clears the password                | ZTM-28 / TC-A3.5, AC-A3.5                                                                           | `@functional`           |      |

Feature-level tags: `@ui @smoke @regression`.

### Scenario Outline Examples

```
| variant                |
| Test@X.com             |   # differs from baseline only by case
|  E2E-Case@example.com  |   # leading/trailing whitespace around the same address
```

## Important Gherkin decisions

- **Background used** — appropriate: every scenario needs a pre-registered account. `Background: Given an account is already registered with a unique email address`. The "unique email" is generated in the step definition (mirrors A1's `the user fills in a unique email address`), not hard-coded in the feature.
- **Scenario Outline + Examples used** — appropriate: the boundary case repeats identical steps with only the email variant changing.
- **Business-readable only** — no testids, selectors, or URLs appear in the feature; the live `apply-*` testids belong in the POM (later stage).
- **Positive baseline included** as a false-positive guard — proves a genuinely different email is still accepted even though an account already exists.
- Scenario titles Title Case; each scenario keeps a Given/When/Then shape; tags lowercase per `.clinerules/cucumber.md`.

## Assumptions

- The next stage (Page Object + steps) will re-use the live ZincBank apply flow testids already established in A1 (`apply-firstname-input`, `apply-email-input`, `apply-password-input`, `apply-next`, `apply-submit`, etc.).
- Duplicate detection is case-insensitive and ignores leading/trailing whitespace (A3.1) — this still needs live-app confirmation.
- The rejection message is exactly `"An account with this email already exists. Please sign in instead."` (A3.2) — proposed default, business to confirm; byte-for-byte assertion may need reconciling with the real app.
- Unique `e2e-<unique>@example.com` emails are generated by the steps, and an afterAll/teardown removes what a test creates.

## Risks / open questions

- **Message exactness (highest risk):** if the live app ships different wording, the exact-message scenario (and ZTM-25) will fail; the requirement must be reconciled with the implementation.
- **Case/whitespace normalization:** A3.1's bounds may not match the live backend's stored canonical form — must verify against the real app (Phase A from the earlier plan) before asserting the stricter rules.
- **Account-enumeration surface:** confirming an email exists at sign-up is standard UX but a mild enumeration vector; flagged `req:contradictory` (Medium). No anti-enumeration decision was stated by the business.
- **ZincTM linking blocked in past sessions:** MCP `tm_*` calls were safety-blocked in this environment; linking specs to ZTM-24…ZTM-28 and recording a run may require the user to approve MCP actions or change approval mode.

## Files created or modified

- **Created:** `tests/duplicate-email.feature`

## What has NOT been done yet

- **No Page Object** — none created for A3.
- **No step definitions** — none created for A3; the feature's steps are undefined and will fail `cucumber-js` until they exist.
- **No Playwright spec** — none created for A3.
- **No tests run** — neither the Cucumber nor Playwright suite has been executed.
- **No live-app verification** of duplicate-detection normalization or the exact error message.
- **No ZincTM updates** — ZTM-24…ZTM-28 remain `ready`, unautomated, and not linked to any script; no run recorded.

## Recommended next step

Create the **Page Object** (`src/pages/duplicate-email.page.ts`) and **step definitions** (`src/steps/duplicate-email.steps.ts`) based on the approved A3 feature file, following the established A1/A2 repo pattern (POM with `data-testid` locators, thin steps that delegate to the POM). Before asserting the stricter bounds, verify the live app's duplicate-detection normalization and exact error message against the refined requirements (A3.1–A3.2). Then run both the Cucumber and Playwright suites until green, and finally link the passing specs to ZTM-24…ZTM-28 (marking them automated) and record a run in ZincTM.
