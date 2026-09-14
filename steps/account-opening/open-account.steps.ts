import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { openAccountPage, page } from '../../globalPagesSetup';

Given('the user is on the ZincBank open-account page', async function () {
  await openAccountPage.goto();
  await page.getByTestId('apply-next').waitFor();
});

When('the user proceeds from the accounts step', async function () {
  await openAccountPage.continueFromAccountsStep();
});

When('the user fills in their first name {string}', async function (firstName: string) {
  await openAccountPage.firstNameInput.fill(firstName);
});

When('the user fills in their last name {string}', async function (lastName: string) {
  await openAccountPage.lastNameInput.fill(lastName);
});

When('the user fills in a unique email address', async function () {
  await openAccountPage.emailInput.fill(`e2e-a1-${Date.now()}@example.com`);
});

When('the user proceeds to the identity step', async function () {
  await openAccountPage.nextButton.click();
});

When('the user fills in their SSN {string}', async function (ssn: string) {
  await openAccountPage.ssnInput.fill(ssn);
});

When('the user selects their employment status {string}', async function (employment: string) {
  await openAccountPage.employmentSelect.selectOption(employment);
});

When('the user proceeds to the address step', async function () {
  await openAccountPage.nextButton.click();
});

When('the user fills in their street address {string}', async function (street: string) {
  await openAccountPage.addressLineInput.fill(street);
});

When('the user fills in their city {string}', async function (city: string) {
  await openAccountPage.cityInput.fill(city);
});

When('the user selects their state {string}', async function (state: string) {
  await openAccountPage.stateSelect.selectOption(state);
});

When('the user fills in their ZIP code {string}', async function (zip: string) {
  await openAccountPage.zipInput.fill(zip);
});

When('the user proceeds to the security step', async function () {
  await openAccountPage.nextButton.click();
});

When('the user sets their password to {string}', async function (password: string) {
  await openAccountPage.passwordInput.fill(password);
  await openAccountPage.confirmInput.fill(password);
});

When('the user proceeds to the review step', async function () {
  await openAccountPage.nextButton.click();
});

When('the user accepts the simulated-bank terms', async function () {
  await openAccountPage.termsCheckbox.check();
});

When('the user submits the application', async function () {
  await openAccountPage.submitButton.click();
});

When('the user continues to the dashboard', async function () {
  await openAccountPage.continueToDashboard();
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
    await expect(openAccountPage.dashboardTotalBalance).toHaveText(balance);
  },
);
