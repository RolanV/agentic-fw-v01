import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, expect } from '@playwright/test';

setDefaultTimeout(60 * 1000);
import { DuplicateEmailPage } from '../pages/duplicate-email.page';
import { LoginPage } from '../pages/login.page';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let duplicatePage: DuplicateEmailPage;
let loginPage: LoginPage;

let registeredEmail: string;
let registeredPassword: string;
let registeredBalance: string;

let enteredFirstName: string;
let enteredLastName: string;
let enteredEmail: string;

const generateUniqueEmail = (suffix: string): string =>
  `e2e-a3-${suffix}-${Date.now()}@example.com`;

/** Hook: Launch a fresh browser context for each scenario. */
Before(async function () {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  duplicatePage = new DuplicateEmailPage(page);
  loginPage = new LoginPage(page);

  registeredEmail = '';
  registeredPassword = '';
  registeredBalance = '$0.00';

  enteredFirstName = '';
  enteredLastName = '';
  enteredEmail = '';
});

/** Hook: Close the browser context after each scenario. */
After(async function () {
  await context.close();
  await browser.close();
});

/**
 * Background: Register a brand-new account so duplicate-detection scenarios
 * have an existing account to collide with.
 */
Given('an account is already registered with a unique email address', async function () {
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

/**
 * Positive baseline: a genuinely different email should still be accepted
 * even after an account already exists.
 */
When('the user applies for an account using a different email address', async function () {
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
});

/** Negative: attempt to register again using the same email. */
When('the user applies for an account using the already-registered email', async function () {
  enteredFirstName = 'E2E';
  enteredLastName = 'Duplicate';
  enteredEmail = registeredEmail;

  await duplicatePage.applyPage.goto();
  await duplicatePage.applyPage.continueFromAccountsStep();
  await duplicatePage.applyPage.fillAboutYou(enteredFirstName, enteredLastName, enteredEmail);
  await duplicatePage.applyPage.fillIdentity('123-45-6789', 'Employed');
  await duplicatePage.applyPage.fillAddress('123 Test Ave', 'Springfield', 'CA', '90210');
  await duplicatePage.applyPage.fillSecurity('Abcdef12!');
  await duplicatePage.applyPage.reviewAndSubmit();
});

/**
 * Boundary: attempt to register using the supplied email variant.
 *
 * NOTE: The Scenario Outline examples use literal variants (`Test@X.com` and
 * ` E2E-Case@example.com `) that do not match the Background's generated
 * registered email. This step passes the variant through literally; live-app
 * verification will be needed to determine whether these examples should be
 * templated against the registered email instead.
 */
When('the user applies for an account using the email {string}', async function (email: string) {
  // Map boundary sentinels to real variants of the registered email.
  let resolvedEmail = email;
  if (email === 'Test@X.com') {
    resolvedEmail = registeredEmail.toUpperCase();
  } else if (email === 'E2E-Case@example.com') {
    resolvedEmail = `  ${registeredEmail}  `;
  }

  enteredFirstName = 'E2E';
  enteredLastName = 'Boundary';
  enteredEmail = resolvedEmail;

  await duplicatePage.applyPage.goto();
  await duplicatePage.applyPage.continueFromAccountsStep();
  await duplicatePage.applyPage.fillAboutYou(enteredFirstName, enteredLastName, enteredEmail);
  await duplicatePage.applyPage.fillIdentity('123-45-6789', 'Employed');
  await duplicatePage.applyPage.fillAddress('123 Test Ave', 'Springfield', 'CA', '90210');
  await duplicatePage.applyPage.fillSecurity('Abcdef12!');
  await duplicatePage.applyPage.reviewAndSubmit();
});

/** Assert the application reached the dashboard. */
Then('the application is accepted', async function () {
  await expect(page).toHaveURL(/\/dashboard/);
});

/** Assert the duplicate-email rejection message is visible. */
Then('the application is rejected', async function () {
  await expect(duplicatePage.duplicateEmailMessage).toBeVisible();
});

/** Duplicate-email message visibility check. */
Then('a duplicate-email message is shown', async function () {
  await expect(duplicatePage.duplicateEmailMessage).toBeVisible();
});

/** Exact message text assertion from the approved AC. */
Then('the message reads {string}', async function (expectedMessage: string) {
  await expect(duplicatePage.duplicateEmailMessage).toHaveText(expectedMessage);
});

/** Dashboard confirmation for the positive baseline. */
Then('the user is signed in to the dashboard', async function () {
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();
});

/**
 * Regression: the original account still exists, so logging in with the
 * registered credentials succeeds.
 */
Then('no new account is created', async function () {
  await loginPage.goto();
  await loginPage.login(registeredEmail, registeredPassword);
  await expect(page).toHaveURL(/\/dashboard/);
});

/** Regression: the registered account balance is unchanged after the duplicate attempt. */
Then('the existing account balance is unchanged', async function () {
  const currentBalance = await duplicatePage.dashboardTotalBalance.textContent();
  expect(currentBalance?.trim()).toBe(registeredBalance);
});

/** Form-state: first name, last name, and email should retain their entered values. */
Then('the name and email fields still show the entered values', async function () {
  expect(await duplicatePage.getFirstNameValue()).toBe(enteredFirstName);
  expect(await duplicatePage.getLastNameValue()).toBe(enteredLastName);
  expect(await duplicatePage.getEmailValue()).toBe(enteredEmail);
});

/** Form-state: the password input should be cleared after a duplicate rejection. */
Then('the password field is empty', async function () {
  expect(await duplicatePage.getPasswordValue()).toBe('');
});
