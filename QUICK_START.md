# Quick Reference: Running Tests & Verifying Fixes

## 30-Second Setup

### Terminal 1: Backend
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/server && npm run dev
# Output: SplitBill server is running on http://localhost:5001
```

### Terminal 2: Frontend  
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/client && npm run dev
# Output: ➜  Local:   http://localhost:3000/
```

### Terminal 3: Tests
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests
npx playwright test --headed --project=chromium
```

**That's it!** Watch the browser execute all 22 tests.

---

## The Two Configuration Fixes

### Fix #1: Frontend Proxy
**File:** `client/vite.config.ts`  
**Change:** Line 11 target from `'https://splitbill-api2.onrender.com'` to `'http://localhost:5001'`  
**Why:** Frontend needs to talk to local backend, not production

### Fix #2: Test Base URL  
**File:** `playwright-tests/playwright.config.ts`  
**Change:** Line 26 baseURL from `'https://splitbill-app-jygd.onrender.com'` to `'http://localhost:3000'`  
**Why:** Tests need to hit local frontend, not production

---

## Verify It Worked

### Check 1: User Registration Works
```bash
# Go to http://localhost:3000 in browser
# Register a new user
# Check database:
sqlite3 /Users/sureshkc/Desktop/demo/SplitBill/server/splitbill.db
SELECT * FROM users;
# Should show your new user ✅
```

### Check 2: Tests Pass
```bash
# Run auth tests specifically:
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests
npx playwright test auth.spec.ts --headed
# Should see: ✓ 7 passed
```

### Check 3: Browser Network Tab
```
1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Click Network tab
4. Register a user
5. Look for: /api/auth/register
6. Request URL should be: http://localhost:3000/api/auth/register
7. NOT: https://splitbill-api2.onrender.com/api/auth/register
```

---

## Test Overview

| Category | Tests | What They Test |
|----------|-------|---|
| **Authentication** | 7 | Register, login, sessions |
| **Groups** | 5 | Create groups, add members |
| **Expenses** | 5 | Add expenses, view details |
| **Settlements** | 5 | Calculate who owes whom |
| **TOTAL** | 22 | Full app functionality |

---

## What You'll See When Running Tests

```
Real Browser Window Opens
    ↓
Click-by-click test execution
    ├─ Form filling
    ├─ Button clicks  
    ├─ Page navigation
    ├─ Assertions checking
    ↓
Test results shown
    ├─ ✓ PASS (green)
    ├─ ✗ FAIL (red)
    ↓
Browser closes after done
```

---

## If Tests Still Fail

### Issue: Browser pointing to production
**Fix:** Restart frontend server after editing `vite.config.ts`

### Issue: "Connection refused localhost:5001"  
**Fix:** Make sure backend server is running in Terminal 1

### Issue: "User not found" error
**Fix:** Check SQLite database to verify user was actually stored

### Issue: Playwright browser won't open
**Fix:** `npx playwright install` to get browsers

---

## Files That Were Changed

```
✅ client/vite.config.ts
   └─ Changed proxy target to localhost:5001

✅ playwright-tests/playwright.config.ts
   └─ Changed baseURL to http://localhost:3000
```

Everything else stays the same!

---

## The Root Cause in One Sentence

**Frontend proxy was pointing to production server instead of local backend, so user data wasn't stored locally.**

---

## Verification Checklist

Before running tests:
- [ ] Backend running on localhost:5001
- [ ] Frontend running on localhost:3000
- [ ] `vite.config.ts` has `target: 'http://localhost:5001'`
- [ ] `playwright.config.ts` has `baseURL: 'http://localhost:3000'`
- [ ] Can visit http://localhost:3000 in browser
- [ ] No errors in terminal windows

After running tests:
- [ ] Browser window opened automatically
- [ ] Saw test actions (form fills, clicks)
- [ ] Test results showed pass/fail count
- [ ] Can verify users in database: `SELECT * FROM users;`

---

## Command Reference

```bash
# Start backend
cd server && npm run dev

# Start frontend  
cd client && npm run dev

# Run all tests (headed, see browser)
cd playwright-tests && npx playwright test --headed

# Run specific test file
cd playwright-tests && npx playwright test auth.spec.ts --headed

# Run single test
cd playwright-tests && npx playwright test -g "User should register"

# View test results HTML report
cd playwright-tests && npx playwright show-report

# Check database
sqlite3 server/splitbill.db "SELECT * FROM users;"

# Kill hung processes
lsof -ti:3000 | xargs kill -9  # Kill frontend
lsof -ti:5001 | xargs kill -9  # Kill backend
```

---

## The Fixes Make Sense Because

1. **Local Development:** You develop on localhost, not production
2. **Testing:** Tests should verify local code, not production
3. **Safety:** Doesn't accidentally modify production data
4. **Speed:** Local database is faster than hitting remote server
5. **CI/CD:** Tests run in isolation without production dependencies

---

## Next: Manual Testing

After tests pass, manually verify:

```
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in:
   - Name: Alice Johnson
   - Email: alice@test.com
   - Password: test123
4. Click Register
5. Should redirect to login
6. Login with alice@test.com / test123
7. Should see groups page
8. Create a test group
9. All data stored locally ✅
```

---

## Debug Commands

### See Backend Logs
```bash
# Terminal 1 shows all requests/responses
# Watch for:
# - Database initialized successfully
# - INSERT INTO users...
# - Error messages
```

### See Frontend Logs
```bash
# Browser DevTools (F12) → Console
# Watch for:
# - API response errors
# - Auth token issues
# - Proxy errors
```

### See Test Logs
```bash
# Terminal 3 output shows test progress
# Green ✓ = test passed
# Red ✗ = test failed with error message
```

### See Database  
```bash
sqlite3 server/splitbill.db
.headers on
.mode column
SELECT * FROM users;
.quit
```

---

## Success Criteria

✅ Tests run in visible browser window  
✅ All 22 tests pass  
✅ Users appear in local database  
✅ No errors in console  
✅ Can manually register and login  

When you see all these ✅, you're done!

