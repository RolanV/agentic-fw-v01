# Handoff — A3: Automation-ready (Page Object + Step Definitions)

> This handoff records completion of the **Page Object Builder** and **Step Definition Generator** stages for A3. The next session should review, execute, and debug the A3 automation.

## Requirement

- **Ref:** A3
- **Requirement ID:** `60ad7a57-0b6e-4757-98ba-0abcd8dfa01c`
- **Module:** Getting Started (A)
- **Title:** Someone signs up twice with the same email

## What was created

### Feature file (approved, read-only for this session)

- **Path:** `tests/duplicate-email.feature`
- Created during the previous Feature Writer stage; treated as the source of truth.
- Includes one Background, five Scenarios, and one Scenario Outline with two examples.

### Page Object

- **Path:** `src/pages/duplicate-email.page.ts`
- **Class:** `DuplicateEmailPage`
- Wraps the existing `OpenAccountPage` to re-use the proven 6-step apply-flow locators.
- Exposes A3-specific helpers:
  - `getDuplicateEmailMessageText()`
  - `isDuplicateEmailMessageVisible()`
  - `getFirstNameValue()`
  - `getLastNameValue()`
  - `getEmailValue()`
  - `getPasswordValue()`
  - `dashboardTotalBalance` (passthrough)
- Remains **assertion-free**, satisfying the session constraint.

### Step definitions

- **Path:** `src/steps/duplicate-email.steps.ts`
- Registers Cucumber `Before`/`After` hooks following the A1/A2 pattern.
- Implements every Gherkin step from `tests/duplicate-email.feature`.
- Generates unique `e2e-a3-...` emails per scenario and stores state for reuse.
- Delegates form interactions to `DuplicateEmailPage.applyPage` and assertion logic stays inside step definitions (consistent with existing A1/A2 framework style).

## Agents used

| Agent                         | Role                                                                      |
| ----------------------------- | ------------------------------------------------------------------------- |
| **Page Object Builder**       | Built the `DuplicateEmailPage` class.                                     |
| **Step Definition Generator** | Mapped approved Gherkin steps to TypeScript step definitions.             |
| **POM Reviewer** (implicit)   | Verified assertion-free POM, `data-testid` usage, and naming conventions. |

## Skills used

| Skill                 | Applied area                                             |
| --------------------- | -------------------------------------------------------- |
| **Page Object Model** | Class naming, locator priority, delegation design.       |
| **Cucumber**          | Step registration, hook lifecycle, thin-step convention. |
| **Gherkin**           | Step-to-method mapping and parameter extraction.         |
| **Assertions**        | Web-first `expect` patterns in step definitions.         |

## Important implementation decisions

1. **POM wraps `OpenAccountPage`, not duplicates it.**
   - The 6-step apply flow already exists in `OpenAccountPage`; `DuplicateEmailPage` composes it.
2. **No assertions inside the Page Object.**
   - All `expect()` calls live in `src/steps/duplicate-email.steps.ts`, matching A1/A2 style.
3. **Unique email generation is centralized in the step file.**
   - Uses `e2e-a3-<suffix>-<timestamp>@example.com`.
   - Background email is stored so subsequent steps can reference the "already registered" account.
4. **Duplicate-message locator uses approved feature text as a fallback.**
   - No A3-specific `data-testid` exists yet; therefore the locator uses `page.getByText('An account with this email already exists. Please sign in instead.')`.
5. **Scenario Outline variants are passed literally.**
   - The current examples (`Test@X.com`, `E2E-Case@example.com`) are not yet templated against the registered email. Live verification will be needed to confirm whether they should be normalized/correlated.

## Files created/modified

- **Created:** `src/pages/duplicate-email.page.ts`
- **Created:** `src/steps/duplicate-email.steps.ts`
- **Referenced (not modified):** `tests/duplicate-email.feature`

## Assumptions

- The existing A1 apply-flow testids (`apply-firstname-input`, `apply-email-input`, `apply-password-input`, `apply-next`, `apply-submit`, etc.) are still current.
- The duplicate-detection rejection message matches the approved feature text exactly.
- Case-insensitivity and leading/trailing whitespace normalization behave as described in the refined A3 requirements.
- An account created via the Background can be logged into again with the same credentials to verify it was not overwritten.

## Unresolved locators or open questions

1. **Duplicate-message locator**
   - Currently text-based. If the live app uses a different `data-testid`, the locator should migrate to `page.getByTestId('...')`.
2. **Scenario Outline examples**
   - The supplied variants (`Test@X.com`, `E2E-Case@example.com`) may not collide with the generated Background email. Verify whether they should be derived from `registeredEmail`.
3. **Account balance check**
   - `dashboardTotalBalance` assumes a newly registered account starts at `$0.00`. Confirm this holds after the duplicate attempt.
4. **Teardown/cleanup**
   - The step file closes the browser context after each scenario but does not delete registered accounts from the live app backend. If backend cleanup is required, it should be added later.

## What has NOT been done yet

- **No Playwright spec created** for A3.
- **No tests run** — neither Cucumber nor Playwright suites have executed.
- **No live-app verification** of duplicate-message text, case-insensitive detection, or whitespace normalization.
- **No debugging** of potential locator or timing issues.
- **No ZincTM linking or run recording** for ZTM-24 … ZTM-28.

## Recommended next step

Review the implementation, run the A3 tests, debug failures if any, and report results.
