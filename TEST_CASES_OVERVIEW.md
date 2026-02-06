# SplitBill UI Test Cases - Comprehensive Overview

## Test Execution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Playwright Test Runner                        │
│                   (with --headed flag)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Real Browser Window (Chrome/Firefox/Safari)              │
│         Fully Visible - See Tests Execute Live!                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│      Frontend (React + Vite) http://localhost:3000              │
│                   ↓ (makes /api calls)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  Vite Proxy             │
              │  /api → [FIXED]         │
              │  http://localhost:5001  │
              └────────────┬────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│    Backend (Express) http://localhost:5001                      │
│    - Processes requests                                          │
│    - Executes database operations                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         SQLite Database (splitbill.db)                          │
│    - users (NOW STORES REGISTERED USERS!)                       │
│    - groups                                                      │
│    - expenses                                                    │
│    - settlements                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Test Suite Structure

### File: tests/auth.spec.ts (7 Tests)

#### [AUTH-001] User should register successfully
```
Steps:
1. Navigate to register page
2. Fill in: name, email, password
3. Click register button
4. Wait for success and redirect
5. Verify URL changed to login/dashboard/groups
```

#### [AUTH-002] User should login successfully  
```
Steps:
1. Navigate to login page
2. Enter email and password
3. Click login button
4. Wait for navigation
5. Verify redirected to groups/dashboard page
```

#### [AUTH-003] User should see error on invalid credentials
```
Steps:
1. Navigate to login page
2. Enter invalid@test.com + wrongpassword
3. Click login button
4. Verify error message appears or stay on login
```

#### [AUTH-004] Navigate to register from login
```
Steps:
1. Go to login page
2. Click "Don't have account? Register" link
3. Verify navigated to /register page
```

#### [AUTH-005] Demo user login (john@example.com)
```
Steps:
1. Login with demo credentials
2. Wait for navigation
3. Verify either logged in OR error (user may not exist)
```

#### [SESSION-001] Remain logged in after page refresh
```
Steps:
1. Login with credentials
2. Wait for navigation
3. Reload browser page (F5)
4. Verify still logged in (token in localStorage)
```

#### [SESSION-002] Logout clears session
```
Steps:
1. Login first
2. Click logout button
3. Verify redirected to login page
4. Verify localStorage token cleared
```

---

### File: tests/groups.spec.ts (5 Tests)

#### [GROUP-001] User should see groups page
```
Steps:
1. Login or navigate to groups page
2. Verify groups page loads
3. Verify page shows "Groups" heading
```

#### [GROUP-002] User should be able to create a group
```
Steps:
1. Navigate to groups page
2. Click "Create Group" button
3. Fill in group name
4. Click create button
5. Verify new group appears in list
```

#### [GROUP-003] User should view group details
```
Steps:
1. Click on a group in list
2. Verify group detail page loads
3. Verify group name and info displayed
```

#### [GROUP-004] User should add member to group
```
Steps:
1. Navigate to group details
2. Click "Add Member" button
3. Enter member email
4. Click add button
5. Verify member added to group members list
```

#### [GROUP-005] User should see members list in group
```
Steps:
1. View group details
2. Verify "Members" section visible
3. Verify list of current group members displayed
```

---

### File: tests/expenses.spec.ts (5 Tests)

#### [EXPENSE-001] User should see expenses page
```
Steps:
1. Login and navigate to group
2. Click "Expenses" or "View Expenses"
3. Verify expenses page loads
4. Verify page title/heading present
```

#### [EXPENSE-002] User should be able to add an expense
```
Steps:
1. Navigate to expenses page in group
2. Click "Add Expense" button
3. Fill in:
   - Description (e.g., "Pizza")
   - Amount (e.g., "50")
   - Paid by (select user)
   - Split among members
4. Click "Create Expense"
5. Verify expense added to list
```

#### [EXPENSE-003] User should see expenses list
```
Steps:
1. Navigate to group expenses
2. Verify list of expenses displayed
3. Verify each expense shows:
   - Description
   - Amount
   - Who paid
   - Date/time
```

#### [EXPENSE-004] Expense should have required fields displayed
```
Steps:
1. View an expense in list
2. Verify following fields visible:
   - Expense description
   - Total amount
   - "Paid by" person
   - Split details
```

#### [EXPENSE-005] User should be able to view expense details
```
Steps:
1. Click on an expense in list
2. Verify detail page loads
3. Verify all expense info displayed
4. Verify split breakdown shown
```

---

### File: tests/settlement.spec.ts (5 Tests)

#### [SETTLEMENT-001] User should see settlement/balance section
```
Steps:
1. Login and navigate to group
2. Look for "Settlements" or "Balances" section
3. Verify section is visible on page
4. Verify shows who owes whom
```

#### [SETTLEMENT-002] Settlement should show correct parties
```
Steps:
1. View settlements section
2. Verify each settlement shows:
   - "User A owes User B"
   - Amount to settle
3. Verify parties are correct based on expenses
```

#### [SETTLEMENT-003] Settlement amounts should be positive numbers
```
Steps:
1. View settlements in group
2. For each settlement, verify:
   - Amount > 0
   - Amount is a valid number
   - No negative values
```

#### [SETTLEMENT-004] User should be able to mark settlement as paid
```
Steps:
1. Find an unsettled balance
2. Click "Mark as Paid" button
3. Confirm payment dialog (if present)
4. Verify settlement removed or marked as paid
```

#### [SETTLEMENT-005] Settlement history should be visible
```
Steps:
1. Navigate to settlements
2. Verify "Settlement History" section
3. Verify past payments listed with:
   - From/To user
   - Amount
   - Date paid
```

---

## Test Statistics

| Category | Count | Status |
|----------|-------|--------|
| **Authentication Tests** | 7 | Ready to run |
| **Group Management Tests** | 5 | Ready to run |
| **Expense Tests** | 5 | Ready to run |
| **Settlement Tests** | 5 | Ready to run |
| **TOTAL** | 22 | All ready |

---

## Data Flow for User Registration Test (AUTH-001)

```
[TEST START]
    ↓
[1] Page navigates to http://localhost:3000/register
    ↓
[2] User fills form:
    - Name: "John Smith"
    - Email: "john.smith@test.com"
    - Password: "test123"
    ↓
[3] Form submitted to /api/auth/register
    ↓
[4] Vite Proxy intercepts:
    /api/auth/register → http://localhost:5001/api/auth/register
    ↓
[5] Backend receives at Express server:
    POST http://localhost:5001/api/auth/register
    ↓
[6] authController.registerUser() executes:
    - Validates input
    - Hashes password with bcrypt
    - Generates unique user ID (UUID)
    - Executes SQL INSERT:
      INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)
    ↓
[7] SQLite database stores user in splitbill.db
    ↓
[8] Server returns 201 response with JWT token
    ↓
[9] Frontend stores token in localStorage
    ↓
[10] Frontend navigates to login/dashboard
    ↓
[11] Test assertion verifies URL changed
    ↓
[TEST PASSED - User now in database! ✅]
```

---

## The Bug That Was Broken

### BEFORE FIX (What Was Happening)

```
[TEST: User Registration]
    ↓
[Frontend] Register at http://localhost:3000
    ↓
[Vite Proxy - WRONG CONFIG]
    /api → https://splitbill-api2.onrender.com ❌ PRODUCTION!
    ↓
[Production Server] Receives request
    ↓
[Production Database] User stored HERE
    ↓
[Local Database] Still empty! ❌
    ↓
[Test] Tries to login with registered user
    ↓
[Local Server] Can't find user (it's in production!)
    ↓
[TEST FAILS] ❌
```

### AFTER FIX (What Happens Now)

```
[TEST: User Registration]
    ↓
[Frontend] Register at http://localhost:3000
    ↓
[Vite Proxy - CORRECT CONFIG]
    /api → http://localhost:5001 ✅ LOCAL!
    ↓
[Local Server] Receives request
    ↓
[Local Database] User stored HERE ✅
    ↓
[Test] Tries to login with registered user
    ↓
[Local Server] Finds user! ✅
    ↓
[TEST PASSES] ✅
```

---

## Running Tests in Headed Mode

### Command
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests
npx playwright test --headed --project=chromium
```

### What You'll See
1. **Real browser window opens** (Chrome in this case)
2. **Test executes step by step** - you see every click, form fill, navigation
3. **Real-time feedback** - watch as registration succeeds
4. **Visual confirmation** - see user data being stored
5. **Each test shows** - what's being tested and what's expected

### Browser Output Visible in Headed Mode

```
Time: 0s
├─ Navigate to http://localhost:3000/register
│  └─ Page loads, form visible
│
├─ Fill email: john@test.com
│  └─ Email field updated
│
├─ Fill password: test123
│  └─ Password field masked
│
├─ Fill name: John Test
│  └─ Name field updated
│
├─ Click Register Button
│  └─ Form submitted
│  └─ Network request: POST /api/auth/register
│  └─ Backend processes...
│  └─ Response: 201 Created + JWT
│
├─ Wait for navigation
│  └─ Page redirects to login/dashboard
│
└─ Assert URL changed
   └─ PASS ✅
```

---

## Verification After Fixes

### Check 1: Backend Running
```bash
curl http://localhost:5001/api/health
# Should return: {"status":"ok"}
```

### Check 2: Frontend Proxy Correct
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test","name":"Test"}'
# Should reach localhost:5001
```

### Check 3: User Stored in Database
```bash
sqlite3 /Users/sureshkc/Desktop/demo/SplitBill/server/splitbill.db
SELECT COUNT(*) FROM users;
# Should return increasing count as tests register users
```

---

## Why Tests Were Failing Before

1. ❌ Frontend config pointed to production server
2. ❌ Users created in production database only
3. ❌ Local database stayed empty
4. ❌ Tests couldn't find created users locally
5. ❌ Tests failed on assertions

## Why Tests Will Pass Now

1. ✅ Frontend config points to local server (localhost:5001)
2. ✅ Users created in local database
3. ✅ Tests find created users locally
4. ✅ Tests can verify data persistence
5. ✅ Tests can verify authentication flow

---

## Summary

**The Root Cause:** Configuration mismatch in `client/vite.config.ts`
**The Fix:** Changed proxy target from production URL to `http://localhost:5001`
**The Result:** User data now persists in local database and tests can verify it

Now you can run `npx playwright test --headed` and watch the tests execute in a real browser while data is properly stored locally!

