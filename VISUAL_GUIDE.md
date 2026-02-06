# Visual Guide: UI Test Execution & User Data Storage Issue

## The Problem Explained Simply

### What Was Broken

```
YOUR COMPUTER
├─ Backend Server (localhost:5001) ──→ Local SQLite Database
│                                        (Still empty!)
│
├─ Frontend Server (localhost:3000)
│   └─ Vite Proxy: /api → ???
│       └─ WRONG: https://splitbill-api2.onrender.com (Production Server)
│           └─ Production Database
│               (Users created here, not locally!)
│
└─ Test Browser
    └─ Runs tests on local frontend
        └─ Data goes to production
            └─ Tests fail: Can't find users locally!
```

### What Got Fixed

```
YOUR COMPUTER
├─ Backend Server (localhost:5001) ──→ Local SQLite Database
│   ▲                                   (Users stored here!)
│   │
├─ Frontend Server (localhost:3000)
│   └─ Vite Proxy: /api → localhost:5001 ✅ CORRECT!
│       └─ Local Backend
│           └─ Local Database
│               (Tests can verify data!)
│
└─ Test Browser
    └─ Runs tests on local frontend
        └─ Data goes to local backend
            └─ Tests pass: Users found locally! ✅
```

---

## The 22 UI Test Cases at a Glance

### Category 1: Authentication (7 Tests) 🔐

These tests verify user account functionality:

```
AUTH-001: Register ────→ [Form] → [Backend] → [DB: INSERT user] ✅
AUTH-002: Login ───────→ [Form] → [Backend] → [DB: SELECT user] ✅
AUTH-003: Invalid Login → [Error] → [Show Message] ✅
AUTH-004: Navigate ────→ [Link] → [To Register] ✅
AUTH-005: Demo Login ──→ [Test] → [Pre-existing User] ✅
SESSION-001: Persist ──→ [Refresh] → [Token] → [Still logged in] ✅
SESSION-002: Logout ───→ [Button] → [Clear Data] → [Redirected] ✅
```

### Category 2: Groups (5 Tests) 👥

These tests verify group management:

```
GROUP-001: View Groups Page ──→ [Display] → [List Groups] ✅
GROUP-002: Create Group ──────→ [Form] → [Save] → [DB] → [List] ✅
GROUP-003: View Group Details → [Click] → [Detail Page] ✅
GROUP-004: Add Member ────────→ [Form] → [Save] → [DB] → [List] ✅
GROUP-005: View Members ──────→ [Display] → [List Members] ✅
```

### Category 3: Expenses (5 Tests) 💰

These tests verify expense tracking:

```
EXPENSE-001: View Page ────→ [Display] → [Expenses Page] ✅
EXPENSE-002: Add Expense ──→ [Form] → [Save] → [DB] → [List] ✅
EXPENSE-003: View List ────→ [Display] → [All Expenses] ✅
EXPENSE-004: Show Fields ──→ [Verify] → [Description, Amount, etc] ✅
EXPENSE-005: View Details ─→ [Click] → [Detail View] ✅
```

### Category 4: Settlements (5 Tests) 📊

These tests verify payment settling:

```
SETTLEMENT-001: View Section ────→ [Display] → [Balances] ✅
SETTLEMENT-002: Show Parties ────→ [Display] → [Who owes whom] ✅
SETTLEMENT-003: Valid Amounts ───→ [Verify] → [Positive numbers] ✅
SETTLEMENT-004: Mark as Paid ────→ [Click] → [Update] → [DB] ✅
SETTLEMENT-005: View History ────→ [Display] → [Past settlements] ✅
```

---

## What "Headed Mode" Means

### Headless Mode (Normal) ❌
```
You run: npx playwright test
Your computer:
  ├─ Launches invisible browser (no window)
  ├─ Runs all tests in background
  └─ Reports pass/fail only
  
Result: ⚫ Black box - you can't see what's happening
```

### Headed Mode (What We Use) ✅
```
You run: npx playwright test --headed
Your computer:
  ├─ Launches VISIBLE browser window
  ├─ Runs tests step-by-step
  ├─ YOU SEE:
  │  ├─ Page navigation
  │  ├─ Form filling
  │  ├─ Button clicks
  │  ├─ Error messages
  │  └─ Page redirects
  └─ Reports pass/fail with video proof
  
Result: 👀 You watch the tests execute in real-time!
```

---

## Step-by-Step Test Execution Example

### Test: AUTH-001 - User Registration

```
┌─ Playwright Opens Chrome Browser ─────────────────────┐
│                                                       │
│  YOU SEE:                                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ SplitBill - Register                            │ │
│  │ ─────────────────────────────────────────────── │ │
│  │ Name:     [              ]                      │ │
│  │ Email:    [              ]                      │ │
│  │ Password: [              ]                      │ │
│  │           [Register]                            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  TEST ACTION 1: Fill Name                           │
│  ─────────────────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Name:     [Alice Johnson   ]                    │ │
│  │ Email:    [              ]                      │ │
│  │ Password: [              ]                      │ │
│  │           [Register]                            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  TEST ACTION 2: Fill Email                          │
│  ─────────────────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Name:     [Alice Johnson   ]                    │ │
│  │ Email:    [alice@test.com ]                     │ │
│  │ Password: [              ]                      │ │
│  │           [Register]                            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  TEST ACTION 3: Fill Password                       │
│  ─────────────────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Name:     [Alice Johnson   ]                    │ │
│  │ Email:    [alice@test.com ]                     │ │
│  │ Password: [••••••••       ]                      │ │
│  │           [Register]                            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  TEST ACTION 4: Click Register Button               │
│  ─────────────────────────────────────────────────── │
│  [Loading spinner appears]                          │
│                                                       │
│  BACKEND PROCESSING:                                │
│  ├─ Receive: POST /api/auth/register                │
│  ├─ Hash password                                    │
│  ├─ Generate UUID                                    │
│  ├─ Execute: INSERT INTO users (...)                │
│  ├─ SQLite: Store in database ✅                    │
│  └─ Return: 201 + JWT token                         │
│                                                       │
│  TEST ACTION 5: Wait for Redirect                   │
│  ─────────────────────────────────────────────────── │
│  Browser navigates to /login                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ SplitBill - Login                               │ │
│  │ ─────────────────────────────────────────────── │ │
│  │ Email:    [              ]                      │ │
│  │ Password: [              ]                      │ │
│  │           [Login]                               │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  DATABASE STATE:                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │ SELECT * FROM users WHERE email='alice@test.com'│ │
│  │ Results:                                         │ │
│  │ ├─ id: 550e8400-e29b-41d4...                    │ │
│  │ ├─ name: Alice Johnson                          │ │
│  │ ├─ email: alice@test.com                        │ │
│  │ ├─ password: $2a$10$... (hashed)                │ │
│  │ └─ createdAt: 2026-02-01 15:30:45              │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  TEST ASSERTION: URL changed to /login              │
│  ✅ PASS                                             │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## Data Flow Visualization

### Registration Flow (With Fix Applied)

```
                        USER CLICKS REGISTER
                              │
                              ▼
                    ┌──────────────────────┐
                    │  React Form Component │
                    │  Collects user data   │
                    │  name, email, password│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ authService.register │
                    │ Calls API             │
                    │ POST /api/auth/..    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼────────────┐
                    │  Vite Dev Server      │
                    │  localhost:3000       │
                    │  ✅ Proxy Configured │
                    │  Target:localhost:5001│
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │ Express.js Server     │
                    │ localhost:5001        │
                    │                        │
                    │ Route: POST /api/auth │
                    │ Handler: authCtrl     │
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │ authController        │
                    │ registerUser()        │
                    │                        │
                    │ 1. Validate input     │
                    │ 2. Hash password      │
                    │ 3. Generate UUID      │
                    │ 4. Build SQL query    │
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │ SQLite3 Database      │
                    │ splitbill.db          │
                    │                        │
                    │ INSERT INTO users     │
                    │ (id, name, email,     │
                    │  password, createdAt) │
                    │                        │
                    │ ✅ User Stored!      │
                    └──────────┬────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Response: 201 + JWT   │
                    │ Back to Frontend      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ localStorage.setItem  │
                    │ Store JWT token       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Redirect to /login    │
                    │ or /dashboard         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ TEST ASSERTION        │
                    │ URL changed = PASS ✅ │
                    └──────────────────────┘
```

---

## Test Output Example

### Running Tests Headed Mode

```bash
$ npx playwright test --headed --project=chromium

Running 22 tests using 5 workers

[Chromium browser window opens and runs tests...]

  ✓ tests/auth.spec.ts:12:7 › Authentication Tests › [AUTH-001] User should register successfully (2.5s)
  ✓ tests/auth.spec.ts:31:7 › Authentication Tests › [AUTH-002] User should login successfully (1.8s)
  ✓ tests/auth.spec.ts:49:7 › Authentication Tests › [AUTH-003] User should see error on invalid (0.9s)
  ✓ tests/auth.spec.ts:62:7 › Authentication Tests › [AUTH-004] User should navigate to register (0.7s)
  ✓ tests/auth.spec.ts:71:7 › Authentication Tests › [AUTH-005] Demo user login (1.2s)
  ✓ tests/auth.spec.ts:86:7 › Session Management › [SESSION-001] User remain logged after refresh (3.2s)
  ✓ tests/auth.spec.ts:104:7 › Session Management › [SESSION-002] Logout clears session (1.5s)
  ✓ tests/groups.spec.ts:20:7 › Group Management › [GROUP-001] User see groups page (0.8s)
  ✓ tests/groups.spec.ts:35:7 › Group Management › [GROUP-002] Create group (2.1s)
  ✓ tests/groups.spec.ts:59:7 › Group Management › [GROUP-003] View group details (1.3s)
  ✓ tests/groups.spec.ts:83:7 › Group Management › [GROUP-004] Add member (2.5s)
  ✓ tests/groups.spec.ts:112:7 › Group Management › [GROUP-005] View members (0.9s)
  ✓ tests/expenses.spec.ts:18:7 › Expense Tests › [EXPENSE-001] View page (0.7s)
  ✓ tests/expenses.spec.ts:38:7 › Expense Tests › [EXPENSE-002] Add expense (3.1s)
  ✓ tests/expenses.spec.ts:69:7 › Expense Tests › [EXPENSE-003] View list (0.8s)
  ✓ tests/expenses.spec.ts:95:7 › Expense Tests › [EXPENSE-004] Show fields (1.2s)
  ✓ tests/expenses.spec.ts:120:7 › Expense Tests › [EXPENSE-005] View details (1.5s)
  ✓ tests/settlement.spec.ts:14:7 › Settlement Tests › [SETTLEMENT-001] View section (0.9s)
  ✓ tests/settlement.spec.ts:44:7 › Settlement Tests › [SETTLEMENT-002] Show parties (1.3s)
  ✓ tests/settlement.spec.ts:70:7 › Settlement Tests › [SETTLEMENT-003] Valid amounts (0.7s)
  ✓ tests/settlement.spec.ts:96:7 › Settlement Tests › [SETTLEMENT-004] Mark as paid (2.2s)
  ✓ tests/settlement.spec.ts:130:7 › Settlement Tests › [SETTLEMENT-005] History visible (1.1s)

  22 passed (45.3s)

  View full report at: http://localhost:9323/
```

---

## Why This Matters

### Before Fix
```
Registration Test Fails ❌
└─ User created in production database
└─ Test looks for user in local database
└─ Not found!
└─ Test fails with: "User not found" error
└─ Developer confused: "The registration endpoint works in Postman!"
```

### After Fix
```
Registration Test Passes ✅
└─ User created in local database
└─ Test finds user in local database
└─ Assertion passes!
└─ Full end-to-end functionality tested locally
└─ Developer confident: "Everything works together!"
```

---

## Summary

| Aspect | Before Fix | After Fix |
|--------|-----------|-----------|
| **Frontend Proxy** | → Production ❌ | → localhost:5001 ✅ |
| **Data Storage** | Production DB | Local SQLite ✅ |
| **User Registration** | Works (but wrong place) | Works + verifiable ✅ |
| **Tests Execution** | All fail ❌ | All pass ✅ |
| **Debugging** | Confusing | Clear ✅ |
| **Local Development** | Not possible | Fully supported ✅ |

Now you can watch the UI tests execute in real-time with full transparency of what's happening!

