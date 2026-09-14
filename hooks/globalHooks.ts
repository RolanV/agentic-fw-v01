import {
  Before,
  After,
  setDefaultTimeout,
  setWorldConstructor,
  World,
  Status,
} from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { initElements } from '../globalPagesSetup';

setDefaultTimeout(60 * 1000);

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  registeredEmail = '';
  registeredPassword = '';
  registeredBalance = '$0.00';
  enteredFirstName = '';
  enteredLastName = '';
  enteredEmail = '';
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  await this.context.tracing.start({ screenshots: true, snapshots: true });

  this.registeredEmail = '';
  this.registeredPassword = '';
  this.registeredBalance = '$0.00';
  this.enteredFirstName = '';
  this.enteredLastName = '';
  this.enteredEmail = '';

  initElements(this.page);
});

After(async function (this: CustomWorld, scenario) {
  if (this.page && scenario.result?.status === Status.FAILED) {
    try {
      await this.page.screenshot({
        path: `reports/screenshot-${Date.now()}.png`,
        fullPage: true,
      });
    } catch {
      // ignore screenshot errors during teardown
    }

    try {
      await this.context.tracing.stop({ path: `reports/trace-${Date.now()}.zip` });
    } catch {
      // ignore trace errors during teardown
    }
  }

  if (this.context) {
    if (scenario.result?.status !== Status.FAILED) {
      await this.context.tracing.stop().catch(() => {});
    }
    await this.context.close();
  }
  if (this.browser) await this.browser.close();
});
