import { test, expect } from '@playwright/test';
import { DuplicateEmailPage } from '../pages/duplicate-email.page';
import { LoginPage } from '../pages/login.page';

/**
 * ZincBank A3 - Duplicate email registration (Playwright layer).
 *
 * Mirrors tests/duplicate-email.feature. Scenarios 3 and 7 assert the
 * approved requirement behavior that the live app does not yet implement
 * (see reports/A3-scenario-3-clarification.md and
 * reports/A3-scenario-7-clarification.md) and are intentionally left
 * failing - they must not be weakened to match the current app.
 */
const APPROVED_DUPLICATE_MESSAGE =
  'An account with this email already exists. Please sign in instead.';

const generateUniqueEmail = (suffix: string): string =>
  `e2e-a3-${suffix}-${Date.now()}@example.com`;

test.describe('ZincBank A3 - Duplicate email registration', () => {
  let duplicatePage: DuplicateEmailPage;
  let loginPage: LoginPage;

  let registeredEmail: string;
  let registeredPassword: string;
  let registeredBalance: string;

  /** Re-enter the apply flow with the given email and submit, stopping at the decision. */
  async function submitDuplicateApplication(email: string, lastName = 'Duplicate'): Promise<void> {
    await duplicatePage.applyPage.goto();
    await duplicatePage.applyPage.continueFromAccountsStep();
    await duplicatePage.applyPage.fillAboutYou('E2E', lastName, email);
    await duplicatePage.applyPage.fillIdentity('123-45-6789', 'Employed');
    await duplicatePage.applyPage.fillAddress('123 Test Ave', 'Springfield', 'CA', '90210');
    await duplicatePage.applyPage.fillSecurity('Abcdef12!');
    await duplicatePage.applyPage.reviewAndSubmit();
  }

  test.beforeEach(async ({ page }) => {
    duplicatePage = new DuplicateEmailPage(page);
    loginPage = new LoginPage(page);

    // Background equivalent: an account is already registered with a unique email.
    registeredEmail = generateUniqueEmail('registered');
    registeredPassword = 'Abcdef12!';

    await duplicatePage.applyPage.applyForCheckingAccount({
      firstName: 'E2E',
      lastName: 'Register',
      email: registeredEmail,
      ssn: '123-45-6789',
      employment: 'Employed',
      street: '123 Test Ave',
      city: 'Springfield',
      state: 'CA',
      zip: '90210',
      password: registeredPassword,
    });

    registeredBalance = (await duplicatePage.dashboardTotalBalance.textContent()) ?? '$0.00';
  });

  test('A brand-new email registers successfully', async ({ page }) => {
    const email = generateUniqueEmail('different');

    await duplicatePage.applyPage.applyForCheckingAccount({
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

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();
  });

  test('Registering again with the same email is rejected', async () => {
    await submitDuplicateApplication(registeredEmail);

    await expect(duplicatePage.duplicateEmailMessage).toBeVisible();
  });

  test('The duplicate-email message is shown exactly', async () => {
    await submitDuplicateApplication(registeredEmail);

    await expect(duplicatePage.duplicateEmailMessage).toHaveText(APPROVED_DUPLICATE_MESSAGE);
  });

  test('Duplicate detection ignores case (Test@X.com)', async () => {
    await submitDuplicateApplication(registeredEmail.toUpperCase(), 'Boundary');

    await expect(duplicatePage.duplicateEmailMessage).toBeVisible();
  });

  test('Duplicate detection ignores surrounding whitespace ( E2E-Case@example.com )', async () => {
    await submitDuplicateApplication(`  ${registeredEmail}  `, 'Boundary');

    await expect(duplicatePage.duplicateEmailMessage).toBeVisible();
  });

  test('Rejecting a duplicate does not change the existing account', async ({ page }) => {
    await submitDuplicateApplication(registeredEmail);

    await loginPage.goto();
    await loginPage.login(registeredEmail, registeredPassword);
    await expect(page).toHaveURL(/\/dashboard/);

    const currentBalance = await duplicatePage.dashboardTotalBalance.textContent();
    expect(currentBalance?.trim()).toBe(registeredBalance);
  });

  test('Rejected form keeps the name and email and clears the password', async () => {
    await submitDuplicateApplication(registeredEmail);

    expect(await duplicatePage.getFirstNameValue()).toBe('E2E');
    expect(await duplicatePage.getLastNameValue()).toBe('Duplicate');
    expect(await duplicatePage.getEmailValue()).toBe(registeredEmail);
    expect(await duplicatePage.getPasswordValue()).toBe('');
  });
});
