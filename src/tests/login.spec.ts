import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { VALID_STUDENT_CREDENTIALS } from '../fixtures/login-test-data';

test.describe('ZincBank A2 - Signing in', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('signs in with valid credentials and redirects to the dashboard', async ({ page }) => {
    await loginPage.login(VALID_STUDENT_CREDENTIALS.email, VALID_STUDENT_CREDENTIALS.password);
    // A2.3 / A2.1 - success lands on the dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('shows a generic validation note when both fields are empty', async () => {
    await loginPage.clickSignIn();
    // A2.2 - single inline validation note
    await expect(loginPage.loginErrorNote).toBeVisible();
    await expect(loginPage.loginErrorNote).toContainText('Enter your email and password');
  });

  test('shows a generic validation note when only the email is empty', async () => {
    await loginPage.fillPassword(VALID_STUDENT_CREDENTIALS.password);
    await loginPage.clickSignIn();
    await expect(loginPage.loginErrorNote).toBeVisible();
    await expect(loginPage.loginErrorNote).toContainText('Enter your email and password');
  });

  test('rejects a wrong password with a generic error', async () => {
    await loginPage.login(VALID_STUDENT_CREDENTIALS.email, 'wrongpassword123');
    // A2.2 - generic error, no enumeration of which field is wrong
    await expect(loginPage.loginErrorNote).toBeVisible();
    await expect(loginPage.loginErrorNote).toContainText('Invalid email or password');
  });

  test('rejects an unknown email with the same generic error (no enumeration)', async () => {
    await loginPage.login('nonexistent@zinc.test', VALID_STUDENT_CREDENTIALS.password);
    await expect(loginPage.loginErrorNote).toBeVisible();
    await expect(loginPage.loginErrorNote).toContainText('Invalid email or password');
  });

  test('treats email as case-insensitive on sign-in', async ({ page }) => {
    await loginPage.login('Student01@Zinc.test', VALID_STUDENT_CREDENTIALS.password);
    await expect(page).toHaveURL(/dashboard/);
  });
});
