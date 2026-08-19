# Registration Form Test Suite

## Overview

This test suite provides comprehensive coverage for the **Registration Form** located at  
`https://the-internet-5chk.onrender.com/registration_form`.  
It follows the **Page Object Model (POM)** pattern with Playwright and Cucumber BDD framework.

## Test Credentials & Data

| Field               | Example Value             |
| ------------------- | ------------------------- |
| First Name          | John                      |
| Last Name           | Smith                     |
| Username            | johnsmith123              |
| Email               | john.smith@example.com    |
| Password            | SecurePass123!            |
| Phone               | 202-555-0123              |
| Gender              | Male                      |
| Date of Birth       | 01/15/1990                |
| Department / Office | Department of Engineering |
| Job Title           | Developer                 |
| Programming Lang.   | Java, JavaScript          |

## File Structure

```
tests/
├── registration-form.feature          # Gherkin feature file with scenarios
└── REGISTRATION_TEST_SUITE.md        # This documentation file

src/
├── pages/
│   └── registration.page.ts          # Page Object Model for registration page
├── steps/
│   └── registration.steps.ts         # Step definitions for registration scenarios
├── fixtures/
│   └── registration-test-data.ts     # Test data and fixtures
└── tests/
    └── registration.spec.ts          # Playwright test runner entry (optional)
```

## Scenarios Overview

### Positive Test Cases (Happy Path)

1. **User successfully registers with valid data** `@positive @critical`
   - Fills the entire form with valid data and submits.
   - Verifies the registration confirmation page displays “Well done!”.

### Negative Test Cases (Validation)

2. **Missing required fields** `@negative @critical`
   - Leaves one or more required inputs empty and attempts to submit.
   - Expects appropriate validation error messages.

3. **Invalid email format** `@negative`
   - Enters an email without “@” or domain and submits.
   - Expects an email format validation error.

4. **Password strength requirements** `@negative`
   - Enters a password that does not meet the minimum criteria (e.g., no special character).
   - Expects a password strength validation error.

5. **Duplicate username** `@negative`
   - Uses an already‑registered username and submits.
   - Expects a “username already taken” error.

### UI/UX Test Cases

6. **All fields are visible** `@ui`
   - Checks that each form element is rendered and accessible.

7. **Accessibility labels** `@accessibility`
   - Verifies that inputs have appropriate `aria-label` or visible labels.

### Performance Test Cases

8. **Registration page loads within acceptable time** `@performance`
   - Measures page load time and asserts it is ≤ 3 seconds.

## Running the Tests

```bash
# Run all registration scenarios
npm run test:cucumber tests/registration-form.feature

# Run only critical scenarios
npm run test:cucumber -- --tags "@critical"

# Generate HTML report
npm run test:cucumber -- --format html:reports/registration.html
```

## Test Coverage Summary

| Category      | Scenarios |
| ------------- | --------- |
| Positive      | 1         |
| Negative      | 4         |
| UI/UX         | 2         |
| Accessibility | 1         |
| Performance   | 1         |
| **Total**     | **9**     |

## Best Practices Applied

- **Page Object Model** – All UI interactions are encapsulated in `RegistrationPage`.
- **No Assertions in POM** – Methods return state; assertions live in step definitions.
- **Accessibility‑First Selectors** – `getByRole`, `getByLabel`, `getByTestId` prioritized.
- **Thin Step Definitions** – Steps delegate to page object methods.
- **BDD Format** – Business‑focused Gherkin scenarios, no UI implementation details.
- **Test Data Separation** – Fixtures keep data out of step definitions.
- **Auto‑waiting** – Rely on Playwright's built‑in waiting, no `waitForTimeout`.
- **Security** – No secrets hard‑coded; passwords are test data only.
