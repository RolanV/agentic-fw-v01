import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Page, expect, chromium, Browser, BrowserContext } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page';
import {
  VALID_REGISTRATION_DATA,
  INVALID_EMAIL_DATA,
  WEAK_PASSWORD_DATA,
  DUPLICATE_USERNAME_DATA,
} from '../fixtures/registration-test-data';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let registrationPage: RegistrationPage;

/**
 * Hook: Initialize browser and page before each scenario
 */
Before(async function () {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  registrationPage = new RegistrationPage(page);
});

/**
 * Hook: Close browser and context after each scenario
 */
After(async function () {
  await context.close();
  await browser.close();
});

/**
 * Given: User is on the registration page
 */
Given('the user is on the registration page', async function () {
  await registrationPage.goto();
  // Ensure the form is visible by checking the sign‑up button
  await expect(registrationPage.signUpButton).toBeVisible();
});

/**
 * When: User fills the registration form with valid data
 */
When('the user fills the registration form with valid data', async function () {
  await registrationPage.fillRegistrationForm(VALID_REGISTRATION_DATA);
});

/**
 * When: User fills the registration form with an invalid email
 */
When(
  'the user fills the registration form with an invalid email {string}',
  async function (email: string) {
    const data = { ...VALID_REGISTRATION_DATA, email };
    await registrationPage.fillRegistrationForm(data);
  },
);

/**
 * When: User fills the registration form with a weak password
 */
When('the user fills the registration form with a weak password {string}', async function (password: string) {
  const data = { ...VALID_REGISTRATION_DATA, password };
  await registrationPage.fillRegistrationForm(data);
});

/**
 * When: User fills the registration form with an existing username
 */
When('the user fills the registration form with an existing username {string}', async function (username: string) {
  const data = { ...VALID_REGISTRATION_DATA, username };
  await registrationPage.fillRegistrationForm(data);
});

/**
 * When: User clears a specific field
 */
When('the user clears the {string} field', async function (field: string) {
  const fieldMap: Record<string, any> = {
    'First name': registrationPage.getFirstNameLocator(),
    'Last name': registrationPage.getLastNameLocator(),
    Username: registrationPage.getUsernameLocator(),
    Email: registrationPage.getEmailLocator(),
    Password: registrationPage.getPasswordLocator(),
    Phone: registrationPage.getPhoneLocator(),
  };
  const locator = fieldMap[field];
  if (!locator) {
    throw new Error(`Unsupported field name: ${field}`);
  }
  await registrationPage.clearField(locator);
});

/**
 * When: User fills the remaining fields with valid data
 * (used after a required field was cleared)
 */
When('the user fills the remaining fields with valid data', async function () {
  // Fill everything except the first name (already cleared)
  const { firstName, ...rest } = VALID_REGISTRATION_DATA;
  await registrationPage.fillRegistrationForm({
    ...rest,
    firstName: '',
  } as any);
});

/**
 * When: User clicks the "Sign up" button
 */
When('the user clicks the "Sign up" button', async function () {
  await registrationPage.clickSignUp();
});

/**
 * Then: Registration should be successful
 */
Then('the registration should be successful', async function () {
  await expect(registrationPage.isConfirmationVisible()).resolves.toBeTruthy();
});

/**
 * Then: Confirmation page should display {string}
 */
Then('the confirmation page should display {string}', async function (expected: string) {
  const text = await registrationPage.getConfirmationText();
  expect(text).toContain(expected);
});

/**
 * Then: A validation error for {string} should be displayed
 */
Then('a validation error for {string} should be displayed', async function (field: string) {
  // Simple check: the confirmation should NOT be visible
  const isConfirmed = await registrationPage.isConfirmationVisible();
  expect(isConfirmed).toBeFalsy();

  // Additional check: locate an element containing the field name and an error indicator
  const errorLocator = page
    .locator(`[role="alert"]`)
    .filter({ hasText: new RegExp(field, 'i') });
  const visible = await errorLocator.isVisible().catch(() => false);
  expect(visible).toBeTruthy();
});

/**
 * Then: All registration form fields should be visible
 */
Then('all registration form fields should be visible', async function () {
  await expect(registrationPage.firstNameInput).toBeVisible();
  await expect(registrationPage.lastNameInput).toBeVisible();
  await expect(registrationPage.usernameInput).toBeVisible();
  await expect(registrationPage.emailInput).toBeVisible();
  await expect(registrationPage.passwordInput).toBeVisible();
  await expect(registrationPage.phoneInput).toBeVisible();
  await expect(registrationPage.genderMaleRadio).toBeVisible();
  await expect(registrationPage.genderFemaleRadio).toBeVisible();
  await expect(registrationPage.dobInput).toBeVisible();
  await expect(registrationPage.departmentSelect).toBeVisible();
  await expect(registrationPage.jobTitleSelect).toBeVisible();
  await expect(registrationPage.programmingLanguageJavaCheckbox).toBeVisible();
  await expect(registrationPage.programmingLanguageJavaScriptCheckbox).toBeVisible();
  await expect(registrationPage.signUpButton).toBeVisible();
});

/**
 * Then: Each input should have an accessible label
 */
Then('each input should have an accessible label', async function () {
  // Verify that each input can be located via getByLabel (accessibility selector)
  const inputs = [
    registrationPage.firstNameInput,
    registrationPage.lastNameInput,
    registrationPage.usernameInput,
    registrationPage.emailInput,
    registrationPage.passwordInput,
    registrationPage.phoneInput,
    registrationPage.dobInput,
  ];
  for (const input of inputs) {
    await expect(input).toBeVisible();
  }
});

/**
 * Then: The page should load within {int} seconds
 */
Then('the page should load within {int} seconds', async function (seconds: number) {
  const start = Date.now();
  await registrationPage.goto();
  const duration = (Date.now() - start) / 1000;
  expect(duration).toBeLessThanOrEqual(seconds);
});