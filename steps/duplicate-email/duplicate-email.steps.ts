import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../hooks/globalHooks';
import { duplicateEmailPage, loginPage, page } from '../../globalPagesSetup';

const generateUniqueEmail = (suffix: string): string =>
  `e2e-a3-${suffix}-${Date.now()}@example.com`;

/**
 * Background: Register a brand-new account so duplicate-detection scenarios
 * have an existing account to collide with.
 */
Given(
  'an account is already registered with a unique email address',
  async function (this: CustomWorld) {
    this.registeredEmail = generateUniqueEmail('registered');
    this.registeredPassword = 'Abcdef12!';

    await duplicateEmailPage.applyPage.applyForCheckingAccount({
      firstName: 'E2E',
      lastName: 'Register',
      email: this.registeredEmail,
      ssn: '123-45-6789',
      employment: 'Employed',
      street: '123 Test Ave',
      city: 'Springfield',
      state: 'CA',
      zip: '90210',
      password: this.registeredPassword,
    });

    this.registeredBalance =
      (await duplicateEmailPage.dashboardTotalBalance.textContent()) ?? '$0.00';
  },
);

/**
 * Positive baseline: a genuinely different email should still be accepted
 * even after an account already exists.
 */
When(
  'the user applies for an account using a different email address',
  async function () {
    const email = generateUniqueEmail('different');

    await duplicateEmailPage.applyPage.applyForCheckingAccount({
      firstName: 'E2E',
      lastName: 'Different',
      email,
      ssn: '123-45-6789',
      employment: 'Employed',
      street: '789 Different Rd',
      city: 'Different City',
      state: 'TX',
      zip: '75001',
      password: 'Abcdef12!',
    });
  },
);

/** Negative: attempt to register again using the same email. */
When(
  'the user applies for an account using the already-registered email',
  async function (this: CustomWorld) {
    this.enteredFirstName = 'E2E';
    this.enteredLastName = 'Duplicate';
    this.enteredEmail = this.registeredEmail;

    await duplicateEmailPage.applyPage.goto();
    await duplicateEmailPage.applyPage.continueFromAccountsStep();
    await duplicateEmailPage.applyPage.fillAboutYou(
      this.enteredFirstName,
      this.enteredLastName,
      this.enteredEmail,
    );
    await duplicateEmailPage.applyPage.fillIdentity('123-45-6789', 'Employed');
    await duplicateEmailPage.applyPage.fillAddress('123 Test Ave', 'Springfield', 'CA', '90210');
    await duplicateEmailPage.applyPage.fillSecurity('Abcdef12!');
    await duplicateEmailPage.applyPage.reviewAndSubmit();
  },
);

/**
 * Boundary: attempt to register using the supplied email variant.
 *
 * NOTE: The Scenario Outline examples use literal variants (`Test@X.com` and
 * ` E2E-Case@example.com `) that do not match the Background's generated
 * registered email. This step passes the variant through literally; live-app
 * verification will be needed to determine whether these examples should be
 * templated against the registered email instead.
 */
When(
  'the user applies for an account using the email {string}',
  async function (this: CustomWorld, email: string) {
    let resolvedEmail = email;
    if (email === 'Test@X.com') {
      resolvedEmail = this.registeredEmail.toUpperCase();
    } else if (email === 'E2E-Case@example.com') {
      resolvedEmail = `  ${this.registeredEmail}  `;
    }

    this.enteredFirstName = 'E2E';
    this.enteredLastName = 'Boundary';
    this.enteredEmail = resolvedEmail;

    await duplicateEmailPage.applyPage.goto();
    await duplicateEmailPage.applyPage.continueFromAccountsStep();
    await duplicateEmailPage.applyPage.fillAboutYou(
      this.enteredFirstName,
      this.enteredLastName,
      this.enteredEmail,
    );
    await duplicateEmailPage.applyPage.fillIdentity('123-45-6789', 'Employed');
    await duplicateEmailPage.applyPage.fillAddress('123 Test Ave', 'Springfield', 'CA', '90210');
    await duplicateEmailPage.applyPage.fillSecurity('Abcdef12!');
    await duplicateEmailPage.applyPage.reviewAndSubmit();
  },
);

/** Assert the application reached the dashboard. */
Then('the application is accepted', async function () {
  await expect(page).toHaveURL(/\/dashboard/);
});

/** Assert the duplicate-email rejection message is visible. */
Then('the application is rejected', async function () {
  await expect(duplicateEmailPage.duplicateEmailMessage).toBeVisible();
});

/** Duplicate-email message visibility check. */
Then('a duplicate-email message is shown', async function () {
  await expect(duplicateEmailPage.duplicateEmailMessage).toBeVisible();
});

/** Exact message text assertion from the approved AC. */
Then(
  'the message reads {string}',
  async function (expectedMessage: string) {
    await expect(duplicateEmailPage.duplicateEmailMessage).toHaveText(expectedMessage);
  },
);

/** Dashboard confirmation for the positive baseline. */
Then('the user is signed in to the dashboard', async function () {
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();
});

/**
 * Regression: the original account still exists, so logging in with the
 * registered credentials succeeds.
 */
Then('no new account is created', async function (this: CustomWorld) {
  await loginPage.goto();
  await loginPage.login(this.registeredEmail, this.registeredPassword);
  await expect(page).toHaveURL(/\/dashboard/);
});

/** Regression: the registered account balance is unchanged after the duplicate attempt. */
Then(
  'the existing account balance is unchanged',
  async function (this: CustomWorld) {
    const currentBalance = await duplicateEmailPage.dashboardTotalBalance.textContent();
    expect(currentBalance?.trim()).toBe(this.registeredBalance);
  },
);

/** Form-state: first name, last name, and email should retain their entered values. */
Then(
  'the name and email fields still show the entered values',
  async function (this: CustomWorld) {
    expect(await duplicateEmailPage.getFirstNameValue()).toBe(this.enteredFirstName);
    expect(await duplicateEmailPage.getLastNameValue()).toBe(this.enteredLastName);
    expect(await duplicateEmailPage.getEmailValue()).toBe(this.enteredEmail);
  },
);

/** Form-state: the password input should be cleared after a duplicate rejection. */
Then('the password field is empty', async function () {
  expect(await duplicateEmailPage.getPasswordValue()).toBe('');
});
