import { Page, Locator, expect } from '@playwright/test';

/**
 * OpenAccountPage - Page Object Model for the ZincBank "Open an account" flow (Req A1).
 *
 * Encapsulates the 6-step application (choose accounts -> about you -> identity ->
 * address -> security -> review & confirm) without assertions, plus the dashboard
 * post-registration state. Selectors use data-testid per the CYDEO contract.
 */
export class OpenAccountPage {
  readonly page: Page;
  readonly baseUrl = 'https://zincbank.cydeo.io';

  // Step 2 - About you
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;

  // Step 3 - Identity (simulated)
  readonly ssnInput: Locator;
  readonly employmentSelect: Locator;

  // Step 4 - Your address
  readonly addressLineInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly zipInput: Locator;

  // Step 5 - Security
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;

  // Step 6 - Review & confirm
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;

  // Navigation
  readonly nextButton: Locator;
  readonly backButton: Locator;

  // Decision / success
  readonly decisionContinueButton: Locator;

  // Dashboard (post-registration)
  readonly dashboardTotalBalance: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 2
    this.firstNameInput = page.getByTestId('apply-firstname-input');
    this.lastNameInput = page.getByTestId('apply-lastname-input');
    this.emailInput = page.getByTestId('apply-email-input');

    // Step 3
    this.ssnInput = page.getByTestId('apply-ssn-input');
    this.employmentSelect = page.getByTestId('apply-employment-select');

    // Step 4
    this.addressLineInput = page.getByTestId('apply-addressline-input');
    this.cityInput = page.getByTestId('apply-city-input');
    this.stateSelect = page.getByTestId('apply-state-select');
    this.zipInput = page.getByTestId('apply-zip-input');

    // Step 5
    this.passwordInput = page.getByTestId('apply-password-input');
    this.confirmInput = page.getByTestId('apply-confirm-input');

    // Step 6
    this.termsCheckbox = page.getByTestId('apply-terms-checkbox');
    this.submitButton = page.getByTestId('apply-submit');

    // Navigation
    this.nextButton = page.getByTestId('apply-next');
    this.backButton = page.getByTestId('apply-back');

    // Decision / success
    this.decisionContinueButton = page.getByTestId('apply-decision-continue');

    // Dashboard - total deposit balance
    this.dashboardTotalBalance = page
      .locator('text=Total deposit balance')
      .locator('..')
      .locator('..')
      .getByText('$0.00');
  }

  /** Navigate to the account-opening (apply) page. */
  async goto(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/apply`);
  }

  /** Step 1 - accept default (checking always included) and continue. */
  async continueFromAccountsStep(): Promise<void> {
    await this.nextButton.click();
  }

  /** Step 2 - fill personal details. */
  async fillAboutYou(firstName: string, lastName: string, email: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.nextButton.click();
  }

  /** Step 3 - fill simulated identity. */
  async fillIdentity(ssn: string, employment: string): Promise<void> {
    await this.ssnInput.fill(ssn);
    await this.employmentSelect.selectOption(employment);
    await this.nextButton.click();
  }

  /** Step 4 - fill address. */
  async fillAddress(street: string, city: string, state: string, zip: string): Promise<void> {
    await this.addressLineInput.fill(street);
    await this.cityInput.fill(city);
    await this.stateSelect.selectOption(state);
    await this.zipInput.fill(zip);
    await this.nextButton.click();
  }

  /** Step 5 - set and confirm password. */
  async fillSecurity(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.confirmInput.fill(password);
    await this.nextButton.click();
  }

  /** Step 6 - accept simulated-bank terms and submit. */
  async reviewAndSubmit(): Promise<void> {
    await this.termsCheckbox.check();
    await this.submitButton.click();
  }

  /** Post-approval - continue to dashboard. */
  async continueToDashboard(): Promise<void> {
    await expect(this.decisionContinueButton).toBeVisible();
    await this.decisionContinueButton.click();
  }

  /** Convenience: complete the entire application flow. */
  async applyForCheckingAccount(data: {
    firstName: string;
    lastName: string;
    email: string;
    ssn: string;
    employment: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    password: string;
  }): Promise<void> {
    await this.goto();
    await this.continueFromAccountsStep();
    await this.fillAboutYou(data.firstName, data.lastName, data.email);
    await this.fillIdentity(data.ssn, data.employment);
    await this.fillAddress(data.street, data.city, data.state, data.zip);
    await this.fillSecurity(data.password);
    await this.reviewAndSubmit();
    await this.continueToDashboard();
  }
}
