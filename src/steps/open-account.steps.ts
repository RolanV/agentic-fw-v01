import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, chromium } from '@playwright/test';
import { OpenAccountPage } from '../pages/open-account.page';

let browser: Awaited<ReturnType<typeof chromium.launch>>;
let context: Awaited<ReturnType<typeof browser.newContext>>;
let page: Awaited<ReturnType<typeof context.newPage>>;
let applyPage: OpenAccountPage;

/** Hook: Initialize browser and page before each scenario. */
Before(async function () {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  applyPage = new OpenAccountPage(page);
});

/** Hook: Close browser and context after each scenario. */
After(async function () {
  await context.close();
  await browser.close();
});

Given('the user is on the ZincBank open-account page', async function () {
  await applyPage.goto();
  await page.getByTestId('apply-next').waitFor();
});

When('the user proceeds from the accounts step', async function () {
  await applyPage.continueFromAccountsStep();
});

When('the user fills in their first name {string}', async function (firstName: string) {
  await applyPage.firstNameInput.fill(firstName);
});

When('the user fills in their last name {string}', async function (lastName: string) {
  await applyPage.lastNameInput.fill(lastName);
});

When('the user fills in a unique email address', async function () {
  await applyPage.emailInput.fill(`e2e-a1-${Date.now()}@example.com`);
});

When('the user proceeds to the identity step', async function () {
  await applyPage.nextButton.click();
});

When('the user fills in their SSN {string}', async function (ssn: string) {
  await applyPage.ssnInput.fill(ssn);
});

When('the user selects their employment status {string}', async function (employment: string) {
  await applyPage.employmentSelect.selectOption(employment);
});

When('the user proceeds to the address step', async function () {
  await applyPage.nextButton.click();
});

When('the user fills in their street address {string}', async function (street: string) {
  await applyPage.addressLineInput.fill(street);
});

When('the user fills in their city {string}', async function (city: string) {
  await applyPage.cityInput.fill(city);
});

When('the user selects their state {string}', async function (state: string) {
  await applyPage.stateSelect.selectOption(state);
});

When('the user fills in their ZIP code {string}', async function (zip: string) {
  await applyPage.zipInput.fill(zip);
});

When('the user proceeds to the security step', async function () {
  await applyPage.nextButton.click();
});

When('the user sets their password to {string}', async function (password: string) {
  await applyPage.passwordInput.fill(password);
  await applyPage.confirmInput.fill(password);
});

When('the user proceeds to the review step', async function () {
  await applyPage.nextButton.click();
});

When('the user accepts the simulated-bank terms', async function () {
  await applyPage.termsCheckbox.check();
});

When('the user submits the application', async function () {
  await applyPage.submitButton.click();
});

When('the user continues to the dashboard', async function () {
  await applyPage.continueToDashboard();
});

Then('the user should be on the dashboard', async function () {
  await expect(page).toHaveURL(/\/dashboard$/);
});

Then('the dashboard should show a welcome heading', async function () {
  await expect(page.getByRole('heading', { name: /Welcome, E2E/ })).toBeVisible();
});

Then(
  'the dashboard should show a total deposit balance of {string}',
  async function (balance: string) {
    await expect(applyPage.dashboardTotalBalance).toHaveText(balance);
  },
);
