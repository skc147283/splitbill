# SplitBill Playwright Test Architecture

## Overview

This document describes the comprehensive UI testing framework for the SplitBill application using Playwright. The framework is designed for production-grade automated testing with support for multiple browsers, execution modes, and detailed reporting.

## Architecture Overview

```
SplitBill Testing Infrastructure
├── API Tests (/tests)
│   ├── Fixtures: Test data definitions
│   ├── Scenarios: Business logic test cases
│   ├── Utils: Helper functions
│   ├── Reports: Test results and metrics
│   └── runTests.ts: Test orchestration
├── UI Tests (/playwright-tests)
│   ├── playwright.config.ts: Multi-browser configuration
│   ├── tests/
│   │   ├── auth.spec.ts: Authentication flows
│   │   ├── groups.spec.ts: Group management
│   │   ├── expenses.spec.ts: Expense tracking
│   │   └── settlement.spec.ts: Settlement calculations
│   ├── utils/
│   │   ├── pageObjects.ts: Page Object Model
│   │   └── testHelpers.ts: Test utilities
│   ├── reports/: Test results and HTML reports
│   └── package.json: Test scripts and dependencies
└── Test Manager (/mcp-server)
    ├── src/index.js: MCP server implementation
    └── Tools: Test execution and reporting
```

## Playwright Configuration

### File: `playwright.config.ts`

**Purpose:** Central configuration for all Playwright test settings

**Key Features:**
- **5 Browser Projects:**
  - Chromium (primary)
  - Firefox (compatibility)
  - WebKit (Safari simulation)
  - Mobile Chrome (mobile testing)
  - Locale variants (multi-language)

- **Test Settings:**
  - Base URL: `http://localhost:3000` (dev) / `https://splitbill-app-jygd.onrender.com` (prod)
  - Timeout: 30 seconds per test
  - Retries: 2 on CI, 0 locally
  - Screenshot/Video: Captured only on failure

- **Reporters:**
  - HTML Report (interactive)
  - JSON Report (machine readable)
  - JUnit Report (CI/CD integration)

- **Advanced Features:**
  - Trace recording for failed tests
  - Screenshot capture on failure
  - Video recording options
  - Parallel execution by default

### Example Configuration

```typescript
const config: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
};
```

## Page Object Model (POM)

### File: `utils/pageObjects.ts`

**Purpose:** Encapsulate page structure and interactions

**Design Pattern:** 
- Separates test logic from UI implementation
- Enables easy maintenance when UI changes
- Provides reusable components across tests
- Improves test readability

### Page Classes

#### 1. **LoginPage**

```typescript
class LoginPage {
  goto()                        // Navigate to login page
  fillEmail(email: string)      // Enter email
  fillPassword(password: string) // Enter password
  clickLoginButton()            // Submit login
  login(email, password)        // Combined login flow
  waitForLoginSuccess()         // Wait for success
  getErrorMessage()             // Get error text
}
```

**Usage in Tests:**
```typescript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@example.com', 'password123');
await loginPage.waitForLoginSuccess();
```

#### 2. **RegisterPage**

```typescript
class RegisterPage {
  goto()                         // Navigate to register page
  fillName(name: string)         // Enter full name
  fillEmail(email: string)       // Enter email
  fillPassword(password: string) // Enter password
  register(name, email, password) // Combined registration
  waitForRegistrationSuccess()   // Wait for success
}
```

#### 3. **GroupsPage**

```typescript
class GroupsPage {
  goto()                         // Navigate to groups page
  createGroup(groupName: string) // Create new group
  clickGroup(groupName: string)  // Open group
  getGroupNames()                // Get all group names
}
```

#### 4. **GroupDetailPage**

```typescript
class GroupDetailPage {
  addMember(email: string)         // Add group member
  addExpense(description, amount)  // Add expense
  getExpenseList()                 // Get all expenses
  getSettlementInfo()              // Get settlement data
}
```

## Test Structure

### Test Organization

Tests are organized into 4 suites covering main user workflows:

### 1. **Authentication Tests** (`auth.spec.ts`)

| Test ID | Description | Scenario |
|---------|-------------|----------|
| AUTH-001 | User Registration | Register new account with valid data |
| AUTH-002 | User Login | Login with registered credentials |
| AUTH-003 | Invalid Credentials | Show error for wrong password |
| AUTH-004 | Navigation | Navigate to register from login |
| AUTH-005 | Demo User Login | Test demo account access |
| SESSION-001 | Login Persistence | Session maintained after page reload |
| SESSION-002 | Logout | User logged out and redirected |

**Key Test Pattern:**
```typescript
test('[AUTH-001] User should register with valid credentials', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const testData = generateTestData();
  
  await registerPage.goto();
  await registerPage.register(testData.name, testData.email, testData.password);
  await registerPage.waitForRegistrationSuccess();
  await expect(page).toHaveURL(/\/groups/);
});
```

### 2. **Group Management Tests** (`groups.spec.ts`)

| Test ID | Description | Scenario |
|---------|-------------|----------|
| GROUP-001 | View Groups Page | Display groups list on load |
| GROUP-002 | Create Group | Create new group with name |
| GROUP-003 | View Details | Open group and see members |
| GROUP-004 | Add Member | Add participant by email |
| GROUP-005 | Members List | Display all group members |

**Key Functionality Tested:**
- Group creation workflow
- Member management
- Group navigation
- Member visibility and roles

### 3. **Expense Tracking Tests** (`expenses.spec.ts`)

| Test ID | Description | Scenario |
|---------|-------------|----------|
| EXPENSE-001 | View Expenses | Display expense list |
| EXPENSE-002 | Add Expense | Create new shared expense |
| EXPENSE-003 | Expense List | All expenses displayed correctly |
| EXPENSE-004 | Required Fields | Form validation enforced |
| EXPENSE-005 | Expense Details | View individual expense info |

**Test Coverage:**
- Expense creation form
- Validation rules
- Expense list display
- Amount calculations
- Description tracking

### 4. **Settlement Tests** (`settlement.spec.ts`)

| Test ID | Description | Scenario |
|---------|-------------|----------|
| SETTLEMENT-001 | View Settlement | Display settlement section |
| SETTLEMENT-002 | Parties Display | Show who owes whom |
| SETTLEMENT-003 | Amounts | Verify positive amounts |
| SETTLEMENT-004 | Mark Paid | Record payment |
| SETTLEMENT-005 | History | Payment history display |

**Key Validations:**
- Settlement calculation accuracy
- Payment tracking
- Balance updates
- Settlement history

## Test Helpers and Utilities

### File: `utils/testHelpers.ts`

**Purpose:** Shared test utilities and data generation

**Key Functions:**

```typescript
// Generate random test user
generateTestData(): {
  name: string;
  email: string;
  password: string;
  groupName: string;
}

// Wait with delay
delay(ms: number): Promise<void>

// Retry logic for flaky operations
retryAsync(
  fn: () => Promise<any>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<any>
```

**Dynamic Data Generation:**
```typescript
const testData = generateTestData();
// Returns: {
//   name: "User_1702123456789",
//   email: "test_1702123456789@example.com",
//   password: "Test@Password123!",
//   groupName: "Group_1702123456789"
// }
```

**Benefits:**
- Unique test data (prevents conflicts)
- Timestamp-based isolation
- Reusable across test suites
- Consistent test data format

## Execution Modes

### Development Mode (Headless)

```bash
cd playwright-tests
npm run test
```

**Features:**
- Fast parallel execution
- No browser UI displayed
- Optimal for local development
- Suitable for CI/CD pipelines

**Output:**
- Terminal summary
- Test status per test
- Failed test details
- Duration and statistics

### Headed Mode (Visual Testing)

```bash
npm run test:headed
```

**Features:**
- Browser window visible
- Real-time test execution
- Useful for debugging
- Visual verification
- Step-by-step observation

**Use Cases:**
- Debugging failing tests
- Visual regression checks
- Feature verification
- Training and documentation

### Debug Mode (Interactive)

```bash
npm run test:debug
```

**Features:**
- Playwright Inspector opens
- Step-through execution
- Pause/resume capability
- Evaluate JavaScript in context
- Inspect DOM elements

**Developer Tools:**
- Step through test
- Watch/evaluate expressions
- Console execution
- Page inspector
- Network monitoring

### Browser-Specific Testing

```bash
npm run test:chromium   # Chrome/Chromium
npm run test:firefox    # Firefox
npm run test:webkit     # Safari/WebKit
npm run test:mobile     # Mobile Chrome
npm run test:all-browsers # All projects
```

**Cross-Browser Benefits:**
- Compatibility validation
- Browser-specific bugs detection
- Rendering differences check
- Mobile responsiveness

### Production Testing

```bash
npm run test:prod       # Headless against production
npm run test:prod:headed # Headed against production
```

**Configuration:**
- Base URL: `https://splitbill-app-jygd.onrender.com`
- Real API: `https://splitbill-api2.onrender.com`
- Full end-to-end validation

## Test Reporting

### Report Types

#### 1. **HTML Report** (Interactive)

```bash
npm run report
```

**Location:** `./reports/index.html`

**Features:**
- Interactive test results
- Screenshot/video playback
- Test timing details
- Failed test details
- Trace viewer for failures

**Accessibility:**
- Open in any browser
- No server required
- Share via file
- Archive for records

#### 2. **JSON Report** (Machine Readable)

**Location:** `./reports/test-results.json`

**Schema:**
```json
{
  "config": { /* playwright config */ },
  "stats": {
    "expected": 20,
    "unexpected": 0,
    "flaky": 0,
    "skipped": 0,
    "duration": 125000
  },
  "tests": [
    {
      "testId": "AUTH-001",
      "title": "User Registration",
      "status": "passed",
      "duration": 5000,
      "location": "auth.spec.ts"
    }
  ]
}
```

#### 3. **JUnit Report** (CI/CD Integration)

**Location:** `./reports/junit.xml`

**Usage:**
- Jenkins integration
- GitLab CI
- GitHub Actions
- Azure DevOps

## MCP Server Integration

### File: `mcp-server/src/index.js`

**Purpose:** Claude-based test orchestration and management

**Architecture:**
- Tool-based interface for test management
- Agentic loop for intelligent test execution
- Dynamic error handling
- Report analysis and insights

### Available Tools

#### 1. **run_ui_tests**

```json
{
  "name": "run_ui_tests",
  "mode": "headless|headed|debug",
  "project": "chromium|firefox|webkit|Mobile Chrome"
}
```

**Execution:**
- Starts Playwright test runner
- Captures stdout/stderr
- Waits for completion
- Returns success/failure

#### 2. **get_test_report**

```json
{
  "name": "get_test_report"
}
```

**Returns:**
- Latest test results
- Statistics and metrics
- Individual test details
- Failure reasons

#### 3. **list_tests**

```json
{
  "name": "list_tests"
}
```

**Returns:**
- All test files
- Test count per suite
- Test ID and description
- Organized by category

#### 4. **get_test_metrics**

```json
{
  "name": "get_test_metrics"
}
```

**Returns:**
```json
{
  "totalTests": 20,
  "passedTests": 20,
  "failedTests": 0,
  "successRate": "100.0%",
  "durationMs": 125000,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Usage Example

```bash
npm install
npm run start
```

**Agentic Conversation:**
```
User: "Run the UI tests in headed mode to verify the application"