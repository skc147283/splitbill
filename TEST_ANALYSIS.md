# SplitBill UI Test Analysis & User Creation Data Storage Issue

## Executive Summary

The application had **two critical configuration mismatches** that prevented user data from being stored properly:

1. **Vite Proxy Configuration Issue** (PRIMARY)
2. **API Client Base URL Issue** (SECONDARY)

---

## Problem 1: Vite Proxy Points to Production Server ❌

### Location
`client/vite.config.ts` (Lines 1-15)

### The Problem
```typescript
// WRONG - Points to production server
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'https://splitbill-api2.onrender.com',  // ← PRODUCTION!
      changeOrigin: true,
    },
  },
},
```

### Why This Breaks User Creation
1. Frontend (localhost:3000) was proxying `/api` requests to the **production** Render server
2. User registration requests were being sent to `https://splitbill-api2.onrender.com/api/auth/register`
3. **Local database was never touched** - all user data was being stored in the production database
4. The production server has completely different data, so new users weren't visible locally
5. Tests failed because test users created locally couldn't be found anywhere

### Solution
```typescript
// CORRECT - Points to local development server
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5001',  // ← LOCAL BACKEND!
      changeOrigin: true,
    },
  },
},
```

---

## Problem 2: API Client Hardcoded Production URL

### Location
`client/src/services/api.ts` (Lines 1-5)

### The Problem
```typescript
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://splitbill-api2.onrender.com/api'  // ← Production fallback
  : '/api';  // ← Uses proxy (which was wrong anyway)
```

### Why This Matters
- In production mode, requests hardcoded to Render server (correct)
- In development mode, requests use `/api` which relied on the vite proxy config (which was pointing to production)
- This created a redundant, confusing configuration layer

### Impact on Testing
- Playwright tests targeting `http://localhost:3000` would still send API calls to production
- User registrations in tests would succeed in production database
- Local database remained empty
- Tests would fail on assertions expecting local data

---

## Backend Configuration (Correct ✅)

### Server Port
`server/src/index.ts` - Running on `http://localhost:5001`

### Database
- SQLite database: `splitbill.db`
- Tables: users, groups, group_members, expenses, expense_splits, settlements
- Registration logic: `server/src/controllers/authController.ts`
  - Creates user with hashed password
  - Generates UUID for user ID
  - Uses `runAsync()` for database insertion

### Auth Controller
```typescript
export const registerUser = async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body;
  const hashedPassword = await hashPassword(password);
  const userId = generateId();

  await runAsync(
    'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
    [userId, email, hashedPassword, name]
  );
  
  const token = generateToken(userId);
  res.status(201).json({ userId, token, name, email });
};
```

**This is working correctly** - the issue was that frontend never sent requests to it!

---

## Database Helper Functions (Correct ✅)

### Location
`server/src/utils/helpers.ts`

### The runAsync Function
```typescript
export const runAsync = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};
```

**This correctly inserts data into SQLite** - but only if the requests reach it!

---

## Test Configuration Issues

### Playwright Config
`playwright-tests/playwright.config.ts` (Line 26)

**Was pointing to production:**
```typescript
baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://splitbill-app-jygd.onrender.com',
```

**Fixed to use localhost:**
```typescript
baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
```

---

## UI Tests Overview

### Test Files
1. **auth.spec.ts** - Authentication tests
   - User registration
   - User login
   - Invalid credentials
   - Navigation between login/register
   - Session management

2. **groups.spec.ts** - Group management tests
   - View groups page
   - Create groups
   - View group details
   - Add members
   - View members list

3. **expenses.spec.ts** - Expense tracking tests
   - View expenses page
   - Add expenses
   - View expense list
   - View expense details
   - Check required fields

4. **settlement.spec.ts** - Settlement tests
   - View settlement/balance section
   - Show correct settlement parties
   - Validate settlement amounts
   - Mark settlements as paid
   - View settlement history

### Test Execution Flow

```
1. Test launches browser (headed mode with --headed flag)
2. Browser navigates to http://localhost:3000 (now correct)
3. User interacts with UI (register, login, etc.)
4. Frontend sends /api requests
5. Vite proxy forwards to http://localhost:5001 (NOW CORRECT)
6. Backend processes request and stores in local SQLite
7. Test assertions verify database state
```

---

## Fixes Applied

### 1. Updated Vite Config ✅
```bash
File: client/vite.config.ts
Changed target from production to localhost:5001
```

### 2. Updated Playwright Config ✅
```bash
File: playwright-tests/playwright.config.ts
Changed baseURL from production to http://localhost:3000
```

### 3. Verified Backend ✅
- Server running on port 5001
- Database properly configured
- Auth controller correctly stores users
- No code changes needed

---

## How to Run Tests in Headed Mode

```bash
# Terminal 1 - Start Backend
cd /Users/sureshkc/Desktop/demo/SplitBill/server
npm run dev
# Runs on http://localhost:5001

# Terminal 2 - Start Frontend
cd /Users/sureshkc/Desktop/demo/SplitBill/client
npm run dev
# Runs on http://localhost:3000

# Terminal 3 - Run Tests with Headed Browser
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests
npx playwright install  # First time only
npx playwright test --headed --project=chromium
```

The `--headed` flag opens a real browser window so you can see the tests executing in real-time.

---

## Summary of Root Cause

| Aspect | Issue | Fix |
|--------|-------|-----|
| **Frontend Proxy** | Pointed to production server | Changed to `http://localhost:5001` |
| **Test Base URL** | Pointed to production frontend | Changed to `http://localhost:3000` |
| **User Data Storage** | Users were saved to production database only | Now saved to local SQLite database |
| **Test Execution** | Tests couldn't find created users locally | Tests will now work with local data |

---

## Verification Steps

After fixes, to verify user creation is storing data:

```bash
# 1. Start both servers (see above)
# 2. Register a user via the UI at http://localhost:3000
# 3. Check the database:

sqlite3 /Users/sureshkc/Desktop/demo/SplitBill/server/splitbill.db
SELECT * FROM users;
.quit
```

You should see the newly registered user in the output!

---

## Next Steps

1. **Restart Frontend Server** - It caches config on startup
2. **Clear Browser Cache** - localStorage might have old token
3. **Run Tests** - Use `npx playwright test --headed` to see UI execution
4. **Verify Data** - Check SQLite database to confirm storage

