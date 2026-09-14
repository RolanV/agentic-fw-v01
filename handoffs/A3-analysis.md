# Handoff — A3: Someone signs up twice with the same email

> Filename note: originally requested as `A2-analysis.md`; confirmed with the user that the analysis just completed was **A3**, so this is saved as `A3-analysis.md`.

## Requirement

- **Ref:** A3
- **Requirement ID:** `60ad7a57-0b6e-4757-98ba-0abcd8dfa01c`
- **Module:** Getting Started (A)
- **Title:** Someone signs up twice with the same email

## Requirement summary

A person cannot register a second ZincBank account using an email address that already belongs to an existing customer. The system must reject the duplicate sign-up and explain the problem so the user knows to sign in instead. (Refined from the vague brief: _"If a person tries to join using an email address that already belongs to somebody, we can't let them. We should explain the problem so they know to sign in instead."_)

## Acceptance criteria (refined atomic requirements, already written back to ZincTM)

- **A3.1** Duplicate-email detection SHALL be case-insensitive and ignore leading/trailing whitespace.
- **A3.2** On duplicate email the system SHALL reject submission and display the message `"An account with this email already exists. Please sign in instead."`
- **A3.3** On duplicate email the system SHALL NOT create a new account and SHALL NOT change any existing balance.
- **A3.4** On duplicate email the form SHALL retain the entered name and email; only the password field is cleared.

Detailed Given/When/Then criteria (AC-A3.1 … AC-A3.5) are captured in the module-A analysis report (`reports/requirement-analysis-module-A.html`, A3 section).

## Positive scenarios

- Registering a brand-new, unused email succeeds and signs the customer in (baseline happy path — shared with A1).
- After the rejected duplicate attempt, the original account still works and can sign in normally.

## Negative scenarios

- Attempting to register with an email that already has an account → submission rejected.
- The rejection message is asserted byte-for-byte: `"An account with this email already exists. Please sign in instead."`
- Duplicate detection fires when the email differs only by case (e.g. `Test@X.com` vs `test@x.com`).
- Duplicate detection fires when the email has surrounding whitespace (e.g. `E2E-Case@example.com`).

## Edge cases

- Case-insensitivity + leading/trailing whitespace combined in one variant (`' E2E-Case@example.com '`).
- Boundary between a valid new email and a duplicate — confirm a genuinely different email is still accepted after a rejected attempt (no false-positive blocking).
- Duplicate rejection with no side effects: no new account created, original account balance unchanged (regression guard).
- Form data retention: name and email keep their typed values after rejection; only the password field is cleared.

## Risks

- **Enumeration surface (contradiction):** confirming an email exists at sign-up is standard UX but a mild account-enumeration vector. No anti-enumeration decision was stated by the business — flagged as `req:contradictory`, Medium.
- **Message exactness:** the rejection text is a proposed default (`PROPOSED — business to confirm`); if the live app ships different wording, the byte-for-byte assertion (ZTM-25) will fail and the requirement must be reconciled with the implementation.
- **Case/whitespace normalization** may not match the live backend's stored canonical form — verify against the real app rather than assuming.

## Assumptions

- Duplicate detection is case-insensitive and ignores leading/trailing whitespace (A3.1) — a concrete default the brief did not specify.
- The rejection message is exactly `"An account with this email already exists. Please sign in instead."` (A3.2) — proposed, business to confirm.
- Rejected attempts leave no partial account/balance state (A3.3).
- Form retention behavior: name + email kept, password cleared (A3.4).

## Decisions made

- Readiness score: **4 / 10**.
- Refined the vague brief into 4 atomic, measurable SHALL requirements (A3.1–A3.4) and recorded them in ZincTM via `tm_update_requirement`.
- Produced 5 test cases, all recorded in ZincTM with status `ready` (see below).
- Filed no defects — the analysis was recorded as requirement rewrites + test-case backlog, not defect reports.

## What has NOT been done yet

- **No automation exists for A3.** 0 of 5 A3 test cases have a linked script; A3 has no `.feature` file, no step definitions, and no POM in the repo (only A1 and A2 are automated).
- The 5 recorded cases have not been executed in a test run (no run opened, no results recorded).
- No live-app verification of the refined bounds (case/whitespace normalization and the exact error message) has been done — per the analysis skill, this must be checked against the running ZincBank app before asserting the stricter rules.

## ZincTM test-case backlog (all ready, none automated)

| Key    | Title                                                                    | Type       | Priority |
| ------ | ------------------------------------------------------------------------ | ---------- | -------- |
| ZTM-24 | Duplicate email registration rejected                                    | negative   | P1       |
| ZTM-25 | Duplicate rejection message asserted exactly                             | functional | P2       |
| ZTM-26 | Duplicate detection case- & whitespace-insensitive                       | boundary   | P2       |
| ZTM-27 | Duplicate rejection has no side effects (no new acct, balance unchanged) | regression | P1       |
| ZTM-28 | Form data retained after rejection (name/email kept, password cleared)   | functional | P3       |

## Recommended next step

Automate A3 following the established repo pattern (mirror A1/A2): a `tests/duplicate-email.feature` (Gherkin) + `src/steps/duplicate-email.steps.ts` + a POM, driven by `data-testid` locators against the live app `https://zincbank.cydeo.io`. First verify the live app's duplicate-detection normalization and exact error message against the refined bounds, then run both the Cucumber and Playwright suites until green, and finally link the passing specs to ZTM-24…ZTM-28 (marking them automated) and record a run.
