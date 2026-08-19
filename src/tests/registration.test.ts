import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page';
import { VALID_REGISTRATION_DATA } from '../fixtures/registration-test-data';

test('Fill registration form and submit', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  await registrationPage.goto();

  // Fill the form with valid data
  await registrationPage.fillRegistrationForm(VALID_REGISTRATION_DATA);

  // Submit
  await registrationPage.clickSignUp();

  // Wait a moment for the page to process
  await page.waitForTimeout(2000);

  // Verify confirmation is visible and contains expected text
  const isConfirmed = await registrationPage.isConfirmationVisible();
  expect(isConfirmed).toBeTruthy();

  const confirmationText = await registrationPage.getConfirmationText();
  // The demo site shows 'Well done!' on success; adjust if needed
  expect(confirmationText).toContain('Well done');
});
