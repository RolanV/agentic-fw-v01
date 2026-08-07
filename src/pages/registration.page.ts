import { Page, Locator } from '@playwright/test';

/**
 * RegistrationPage - Page Object Model for the registration form
 * Encapsulates all interactions with the registration page without assertions.
 */
export class RegistrationPage {
  readonly page: Page;

  // Form fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly dobInput: Locator;
  readonly departmentSelect: Locator;
  readonly jobTitleSelect: Locator;
  readonly programmingLanguageJavaCheckbox: Locator;
  readonly programmingLanguageJavaScriptCheckbox: Locator;
  readonly signUpButton: Locator;

  // Alert / confirmation
  readonly confirmationAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation is handled in a separate method
    // Form inputs – use placeholder text as primary selector, with fallbacks
    this.firstNameInput = page.getByPlaceholder('first name').or(page.locator('input[name="first_name"]'));
    this.lastNameInput = page.getByPlaceholder('last name').or(page.locator('input[name="last_name"]'));
    this.usernameInput = page.getByPlaceholder('username').or(page.locator('input[name="username"]'));
    this.emailInput = page.getByPlaceholder('email@email.com').or(page.locator('input[name="email"]'));
    this.passwordInput = page.locator('input[name="password"]').or(page.locator('input[type="password"]'));
    this.phoneInput = page.getByPlaceholder('571-000-0000').or(page.locator('input[name="phone"]'));

    // Gender radios – use input[value] directly
    this.genderMaleRadio = page.locator('input[value="male"]');
    this.genderFemaleRadio = page.locator('input[value="female"]');

    // Date of birth – skip for now as it may not be on the basic form
    this.dobInput = page.locator('input[name="dob"]').or(page.locator('[data-test-id="dob"]'));

    // Department and job title – select elements
    this.departmentSelect = page.locator('select[name="department"]');
    this.jobTitleSelect = page.locator('select[name="job_title"]');

    // Programming language checkboxes
    this.programmingLanguageJavaCheckbox = page.getByRole('checkbox', { name: 'Java' }).or(page.locator('input[value="java"]'));
    this.programmingLanguageJavaScriptCheckbox = page.getByRole('checkbox', { name: 'JavaScript' }).or(page.locator('input[value="javascript"]'));

    // Submit button
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });

    // Confirmation alert on success page
    this.confirmationAlert = page.getByRole('alert').or(page.locator('.alert')).or(page.locator('[role="alert"]'));
  }

  /**
   * Navigate to the registration form page.
   */
  async goto(): Promise<void> {
    await this.page.goto('https://the-internet-5chk.onrender.com/registration_form', { waitUntil: 'networkidle' });
  }

  /** Fill First Name */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /** Fill Last Name */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /** Fill Username */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /** Fill Email */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /** Fill Password */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /** Fill Phone Number */
  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  /** Select Gender */
  async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    if (gender === 'Male') {
      await this.genderMaleRadio.check();
    } else {
      await this.genderFemaleRadio.check();
    }
  }

  /** Fill Date of Birth (expects format MM/DD/YYYY) */
  async fillDateOfBirth(dob: string): Promise<void> {
    await this.dobInput.fill(dob);
  }

  /** Select Department */
  async selectDepartment(department: string): Promise<void> {
    await this.departmentSelect.selectOption({ label: department });
  }

  /** Select Job Title */
  async selectJobTitle(jobTitle: string): Promise<void> {
    await this.jobTitleSelect.selectOption({ label: jobTitle });
  }

  /** Select Programming Languages (multiple) */
  async selectProgrammingLanguages(languages: string[]): Promise<void> {
    for (const lang of languages) {
      if (lang.toLowerCase() === 'java') {
        await this.programmingLanguageJavaCheckbox.check();
      } else if (lang.toLowerCase() === 'javascript') {
        await this.programmingLanguageJavaScriptCheckbox.check();
      }
    }
  }

  /** Click the Sign up button */
  async clickSignUp(): Promise<void> {
    await this.signUpButton.click();
    // Wait for navigation or confirmation alert
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Fill the entire form using a data object */
  async fillRegistrationForm(data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: 'Male' | 'Female';
    dob?: string;
    department?: string;
    jobTitle?: string;
    programmingLanguages?: string[];
  }): Promise<void> {
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillUsername(data.username);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillPhone(data.phone);
    await this.selectGender(data.gender);
    
    // Optional fields - only fill if present
    if (data.dob) {
      await this.dobInput.fill(data.dob).catch(() => {});
    }
    if (data.department) {
      await this.selectDepartment(data.department).catch(() => {});
    }
    if (data.jobTitle) {
      await this.selectJobTitle(data.jobTitle).catch(() => {});
    }
    if (data.programmingLanguages && data.programmingLanguages.length > 0) {
      await this.selectProgrammingLanguages(data.programmingLanguages).catch(() => {});
    }
  }

  /** Check if confirmation alert is visible */
  async isConfirmationVisible(): Promise<boolean> {
    return await this.confirmationAlert.isVisible().catch(() => false);
  }

  /** Get confirmation text */
  async getConfirmationText(): Promise<string> {
    try {
      return (await this.confirmationAlert.textContent()) || '';
    } catch {
      return '';
    }
  }

  /** Helper to clear a specific field (used for negative scenarios) */
  async clearField(locator: Locator): Promise<void> {
    await locator.fill('');
  }

  /** Expose individual locators for step definitions (e.g., clearing) */
  getFirstNameLocator(): Locator {
    return this.firstNameInput;
  }
  getLastNameLocator(): Locator {
    return this.lastNameInput;
  }
  getUsernameLocator(): Locator {
    return this.usernameInput;
  }
  getEmailLocator(): Locator {
    return this.emailInput;
  }
  getPasswordLocator(): Locator {
    return this.passwordInput;
  }
  getPhoneLocator(): Locator {
    return this.phoneInput;
  }
}