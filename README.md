# Cline Automation Framework

A production‑ready, AI‑first UI automation platform built on **Playwright**, **TypeScript**, **Cucumber (BDD)**, **Page Object Model**, **Component Object Model**, **Allure**, **GitHub Actions**, **ESLint**, **Prettier**, **Husky**, and **dotenv**.

## Getting Started

1. **Install dependencies**

   ```bash
   npm ci
   ```

   ***

   if not work
   ---

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Fill in required values
   ```

3. **Run the test suite**

   ```bash
   npm run test
   ```

4. **Generate an Allure report**

   ```bash
   npm run allure:serve
   ```

## Using Cline Agents

### Example: Generate Feature, Scenario, Step Definitions and Page Objects for ZincBank Login

The following CLI commands illustrate how to generate a feature file, scenario, step definitions, and a page object for the login page at `https://zincbank.cydeo.io/login` using valid credentials.

```bash
# Generate a feature named "login"
cline generate feature --name login --url https://zincbank.cydeo.io/login

# Generate a scenario within the feature
cline generate scenario --feature login --title "Login with valid credentials"

# Generate step definitions for the scenario
cline generate step \\
  --scenario login \\
  --given "I am on the login page" \\
  --when "I fill in email \"student01@zinc.test\" and password \"9pJolA7GBQec\"" \\
  --then "I should be redirected to the dashboard"

# Generate a page object for the login page
cline generate page --url https://zincbank.cydeo.io/login --name LoginPage
```

These commands will create the necessary markdown feature, Gherkin scenario, TypeScript step definition files under `steps/`, and a Page Object class under `src/pages/`. After generation, run the test suite:

```bash
npm run test
```

## Using Cline commands from chat

You can invoke Cline actions directly from a chat interface. For example:

```bash
cline orchestrate "generate feature login for https://zincbank.cydeo.io/login with credentials student01@zinc.test / 9pJolA7GBQec"
```

The orchestrator parses the request, runs the appropriate agents, and automatically creates the feature, scenario, step definitions, and a page object.

## Solution

To run the Cline CLI:

1. **Install dependencies** (already completed with the legacy flag):

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Use the CLI via `npx`** (or add a script):

   ```bash
   npx cline orchestrate "generate feature login for https://zincbank.cydeo.io/login with credentials student01@zinc.test / 9pJolA7GBQec"
   ```

   If you prefer a shortcut, add a script to `package.json`:

   ```json
   "scripts": {
     "cline": "cline"
   }
   ```

   Then run:

   ```bash
   npm run cline -- orchestrate "generate feature login for https://zincbank.cydeo.io/login with credentials student01@zinc.test / 9pJolA7GBQec"
   ```

## Visualizing the Architecture Diagram

The repository includes a Graphviz DOT file (`diagram.dot`) that illustrates the relationships between **Clinerules**, **Agents**, **Templates**, **Prompts**, and **Skills**.

### How to render the diagram

#### macOS / Linux

```bash
# Install Graphviz if not already installed
brew install graphviz   # Homebrew (macOS)
# or
sudo apt-get install graphviz   # Debian/Ubuntu

# Generate a PNG from the DOT file
dot -Tpng diagram.dot -o diagram.png

# Open the image
open diagram.png   # macOS
xdg-open diagram.png   # Linux
```

#### Windows

```powershell
# Install Graphviz (e.g., via Chocolatey)
choco install graphviz

# Generate a PNG from the DOT file
dot -Tpng diagram.dot -o diagram.png

# Open the image
Start-Process diagram.png
```

The resulting `diagram.png` provides a clear visual representation of how the core components of the Cline automation framework interact.

The framework is driven by **AI agents** that each own a single responsibility. Agents live under `.cline/agents/` and are orchestrated by the Master Orchestrator.

### Core CLI commands

```bash
cline <action> [options]
```

| Action                        | Description                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `cline generate feature`      | Starts the Feature Generator workflow (creates a feature file, scenarios, tags, etc.).          |
| `cline generate page`         | Scaffolds a new Page Object using the `page-object.md` template.                                |
| `cline generate component`    | Scaffolds a Component Object.                                                                   |
| `cline run <agent-name>`      | Directly runs a specific agent (useful for debugging).                                          |
| `cline orchestrate <request>` | Sends a free‑form request to the Master Orchestrator which routes it to the appropriate agents. |

All commands respect the **Human Approval** process defined in `.clinerules/human-approval.md`. After a major step (e.g., generating a feature file or modifying source code) the orchestrator pauses and prompts you to **Approve** or **Reject** the artefact.

### New: Website Analyzer Agent

The **Website Analyzer Agent** (`website-analyzer`) automatically:

1. Uses the Playwright MCP `browser_snapshot` tool to capture an accessibility snapshot of a live URL.
2. Parses the snapshot to discover interactive elements (buttons, links, inputs, etc.) according to `.clinerules/locator-rules.md`.
3. Generates or updates a Cucumber **feature file** under `tests/` with scenarios that exercise each discovered element.
4. Returns a summary of the operation (snapshot file, feature file path, number of scenarios created).

**Example usage**

```bash
cline run website-analyzer --url https://example.com/login
```

You will be prompted to approve the generated scenarios before they are persisted.

## Example: Generate Scenarios from Zinc Bank Login Page

The following prompt demonstrates how to explore a live login page and automatically generate comprehensive Gherkin scenarios using the Orchestrator:

**Prompt**

```
Explore the page https://zincbank.cydeo.io/login and generate scenarios with Email/Password as student01@zinc.test/9pJolA7GBQec
```

**Generated Gherkin Scenarios**

```gherkin
Feature: Zinc Bank User Login
  As a Zinc Bank customer
  I want to log in with my email and password
  So that I can access my account

  Background:
    Given I navigate to "https://zincbank.cydeo.io/login"

  Scenario: Successful login with valid credentials
    When I fill the email field with "student01@zinc.test"
    And I fill the password field with "9pJolA7GBQec"
    And I click the "Sign in" button
    Then I should be redirected to the dashboard page
    And the page title should contain "Zinc Bank"

  Scenario: Login attempt with empty email field
    When I leave the email field empty
    And I fill the password field with "9pJolA7GBQec"
    And I click the "Sign in" button
    Then I should see an error message indicating email is required

  Scenario: Login attempt with empty password field
    When I fill the email field with "student01@zinc.test"
    And I leave the password field empty
    And I click the "Sign in" button
    Then I should see an error message indicating password is required

  Scenario: Login attempt with invalid credentials
    When I fill the email field with "invalid@test.com"
    And I fill the password field with "wrongpassword"
    And I click the "Sign in" button
    Then I should see an error message indicating login failed

  Scenario: Navigate to account creation from login page
    When I click the "Open an account" link
    Then I should be navigated to the account creation page
```

This example illustrates how the **Orchestrator** can automatically:

- Analyze a live webpage using Playwright snapshots
- Generate business‑focused Gherkin scenarios
- Map UI elements to step definitions
- Create corresponding Page Objects for interaction

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`) automatically:

- Lints the code
- Runs Playwright tests with Allure reporting
- Publishes the Allure report as GitHub Pages

## Contribution Guidelines

- Follow the **Human Approval** process for any major change (see `.clinerules/human-approval.md`).
- Keep code style consistent (`npm run lint`, `npm run format`).
- Update documentation when adding or modifying agents, skills, or templates.

## License

MIT

_Generated by the Cline Documentation Agent._
