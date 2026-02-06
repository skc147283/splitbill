# 🧪 SplitBill Production Testing & Verification Guide

## Overview

Once your app is deployed to production on Render.com, use this guide to thoroughly test and verify all features are working correctly.

---

## 📋 Pre-Testing Checklist

Before you start testing, verify:

- [ ] Frontend URL is accessible
- [ ] Backend URL is accessible
- [ ] Both services are deployed on Render
- [ ] You have demo credentials ready
- [ ] You're on a stable internet connection

---

## 🔐 Demo Credentials

```
Email:    john@example.com
Password: demo123
```

If this account doesn't exist yet, you can:
1. Click "Register" on login page
2. Create a test account
3. Use that for testing

---

## 🧪 Complete Testing Scenarios

### TEST 1: Application Access & Load

**Objective:** Verify app loads correctly

```
Steps:
1. Open https://splitbill-client-xxxxx.onrender.com
2. Should see login page within 5 seconds
3. Page should be responsive (test on mobile too)
4. No console errors (check browser dev tools - F12)

Expected Result: ✅ Login page loads cleanly
```

**Verification:**
- [ ] Page loads in < 5 seconds
- [ ] No red error messages
- [ ] Login form visible
- [ ] "Register" link visible
- [ ] Mobile responsive

---

### TEST 2: User Registration

**Objective:** Test new user signup

```
Steps:
1. Click "Register" on login page
2. Enter test data:
   - Name: Test User
   - Email: test2@example.com
   - Password: TestPass123
3. Click "Register"
4. Should see success or redirect to login

Expected Result: ✅ New user created
```

**Verification:**
- [ ] Form accepts input
- [ ] Submit button works
- [ ] No error messages
- [ ] Redirects to login
- [ ] Can login with new credentials

---

### TEST 3: User Authentication & Login

**Objective:** Test login functionality

```
Steps:
1. Go to https://splitbill-client-xxxxx.onrender.com
2. Enter email: john@example.com
3. Enter password: demo123
4. Click "Login"
5. Wait for page to load

Expected Result: ✅ Logged in successfully
```

**Verification:**
- [ ] Login form accepts credentials
- [ ] Submit button is clickable
- [ ] Page redirects after login
- [ ] No error messages
- [ ] Directed to Groups page
- [ ] User name shows in header (if applicable)

**If login fails:**
- Check backend logs in Render dashboard
- Verify JWT_SECRET is set in environment variables
- Try registering new test account first

---

### TEST 4: Session Persistence

**Objective:** Verify session stays active

```
Steps:
1. Login with john@example.com
2. Go to any page (e.g., Groups)
3. Refresh the page (F5)
4. Should remain logged in

Expected Result: ✅ Session persists
```

**Verification:**
- [ ] After refresh, still logged in
- [ ] No redirect to login
- [ ] User data still shows
- [ ] Can navigate pages

**If fails:**
- Check browser cookies (Dev Tools → Application)
- Check JWT token in localStorage

---

### TEST 5: Logout Functionality

**Objective:** Test logout clears session

```
Steps:
1. Logged in state
2. Click "Logout" button
3. Should redirect to login page

Expected Result: ✅ Session cleared
```

**Verification:**
- [ ] Logout button exists
- [ ] Clicking works immediately
- [ ] Redirects to login page
- [ ] Cannot access protected pages
- [ ] Cannot go back to groups with browser back button

---

### TEST 6: Create New Group

**Objective:** Test group creation feature

```
Steps:
1. Logged in state
2. Click "Create Group" button
3. Enter group name: "Test Group"
4. Click "Create"
5. Wait for page update

Expected Result: ✅ Group created and visible
```

**Verification:**
- [ ] Create button is visible
- [ ] Form opens
- [ ] Can enter group name
- [ ] Submit works
- [ ] New group appears in list
- [ ] Can click to view details
- [ ] Group persists on refresh

---

### TEST 7: View Groups List

**Objective:** Test groups dashboard

```
Steps:
1. Login successfully
2. Navigate to Groups page
3. See list of all groups

Expected Result: ✅ All groups displayed
```

**Verification:**
- [ ] Groups page loads
- [ ] Shows group cards
- [ ] Each card shows:
  - Group name
  - Member count
  - Total balance
- [ ] Can click group to view details
- [ ] Create Group button visible

---

### TEST 8: Add Members to Group

**Objective:** Test group member management

```
Steps:
1. Click on a group
2. Click "Add Member"
3. Enter email of another user (or create one)
4. Click "Add"
5. Wait for update

Expected Result: ✅ Member added to group
```

**Verification:**
- [ ] Add Member button visible
- [ ] Dialog/form opens
- [ ] Can enter email
- [ ] Submit works
- [ ] New member in list
- [ ] Persists on refresh

---

### TEST 9: View Group Members

**Objective:** Test member list display

```
Steps:
1. Open a group with multiple members
2. Look for Members section

Expected Result: ✅ All members listed
```

**Verification:**
- [ ] Members section visible
- [ ] Lists all members
- [ ] Shows member names/emails
- [ ] Shows member status (if applicable)

---

### TEST 10: Add New Expense

**Objective:** Test expense creation

```
Steps:
1. Open a group
2. Click "Add Expense"
3. Fill in:
   - Amount: 150.50
   - Description: Dinner
   - Date: Today
   - Category: Food
   - Paid by: Your name
4. Click "Submit"

Expected Result: ✅ Expense created
```

**Verification:**
- [ ] Add Expense button works
- [ ] Form opens with all fields
- [ ] Can enter amount
- [ ] Can select date
- [ ] Can select payer
- [ ] Can add description
- [ ] Submit works
- [ ] Expense appears in list
- [ ] Total updates

---

### TEST 11: View Expenses List

**Objective:** Test expense display

```
Steps:
1. Open group with expenses
2. Look at Expenses section

Expected Result: ✅ All expenses visible
```

**Verification:**
- [ ] List shows all expenses
- [ ] Shows amount
- [ ] Shows description
- [ ] Shows date
- [ ] Shows who paid
- [ ] Total amount calculated
- [ ] Can click for details

---

### TEST 12: View Expense Details

**Objective:** Test detailed expense view

```
Steps:
1. Click on an expense in the list
2. Should show full details

Expected Result: ✅ Details displayed
```

**Verification:**
- [ ] Amount shown
- [ ] Description shown
- [ ] Date shown
- [ ] Payer shown
- [ ] Split breakdown shown
- [ ] Can close/back out

---

### TEST 13: View Settlement Information

**Objective:** Test settlement display

```
Steps:
1. Open a group with expenses
2. Look for Settlement section

Expected Result: ✅ Balances shown correctly
```

**Verification:**
- [ ] Settlement section exists
- [ ] Shows who owes whom
- [ ] Shows amounts
- [ ] Shows names
- [ ] Calculations appear correct

**Manual calculation:**
- Confirm amounts match expenses
- Verify splits are accurate

---

### TEST 14: Mark Settlement as Paid

**Objective:** Test settlement payment recording

```
Steps:
1. In Settlement section
2. Find an unsettled record
3. Click "Mark as Paid"
4. Confirm payment

Expected Result: ✅ Settlement marked paid
```

**Verification:**
- [ ] Button exists
- [ ] Clicking works
- [ ] Status changes
- [ ] Moved to history
- [ ] Balance updates
- [ ] Persists on refresh

---

### TEST 15: View Settlement History

**Objective:** Test payment history

```
Steps:
1. Open group
2. Look for Settlement History

Expected Result: ✅ History visible
```

**Verification:**
- [ ] Shows past settlements
- [ ] Shows dates
- [ ] Shows amounts
- [ ] Shows who paid whom
- [ ] Sorted chronologically

---

### TEST 16: Responsive Design - Mobile

**Objective:** Test on mobile device

```
Steps:
1. Open frontend URL on smartphone
2. Test all features

Expected Result: ✅ Works on mobile
```

**Verification:**
- [ ] Layout responsive
- [ ] Text readable
- [ ] Buttons clickable
- [ ] Forms work
- [ ] No horizontal scroll needed
- [ ] Navigation works
- [ ] Touch interactions smooth

---

### TEST 17: Responsive Design - Tablet

**Objective:** Test on tablet device

```
Steps:
1. Open on tablet or browser at 768px width
2. Test navigation and features

Expected Result: ✅ Works on tablet
```

**Verification:**
- [ ] Proper spacing
- [ ] Readable text
- [ ] Clickable buttons
- [ ] Good layout

---

### TEST 18: Data Persistence

**Objective:** Test data saves correctly

```
Steps:
1. Create group
2. Add members
3. Add expenses
4. Refresh page
5. Logout and login again
6. All data should still be there

Expected Result: ✅ Data persists
```

**Verification:**
- [ ] Groups still exist
- [ ] Members still there
- [ ] Expenses unchanged
- [ ] Balances same
- [ ] After logout/login - data intact

---

### TEST 19: Error Handling

**Objective:** Test error messages

```
Steps:
1. Try login with wrong password
2. Should show error
3. Try creating group without name
4. Should show validation error

Expected Result: ✅ Errors handled gracefully
```

**Verification:**
- [ ] Wrong password shows error
- [ ] Error message is clear
- [ ] Form validation works
- [ ] No app crashes
- [ ] User can retry

---

### TEST 20: Performance Testing

**Objective:** Test app speed

```
Use browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check response times

Steps:
- Login page load: < 2 sec
- API calls: < 1 sec
- Page transitions: < 2 sec
```

**Verification:**
- [ ] Page loads in < 5 seconds
- [ ] API responds quickly
- [ ] No slow requests
- [ ] Database queries fast

---

## 📊 Testing Summary Checklist

### Core Features
- [ ] Authentication works
- [ ] Groups can be created
- [ ] Members can be added
- [ ] Expenses can be recorded
- [ ] Settlements display correctly
- [ ] Payments can be recorded

### User Experience
- [ ] Login/Logout works
- [ ] Session persists
- [ ] Navigation smooth
- [ ] Forms intuitive
- [ ] Error messages clear
- [ ] Mobile responsive

### Data Management
- [ ] Data persists
- [ ] Calculations correct
- [ ] Balances accurate
- [ ] History maintained
- [ ] No data loss on refresh

### Performance
- [ ] App loads quickly
- [ ] Buttons responsive
- [ ] No lag
- [ ] Forms submit smoothly
- [ ] Database queries fast

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot login"
```
Solution:
1. Check email/password spelling
2. Try registering new account
3. Check backend logs in Render
4. Verify JWT_SECRET in environment
```

### Issue: "Page blank or not loading"
```
Solution:
1. Hard refresh: Ctrl+Shift+R
2. Clear browser cache
3. Try incognito/private window
4. Check console for errors (F12)
5. Try different browser
```

### Issue: "Expenses not showing"
```
Solution:
1. Check backend logs
2. Refresh page
3. Ensure group has expenses
4. Try creating new expense
5. Check database status
```

### Issue: "Slow loading"
```
Solution:
1. Wait 1-2 min (free tier may need spin-up)
2. Check internet speed
3. Check browser DevTools Network tab
4. Try different time
5. Check Render metrics
```

### Issue: "Login works but shows blank"
```
Solution:
1. Wait a few seconds
2. Refresh page
3. Check console for errors
4. Try logout and login again
5. Clear localStorage (F12 → Application)
```

---

## 📈 Performance Benchmarks

### Expected Times
```
Page Load:           2-5 seconds
Login:               3-5 seconds
API Response:        < 1 second
Create Group:        2-3 seconds
Add Expense:         1-2 seconds
Page Navigation:     < 1 second
Database Query:      < 500ms
```

If times are higher:
- Free tier instance may need spin-up
- More members/expenses slow things down
- Check internet connection
- Wait a bit and try again

---

## ✅ Sign-Off Checklist

After testing everything, verify:

- [ ] All 20 test scenarios passed
- [ ] No critical errors
- [ ] App is responsive
- [ ] Data persists correctly
- [ ] Users can complete workflows
- [ ] Performance acceptable
- [ ] Ready for users

---

## 🎊 Ready for Production!

If all tests pass, your app is ready for:
- ✅ User beta testing
- ✅ Public launch
- ✅ Real expense tracking
- ✅ Production use

---

## 📞 Troubleshooting Resources

- **Render Dashboard:** https://dashboard.render.com
- **View Backend Logs:** Dashboard → splitbill-api → Logs
- **View Frontend Logs:** Dashboard → splitbill-client → Logs
- **Check Metrics:** Dashboard → Metrics tab

---

## 🚀 Next Steps After Testing

1. **Invite Users**
   - Share app URL
   - Provide instructions
   - Give demo credentials

2. **Gather Feedback**
   - Ask users what works
   - Note any issues
   - Prioritize improvements

3. **Monitor**
   - Check logs regularly
   - Monitor performance
   - Watch for errors

4. **Scale (if needed)**
   - Upgrade from free tier
   - Add monitoring
   - Set up backups

---

**Testing Complete! Your app is production-ready.** 🎉

---

*Last Updated: February 5, 2026*
*Status: ✅ Ready for Production Testing*
