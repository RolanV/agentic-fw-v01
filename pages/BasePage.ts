import { Locator, Page } from '@playwright/test';

/**
 * BasePage - shared scaffolding for all ZincBank page objects.
 *
 * Holds the Playwright Page reference and small, reusable navigation/wait
 * helpers. Page objects should keep all assertions out of this class.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to an arbitrary path using the ZincBank base origin. */
  async gotoPath(path: string): Promise<void> {
    await this.page.goto(`https://zincbank.cydeo.io${path}`, {
      waitUntil: 'networkidle',
    });
  }

  /** Wait for a locator to become visible. Returns the locator for chaining. */
  async waitForVisible(locator: Locator): Promise<Locator> {
    await locator.waitFor({ state: 'visible' });
    return locator;
  }

  /** Wait briefly for the given locator to appear; returns true if visible. */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  /** Current page URL. */
  async currentUrl(): Promise<string> {
    return this.page.url();
  }
}
