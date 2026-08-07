# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: registration.test.ts >> Fill registration form and submit
- Location: src/tests/registration.test.ts:5:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - list [ref=e3]:
      - listitem [ref=e4]:
        - link "Home" [ref=e5] [cursor=pointer]:
          - /url: /
  - generic [ref=e6]:
    - generic [ref=e13]:
      - heading "Registration form" [level=2] [ref=e15]
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18] [cursor=pointer]: First name
          - generic [ref=e19]:
            - textbox "first name" [ref=e20]: John
            - generic [ref=e21]: 
        - generic [ref=e22]:
          - generic [ref=e23] [cursor=pointer]: Last name
          - generic [ref=e24]:
            - textbox "last name" [ref=e25]: Smith
            - generic [ref=e26]: 
        - generic [ref=e27]:
          - generic [ref=e28] [cursor=pointer]: Username
          - generic [ref=e29]:
            - textbox "username" [ref=e30]: johnsmith123
            - generic [ref=e31]: 
        - generic [ref=e32]:
          - generic [ref=e33] [cursor=pointer]: Email address
          - generic [ref=e34]:
            - textbox "email@email.com" [ref=e35]: john.smith@example.com
            - generic [ref=e36]: 
        - generic [ref=e37]:
          - generic [ref=e38] [cursor=pointer]: Password
          - generic [ref=e39]:
            - textbox [ref=e40]: SecurePass123!
            - generic [ref=e41]: 
        - generic [ref=e42]:
          - generic [ref=e43] [cursor=pointer]: Phone number
          - generic [ref=e44]:
            - textbox "571-000-0000" [ref=e45]: 202-555-0123
            - generic [ref=e46]: 
        - generic [ref=e47]:
          - generic [ref=e48] [cursor=pointer]: Gender
          - generic [ref=e49]:
            - generic [ref=e51] [cursor=pointer]:
              - radio "Male" [checked] [active] [ref=e52]
              - text: Male
            - generic [ref=e54] [cursor=pointer]:
              - radio "Female" [ref=e55]
              - text: Female
            - generic [ref=e56]:
              - generic [ref=e57] [cursor=pointer]:
                - radio "Other" [ref=e58]
                - text: Other
              - generic [ref=e59]: 
        - generic [ref=e60]:
          - generic [ref=e61] [cursor=pointer]: Date of birth
          - textbox "MM/DD/YYYY" [ref=e63]
        - generic [ref=e64]:
          - generic [ref=e65] [cursor=pointer]: Department / Office
          - combobox [ref=e67]:
            - option "Select your Department/Office" [selected]
            - option "Department of Engineering"
            - option "Department of Agriculture"
            - option "Accounting Office"
            - option "Tresurer's Office"
            - option "MPDC"
            - option "MCTC"
            - option "MCR"
            - option "Mayor's Office"
            - option "Tourism Office"
        - generic [ref=e68]:
          - generic [ref=e69] [cursor=pointer]: Job title
          - combobox [ref=e71]:
            - option "Select job type" [selected]
            - option "Designer"
            - option "Manager"
            - option "Developer"
            - option "SDET"
            - option "QA"
            - option "Scrum Master"
            - option "Product Owner"
            - option "Project Manager"
        - generic [ref=e72]:
          - generic [ref=e73] [cursor=pointer]: Select programming languages
          - generic [ref=e74]:
            - generic [ref=e75]:
              - checkbox "C++" [ref=e76]
              - generic [ref=e77] [cursor=pointer]: C++
            - generic [ref=e78]:
              - checkbox "Java" [ref=e79]
              - generic [ref=e80] [cursor=pointer]: Java
            - generic [ref=e81]:
              - checkbox "JavaScript" [ref=e82]
              - generic [ref=e83] [cursor=pointer]: JavaScript
        - button "Sign up" [ref=e86] [cursor=pointer]
    - generic [ref=e88]:
      - separator [ref=e89]
      - generic [ref=e90]:
        - text: Powered by
        - link "CYDEO" [ref=e91] [cursor=pointer]:
          - /url: https://cydeo.com/
```

# Test source

```ts
  37  |     this.emailInput = page.getByPlaceholder('email@email.com').or(page.locator('input[name="email"]'));
  38  |     this.passwordInput = page.locator('input[name="password"]').or(page.locator('input[type="password"]'));
  39  |     this.phoneInput = page.getByPlaceholder('571-000-0000').or(page.locator('input[name="phone"]'));
  40  | 
  41  |     // Gender radios – use input[value] directly
  42  |     this.genderMaleRadio = page.locator('input[value="male"]');
  43  |     this.genderFemaleRadio = page.locator('input[value="female"]');
  44  | 
  45  |     // Date of birth – skip for now as it may not be on the basic form
  46  |     this.dobInput = page.locator('input[name="dob"]').or(page.locator('[data-test-id="dob"]'));
  47  | 
  48  |     // Department and job title – select elements
  49  |     this.departmentSelect = page.locator('select[name="department"]');
  50  |     this.jobTitleSelect = page.locator('select[name="job_title"]');
  51  | 
  52  |     // Programming language checkboxes
  53  |     this.programmingLanguageJavaCheckbox = page.getByRole('checkbox', { name: 'Java' }).or(page.locator('input[value="java"]'));
  54  |     this.programmingLanguageJavaScriptCheckbox = page.getByRole('checkbox', { name: 'JavaScript' }).or(page.locator('input[value="javascript"]'));
  55  | 
  56  |     // Submit button
  57  |     this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  58  | 
  59  |     // Confirmation alert on success page
  60  |     this.confirmationAlert = page.getByRole('alert').or(page.locator('.alert')).or(page.locator('[role="alert"]'));
  61  |   }
  62  | 
  63  |   /**
  64  |    * Navigate to the registration form page.
  65  |    */
  66  |   async goto(): Promise<void> {
  67  |     await this.page.goto('https://the-internet-5chk.onrender.com/registration_form', { waitUntil: 'networkidle' });
  68  |   }
  69  | 
  70  |   /** Fill First Name */
  71  |   async fillFirstName(firstName: string): Promise<void> {
  72  |     await this.firstNameInput.fill(firstName);
  73  |   }
  74  | 
  75  |   /** Fill Last Name */
  76  |   async fillLastName(lastName: string): Promise<void> {
  77  |     await this.lastNameInput.fill(lastName);
  78  |   }
  79  | 
  80  |   /** Fill Username */
  81  |   async fillUsername(username: string): Promise<void> {
  82  |     await this.usernameInput.fill(username);
  83  |   }
  84  | 
  85  |   /** Fill Email */
  86  |   async fillEmail(email: string): Promise<void> {
  87  |     await this.emailInput.fill(email);
  88  |   }
  89  | 
  90  |   /** Fill Password */
  91  |   async fillPassword(password: string): Promise<void> {
  92  |     await this.passwordInput.fill(password);
  93  |   }
  94  | 
  95  |   /** Fill Phone Number */
  96  |   async fillPhone(phone: string): Promise<void> {
  97  |     await this.phoneInput.fill(phone);
  98  |   }
  99  | 
  100 |   /** Select Gender */
  101 |   async selectGender(gender: 'Male' | 'Female'): Promise<void> {
  102 |     if (gender === 'Male') {
  103 |       await this.genderMaleRadio.check();
  104 |     } else {
  105 |       await this.genderFemaleRadio.check();
  106 |     }
  107 |   }
  108 | 
  109 |   /** Fill Date of Birth (expects format MM/DD/YYYY) */
  110 |   async fillDateOfBirth(dob: string): Promise<void> {
  111 |     await this.dobInput.fill(dob);
  112 |   }
  113 | 
  114 |   /** Select Department */
  115 |   async selectDepartment(department: string): Promise<void> {
  116 |     await this.departmentSelect.selectOption({ label: department });
  117 |   }
  118 | 
  119 |   /** Select Job Title */
  120 |   async selectJobTitle(jobTitle: string): Promise<void> {
  121 |     await this.jobTitleSelect.selectOption({ label: jobTitle });
  122 |   }
  123 | 
  124 |   /** Select Programming Languages (multiple) */
  125 |   async selectProgrammingLanguages(languages: string[]): Promise<void> {
  126 |     for (const lang of languages) {
  127 |       if (lang.toLowerCase() === 'java') {
  128 |         await this.programmingLanguageJavaCheckbox.check();
  129 |       } else if (lang.toLowerCase() === 'javascript') {
  130 |         await this.programmingLanguageJavaScriptCheckbox.check();
  131 |       }
  132 |     }
  133 |   }
  134 | 
  135 |   /** Click the Sign up button */
  136 |   async clickSignUp(): Promise<void> {
> 137 |     await this.signUpButton.click();
      |                             ^ Error: locator.click: Target page, context or browser has been closed
  138 |     // Wait for navigation or confirmation alert
  139 |     await this.page.waitForLoadState('networkidle').catch(() => {});
  140 |   }
  141 | 
  142 |   /** Fill the entire form using a data object */
  143 |   async fillRegistrationForm(data: {
  144 |     firstName: string;
  145 |     lastName: string;
  146 |     username: string;
  147 |     email: string;
  148 |     password: string;
  149 |     phone: string;
  150 |     gender: 'Male' | 'Female';
  151 |     dob?: string;
  152 |     department?: string;
  153 |     jobTitle?: string;
  154 |     programmingLanguages?: string[];
  155 |   }): Promise<void> {
  156 |     await this.fillFirstName(data.firstName);
  157 |     await this.fillLastName(data.lastName);
  158 |     await this.fillUsername(data.username);
  159 |     await this.fillEmail(data.email);
  160 |     await this.fillPassword(data.password);
  161 |     await this.fillPhone(data.phone);
  162 |     await this.selectGender(data.gender);
  163 |     
  164 |     // Optional fields - only fill if present
  165 |     if (data.dob) {
  166 |       await this.dobInput.fill(data.dob).catch(() => {});
  167 |     }
  168 |     if (data.department) {
  169 |       await this.selectDepartment(data.department).catch(() => {});
  170 |     }
  171 |     if (data.jobTitle) {
  172 |       await this.selectJobTitle(data.jobTitle).catch(() => {});
  173 |     }
  174 |     if (data.programmingLanguages && data.programmingLanguages.length > 0) {
  175 |       await this.selectProgrammingLanguages(data.programmingLanguages).catch(() => {});
  176 |     }
  177 |   }
  178 | 
  179 |   /** Check if confirmation alert is visible */
  180 |   async isConfirmationVisible(): Promise<boolean> {
  181 |     return await this.confirmationAlert.isVisible().catch(() => false);
  182 |   }
  183 | 
  184 |   /** Get confirmation text */
  185 |   async getConfirmationText(): Promise<string> {
  186 |     try {
  187 |       return (await this.confirmationAlert.textContent()) || '';
  188 |     } catch {
  189 |       return '';
  190 |     }
  191 |   }
  192 | 
  193 |   /** Helper to clear a specific field (used for negative scenarios) */
  194 |   async clearField(locator: Locator): Promise<void> {
  195 |     await locator.fill('');
  196 |   }
  197 | 
  198 |   /** Expose individual locators for step definitions (e.g., clearing) */
  199 |   getFirstNameLocator(): Locator {
  200 |     return this.firstNameInput;
  201 |   }
  202 |   getLastNameLocator(): Locator {
  203 |     return this.lastNameInput;
  204 |   }
  205 |   getUsernameLocator(): Locator {
  206 |     return this.usernameInput;
  207 |   }
  208 |   getEmailLocator(): Locator {
  209 |     return this.emailInput;
  210 |   }
  211 |   getPasswordLocator(): Locator {
  212 |     return this.passwordInput;
  213 |   }
  214 |   getPhoneLocator(): Locator {
  215 |     return this.phoneInput;
  216 |   }
  217 | }
```