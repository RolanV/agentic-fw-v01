import { Page } from '@playwright/test';
import { DuplicateEmailPage } from './pages/DuplicateEmailPage';
import { LoginPage } from './pages/LoginPage';
import { OpenAccountPage } from './pages/OpenAccountPage';

export let page: Page;
export let loginPage: LoginPage;
export let openAccountPage: OpenAccountPage;
export let duplicateEmailPage: DuplicateEmailPage;

export function initElements(worldPage: Page): void {
  page = worldPage;
  loginPage = new LoginPage(page);
  openAccountPage = new OpenAccountPage(page);
  duplicateEmailPage = new DuplicateEmailPage(page);
}
