import { Page, Locator } from '@playwright/test';
import { OpenAccountPage } from './open-account.page';

/**
 * DuplicateEmailPage - Page Object Model for the duplicate-email A3 flow.
 *
 * Wraps the existing OpenAccountPage to drive the ZincBank apply flow,
 * then exposes A3-specific locators and interactions around duplicate
 * detection and form-state checks.
 *
 * This class contains no assertions.
 */
export class DuplicateEmailPage {
  readonly page: Page;
  readonly applyPage: OpenAccountPage;

  /**
   * Duplicate-email rejection message, located by the app's stable data-testid.
   * Actual text reads "An account with that email already exists".
   */
  readonly duplicateEmailMessage: Locator;
  readonly reviewSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.applyPage = new OpenAccountPage(page);
    this.duplicateEmailMessage = page.getByTestId('apply-error');
    this.reviewSummary = page.getByTestId('apply-review-summary');
  }

  /** Read the review-summary value for a term row (e.g. 'Name', 'Email'). */
  async getReviewSummaryValue(term: string): Promise<string> {
    const row = this.reviewSummary.locator('dt').filter({ hasText: term });
    return (await row.locator('xpath=following-sibling::dd[1]').textContent()) ?? '';
  }

  /** Read the duplicate-email rejection message text. */
  async getDuplicateEmailMessageText(): Promise<string> {
    return (await this.duplicateEmailMessage.textContent()) ?? '';
  }

  /** Check whether the duplicate-email rejection message is visible. */
  async isDuplicateEmailMessageVisible(): Promise<boolean> {
    return await this.duplicateEmailMessage.isVisible().catch(() => false);
  }

  /** Get the current value of the first-name input. */
  async getFirstNameValue(): Promise<string> {
    return await this.applyPage.firstNameInput.inputValue();
  }

  /** Get the current value of the last-name input. */
  async getLastNameValue(): Promise<string> {
    return await this.applyPage.lastNameInput.inputValue();
  }

  /** Get the current value of the email input. */
  async getEmailValue(): Promise<string> {
    return await this.applyPage.emailInput.inputValue();
  }

  /** Get the current value of the password input. */
  async getPasswordValue(): Promise<string> {
    return await this.applyPage.passwordInput.inputValue();
  }

  /** Access the post-registration dashboard total-balance locator. */
  get dashboardTotalBalance(): Locator {
    return this.applyPage.dashboardTotalBalance;
  }
}
