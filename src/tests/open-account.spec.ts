import { test, expect } from '@playwright/test';
import { OpenAccountPage } from '../pages/open-account.page';

test.describe('ZincBank A1 - Opening an account', () => {
  let applyPage: OpenAccountPage;
  const email = `e2e-a1-${Date.now()}@example.com`;

  test('registers a new customer, opens a checking account at $0.00 and signs them in', async ({
    page,
  }) => {
    applyPage = new OpenAccountPage(page);

    await applyPage.applyForCheckingAccount({
      firstName: 'E2E',
      lastName: 'Register',
      email,
      ssn: '123-45-6789',
      employment: 'Employed',
      street: '123 Test Ave',
      city: 'Springfield',
      state: 'CA',
      zip: '90210',
      password: 'Abcdef12!',
    });

    // A1.5 - auto sign-in lands on the dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // A1.4 - a default account exists and is funded with $0.00
    await expect(applyPage.dashboardTotalBalance).toBeVisible();
    await expect(page.getByRole('heading', { name: /Welcome, E2E/ })).toBeVisible();
  });
});
