# SplitBill Test Automation Suite

Comprehensive automated test suite for validating SplitBill application functionality across all business use cases.

## Features

✅ **User Management Testing**
- User registration
- User login
- Profile verification

✅ **Group Management Testing**
- Group creation
- Add members to group
- Retrieve group details

✅ **Expense Tracking Testing**
- Add expenses with equal splits
- Add expenses with custom splits
- Retrieve expense list
- Validate expense calculations

✅ **Settlement Testing**
- Calculate balances between users
- Record settlement payments
- Track payment status

✅ **Automated Reporting**
- Detailed test results
- Assertion-level validation
- HTML and JSON reports
- Success rate metrics

## Directory Structure

```
tests/
├── fixtures/          # Test data (users, groups, expenses)
├── scenarios/         # Individual test cases
├── utils/            # Utility functions and validators
├── reports/          # Generated test reports
├── runTests.ts       # Main test runner
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript config
```

## Setup

### 1. Install Dependencies

```bash
cd tests
npm install
```

### 2. Set Environment Variables (Optional)

```bash
# For production (Render)
export API_URL=https://splitbill-api2.onrender.com/api

# For local development
export API_URL=http://localhost:5000/api
```

## Running Tests

### Run Against Production (Render)
```bash
npm run test:prod
```

### Run Against Local Development
```bash
npm run test:dev
```

### Run With Default API
```bash
npm run test
```

### Watch Mode (Auto-run on changes)
```bash
npm run test:watch
```

## Test Scenarios

### 1. **User Management** 
Tests user registration, login, and profile retrieval
- ✅ Register 3 test users
- ✅ Login with each user
- ✅ Verify user profiles

### 2. **Group Management**
Tests group creation and member management
- ✅ Create a new group
- ✅ Add members to group
- ✅ Retrieve group details
- ✅ List user's groups

### 3. **Expense Tracking**
Tests expense creation with different split types
- ✅ Add equal split expenses
- ✅ Add custom split expenses
- ✅ Retrieve expense list
- ✅ Validate amounts

### 4. **Settlement**
Tests balance calculations and payment recording
- ✅ Calculate who owes whom
- ✅ Record settlement payments
- ✅ Verify balance updates

## Test Data

All test data is defined in the `fixtures/` folder:

### `testUsers.json`
- Alice (alice@test.com)
- Bob (bob@test.com)
- Charlie (charlie@test.com)

### `testGroups.json`
- Trip to Vegas (3 members)
- Roommate Expenses (2 members)

### `testExpenses.json`
- Restaurant: $300 (equal 3-way)
- Hotel: $600 (equal 3-way)
- Gas: $120 (equal 2-way)
- Rent: $2000 (equal 2-way)

## Test Results

After running tests, you'll see:
- Console output with pass/fail status
- Detailed assertion results
- Summary statistics
- JSON report in `reports/` folder
- Log entries in `reports/reports.log`

### Sample Report

```
═══════════════════════════════════════════════════════════════
                      TEST REPORT SUMMARY                       
═══════════════════════════════════════════════════════════════
Total Tests:        4
Passed:             4 ✓
Failed:             0 ✗
Success Rate:       100.00%
Total Assertions:   28
Passed Assertions:  28
Failed Assertions:  0
Total Duration:     5234ms
═══════════════════════════════════════════════════════════════
```

## File Structure

```
tests/
├── fixtures/
│   ├── testUsers.json          # User data for testing
│   ├── testGroups.json         # Group data for testing
│   └── testExpenses.json       # Expense data for testing
│
├── scenarios/
│   ├── userManagement.ts       # User registration/login tests
│   ├── groupManagement.ts      # Group creation/member tests
│   ├── expenseTracking.ts      # Expense creation tests
│   └── settlement.ts           # Settlement/balance tests
│
├── utils/
│   ├── apiClient.ts            # API client with all endpoints
│   └── testValidator.ts        # Assertion and reporting utilities
│
├── reports/
│   ├── test-report-*.json      # Individual test reports
│   └── reports.log             # Summary log of all test runs
│
├── runTests.ts                 # Main test runner
├── package.json                # NPM dependencies
└── tsconfig.json              # TypeScript configuration
```

## API Endpoints Tested

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - List user's groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/members` - Add member to group

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - List expenses

### Settlements
- `GET /api/settlements` - Get balances
- `POST /api/settlements` - Record payment

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Ensure API server is running and `API_URL` is correct

### Assertion Failures
Check the console output for which assertions failed and why. Look at the `expected` vs `actual` values.

### Test Data Issues
If tests fail due to data conflicts (users already exist), you'll need to either:
1. Use different email addresses in fixtures
2. Clear the database on the backend
3. Use a fresh test instance

## Next Steps

### MCP Server Integration (Future)
To integrate with MCP agents for automated test management:

```typescript
// Example: Create MCP server for test management
import { MCPServer } from "@modelcontextprotocol/sdk/server/index.js";

const server = new MCPServer({
  name: "splitbill-test-manager",
  version: "1.0.0",
});

// Register tools for running tests
server.tool("run-tests", { /* tool definition */ });
server.tool("get-test-report", { /* tool definition */ });
```

## Contributing

To add new tests:
1. Create scenario file in `scenarios/` folder
2. Import and call from `runTests.ts`
3. Add test data to appropriate fixture file
4. Run tests to validate

## Support

For issues or questions about the test suite, refer to the main SplitBill documentation.
