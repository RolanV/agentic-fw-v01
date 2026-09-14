import { Locator, Page, expect } from '@playwright/test';

/**
 * BrowserUtility - static helpers for common browser interactions.
 *
 * These helpers are intentionally thin and do not hide which page object
 * locator they operate on. Assertions inside helper methods are limited to
 * verifying the requested action completed successfully.
 */
export class BrowserUtility {
  /**
   * Fill an input only if it is currently visible.
   */
  static async fillIfVisible(locator: Locator, value: string): Promise<void> {
    if (await locator.isVisible()) {
      await locator.fill(value);
    }
  }

  /**
   * Check a checkbox and verify it is checked afterwards.
   */
  static async checkAndVerify(locator: Locator): Promise<void> {
    await locator.check();
    await expect(locator).toBeChecked();
  }

  /**
   * Verify the page title contains the expected text. Case-insensitive.
   */
  static async verifyTitle(page: Page, expectedTitle: string): Promise<void> {
    await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
}
