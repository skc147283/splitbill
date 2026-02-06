# Configuration Changes Applied

## Change 1: Fixed Vite Frontend Proxy Configuration

### File: `client/vite.config.ts`

#### BEFORE (❌ Wrong - Points to Production)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://splitbill-api2.onrender.com',  // ❌ PRODUCTION SERVER!
        changeOrigin: true,
      },
    },
  },
})
```

**Problem:** When frontend runs on localhost:3000, all API calls to `/api/*` are forwarded to the production server, not the local backend.

#### AFTER (✅ Correct - Points to Local Backend)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',  // ✅ LOCAL BACKEND!
        changeOrigin: true,
      },
    },
  },
})
```

**Solution:** Now all API calls are proxied to the local development backend server running on port 5001.

---

## Change 2: Fixed Playwright Test Base URL

### File: `playwright-tests/playwright.config.ts`

#### BEFORE (❌ Wrong - Points to Production)
```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://splitbill-app-jygd.onrender.com',  // ❌ PRODUCTION!
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // ... rest of config
});
```

**Problem:** Tests navigated to production frontend, which itself proxied to production backend. Local development server and database were never tested.

#### AFTER (✅ Correct - Points to Local Frontend)
```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',  // ✅ LOCAL FRONTEND!
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // ... rest of config
});
```

**Solution:** Tests now navigate to local frontend on localhost:3000, which proxies to local backend, which uses local SQLite database.

---

## Impact Analysis

### Request Flow BEFORE Fix

```
Test Browser
    ↓
    └─→ http://localhost:3000 ❌ Wrong baseURL config
            ↓
            └─→ /api calls proxied to production ❌
                    ↓
                    └─→ https://splitbill-api2.onrender.com/api
                            ↓
                            └─→ Production Database ❌
                                    ↓
                                    └─→ User created on production only!
                                        Local DB still empty!
```

### Request Flow AFTER Fix

```
Test Browser
    ↓
    └─→ http://localhost:3000 ✅ Correct baseURL
            ↓
            └─→ /api calls proxied to local backend ✅
                    ↓
                    └─→ http://localhost:5001/api
                            ↓
                            └─→ Express Server ✅
                                    ↓
                                    └─→ SQLite Database (splitbill.db) ✅
                                            ↓
                                            └─→ User created locally!
                                                Tests can verify it!
```

---

## Why User Creation Was Failing

### Scenario: Test Creates User "john@example.com"

#### BEFORE Fix Flow

```
1. Test calls: authService.register('john@example.com', 'test123', 'John')

2. Frontend (localhost:3000) sends:
   POST /api/auth/register
   
3. Vite Proxy intercepts:
   Route to: https://splitbill-api2.onrender.com/api/auth/register

4. Production Server processes request:
   - Validates email/password
   - Generates UUID
   - Inserts into PRODUCTION database
   - Returns 201 + token

5. Test receives success response
   → Test thinks it worked! ✓

6. Test tries to login with same user:
   POST /api/auth/login
   
7. Vite Proxy again routes to production
   Production database has the user
   Login succeeds ✓

BUT when test runs on LOCAL server:
   POST http://localhost:5001/api/auth/login
   Local SQLite database is EMPTY
   Login fails! ❌

PROBLEM: Registration and login in tests used DIFFERENT servers!
```

#### AFTER Fix Flow

```
1. Test calls: authService.register('john@example.com', 'test123', 'John')

2. Frontend (localhost:3000) sends:
   POST /api/auth/register
   
3. Vite Proxy intercepts:
   Route to: http://localhost:5001/api/auth/register

4. Local Backend processes request:
   - Validates email/password
   - Generates UUID
   - Inserts into LOCAL SQLite database ✅
   - Returns 201 + token

5. Test receives success response

6. Test tries to login with same user:
   POST /api/auth/login
   
7. Vite Proxy routes to localhost:5001
   Local SQLite database HAS the user
   Login succeeds ✅

✅ CONSISTENT! Both calls use same backend and database!
```

---

## Database Storage Verification

### Check the Database After Fix

```bash
# Install sqlite3 if needed:
# brew install sqlite3

# Navigate to server directory:
cd /Users/sureshkc/Desktop/demo/SplitBill/server

# Connect to database:
sqlite3 splitbill.db

# View all users:
sqlite> SELECT id, name, email, createdAt FROM users;
```

### Expected Output After Registration

```
┌──────────────────────────────────────┬────────────┬─────────────────┬───────────────────────────┐
│ id                                   │ name       │ email           │ createdAt                 │
├──────────────────────────────────────┼────────────┼─────────────────┼───────────────────────────┤
│ 550e8400-e29b-41d4-a716-446655440000 │ John Smith │ john@example.com│ 2026-02-01 15:30:45      │
│ 550e8400-e29b-41d4-a716-446655440001 │ Jane Doe   │ jane@example.com│ 2026-02-01 15:31:22      │
└──────────────────────────────────────┴────────────┴─────────────────┴───────────────────────────┘
```

If you see users here, the fix worked! ✅

---

## Startup Procedure (Correct Order)

### Terminal 1: Start Backend Server
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/server
npm run dev

# Expected Output:
# Database initialized successfully
# SplitBill server is running on http://localhost:5001
```

### Terminal 2: Start Frontend Server
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/client
npm run dev

# Expected Output:
# VITE v5.4.21  ready in 102 ms
# ➜  Local:   http://localhost:3000/
```

### Terminal 3: Run Tests
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests

# First time only - Install browsers:
npx playwright install

# Run tests with headed mode:
npx playwright test --headed --project=chromium

# Or run specific test:
npx playwright test auth.spec.ts --headed
```

---

## Network Request Tracing

### How to Verify API Calls Are Going to Correct Server

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Register a new user**
4. **Look for requests to `/api/auth/register`**
5. **Check Request URL column:**
   - ✅ Should show: `http://localhost:3000/api/auth/register`
   - ❌ Should NOT show: `https://splitbill-api2.onrender.com/api/auth/register`

### If You Still See Production URL

Your frontend server is still running with the old config. 

**Fix:** 
1. Stop frontend server (Ctrl+C)
2. Make sure `client/vite.config.ts` has the correct config
3. Start frontend again with `npm run dev`
4. Vite caches config on startup

---

## Checklist for Verification

- [ ] Backend server running on http://localhost:5001
- [ ] Frontend server running on http://localhost:3000
- [ ] `client/vite.config.ts` has `target: 'http://localhost:5001'`
- [ ] `playwright-tests/playwright.config.ts` has `baseURL: 'http://localhost:3000'`
- [ ] Can register user via UI
- [ ] User appears in SQLite database
- [ ] Can login with registered user
- [ ] Can run tests with `npx playwright test --headed`
- [ ] See browser window executing tests
- [ ] All 22 tests pass (or at least AUTH tests pass)

---

## Timeline Summary

| Stage | Config | Database | Result |
|-------|--------|----------|--------|
| **Before Fix** | Production URLs | Production DB | Tests fail, data not stored locally |
| **After Fix** | Localhost URLs | Local SQLite | Tests pass, data stored locally |

**The key insight:** Configuration determines which database is used!

