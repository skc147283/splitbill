# 🚀 SplitBill - Render Deployment Helper (LIVE WALKTHROUGH)

**Date:** February 6, 2026  
**Status:** Ready to Deploy  
**Estimated Time:** 15-20 minutes

---

## 📋 BEFORE YOU START - One-Time Setup

### Step 0: Generate Your JWT Secret

Run this command and **SAVE the output** (you'll need it in the next step):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

---

## 🎯 DEPLOYMENT GUIDE

### **PART 1: DEPLOY BACKEND API (5 minutes)**

#### Step 1.1: Go to Render Dashboard
```
1. Open: https://dashboard.render.com/
2. Login with: skc147283@gmail.com
3. You should see dashboard with "New" button in top right
```

#### Step 1.2: Create Web Service for Backend
```
1. Click "New +" button in top right
2. Select "Web Service"
3. When asked for repository, select:
   - "GitHub" tab
   - Search for "splitbill"
   - Click on: skc147283/splitbill
   - Click "Connect"
```

#### Step 1.3: Configure the Web Service
```
Fill in these fields:

Name:                    splitbill-api
Environment:             Node
Region:                  [Select closest to you]
Branch:                  main
Root Directory:          server

Build Command:           npm install && npm run build
Start Command:           npm start

These settings tell Render to:
- Deploy from the "server" folder
- Install dependencies with npm
- Run "npm start" to start the server
```

#### Step 1.4: Add Environment Variables
```
Click on "Advanced" section and add these variables:

┌─────────────────────────────────────────────────────────┐
│ KEY                    VALUE                             │
├─────────────────────────────────────────────────────────┤
│ NODE_ENV              production                         │
│ JWT_SECRET            [PASTE YOUR GENERATED SECRET HERE] │
│ DATABASE_PATH         ./splitbill.db                     │
│ FRONTEND_URL          [WILL SET THIS LATER]              │
└─────────────────────────────────────────────────────────┘

⚠️  IMPORTANT:
  - For JWT_SECRET: Paste the long string you generated in Step 0
  - Leave FRONTEND_URL blank for now - you'll update it later
  - Do NOT add quotes around values
```

#### Step 1.5: Create and Deploy Backend
```
1. Click the blue "Create Web Service" button at the bottom
2. Render will now:
   - Download your code from GitHub
   - Install dependencies (npm install)
   - Build the project (npm run build)
   - Start the server (npm start)

This takes 2-3 minutes. You'll see:
  🟡 "In Progress" → 🟢 "Live" when done

3. When green "Live" appears, click on your service name
4. Look for the URL like: https://splitbill-api-xxxxx.onrender.com
5. SAVE THIS URL - you'll need it for Step 2
```

#### Step 1.6: Test Backend is Running
```
Open this URL in your browser:
https://splitbill-api-xxxxx.onrender.com/api/health

You should see:
{"status":"ok","message":"API is running"}

✅ If you see that, backend is working!
❌ If you get an error, check the logs in Render dashboard
   (Click your service → Logs tab)
```

---

### **PART 2: DEPLOY FRONTEND (5 minutes)**

#### Step 2.1: Create Static Site
```
1. Go back to Render dashboard home
2. Click "New +" button again
3. Select "Static Site"
4. Select "GitHub" and search for "splitbill"
5. Click on: skc147283/splitbill
6. Click "Connect"
```

#### Step 2.2: Configure the Static Site
```
Fill in these fields:

Name:                    splitbill-client
Region:                  [Same as backend for best performance]
Branch:                  main
Root Directory:          client

Build Command:           npm install && npm run build
Publish Directory:       dist

These settings tell Render to:
- Build your React app with Vite
- Serve the files from the dist folder
```

#### Step 2.3: Add Environment Variable
```
Click on "Advanced" section and add:

┌─────────────────────────────────────────────────────────┐
│ KEY                    VALUE                             │
├─────────────────────────────────────────────────────────┤
│ VITE_API_URL          [PASTE BACKEND URL FROM STEP 1.5] │
└─────────────────────────────────────────────────────────┘

Example:
  VITE_API_URL = https://splitbill-api-xxxxx.onrender.com

⚠️  This tells the frontend where the backend is
```

#### Step 2.4: Create and Deploy Frontend
```
1. Click the blue "Create Static Site" button
2. Render will now:
   - Download your code from GitHub
   - Build the React app (npm run build)
   - Upload to Netlify/Render CDN

This takes 2-3 minutes.

3. When green "Live" appears:
   - Click on your service
   - Look for URL like: https://splitbill-client-xxxxx.onrender.com
   - SAVE THIS URL

4. Click on the URL to open your frontend
   You should see the SplitBill login page!
```

---

### **PART 3: UPDATE BACKEND WITH FRONTEND URL (1 minute)**

#### Step 3.1: Set Frontend URL on Backend
```
Now that you have the frontend URL, update the backend:

1. Go back to https://dashboard.render.com/
2. Find and click on your "splitbill-api" service
3. Click "Settings" tab (or scroll down)
4. Look for "Environment" section
5. Find "FRONTEND_URL" variable
6. Edit it and set to: https://splitbill-client-xxxxx.onrender.com

7. Click "Save" button
8. Render will auto-redeploy your backend (1 minute)
   Wait for the "Live" indicator to go green again
```

---

### **PART 4: VERIFY EVERYTHING WORKS (3 minutes)**

#### Step 4.1: Check Backend Health
```bash
In your terminal or browser, test:
curl https://splitbill-api-xxxxx.onrender.com/api/health

Should return:
{"status":"ok","message":"API is running"}

✅ If you see that, backend is healthy!
```

#### Step 4.2: Open Frontend in Browser
```
1. Open: https://splitbill-client-xxxxx.onrender.com
2. You should see the SplitBill login page
3. The page should load without errors

✅ If you see the login page, frontend is working!
```

#### Step 4.3: Test Login
```
1. Email: john@example.com
2. Password: demo123
3. Click "Login"

You should see:
- Loading spinner briefly
- Then redirect to "My Groups" page
- List of sample groups

✅ If login works, everything is connected!
```

#### Step 4.4: Test Features
```
Try these to verify everything works:

✅ Click on a group
   Should see group details, members, expenses
   
✅ View expenses
   Should show amounts and who paid
   
✅ View settlements
   Should show who owes whom
   
✅ Mobile test
   Resize browser window or use DevTools (F12)
   Should look good on small screen
```

---

## 📊 SUCCESS CHECKLIST

```
Step 1 - Backend Deployed:
  ☐ Backend URL created (https://splitbill-api-xxxxx.onrender.com)
  ☐ Health endpoint returns OK
  ☐ Service shows "Live" (green)

Step 2 - Frontend Deployed:
  ☐ Frontend URL created (https://splitbill-client-xxxxx.onrender.com)
  ☐ Frontend page loads without errors
  ☐ Service shows "Live" (green)

Step 3 - Connected:
  ☐ FRONTEND_URL set on backend
  ☐ Backend auto-redeployed successfully

Step 4 - Testing:
  ☐ Can login with john@example.com / demo123
  ☐ Can see groups
  ☐ Can see expenses
  ☐ Mobile version looks good

RESULT: ✅ APPLICATION LIVE AND WORKING!
```

---

## 🆘 TROUBLESHOOTING

### Issue: Backend stuck on "In Progress"
**Solution:**
1. Wait 5 minutes (sometimes takes longer)
2. If still not working, click service → Logs
3. Look for error messages
4. Common issues:
   - Missing environment variables
   - Build command failed
   - Port not available

**Fix:** Add missing env vars or check logs for specific error

### Issue: Frontend shows blank page
**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check that VITE_API_URL is set correctly
5. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Common cause:** VITE_API_URL not set or wrong URL

### Issue: Login fails with "Network Error"
**Solution:**
1. Check backend URL in VITE_API_URL
2. Test backend health endpoint manually
3. Check backend logs in Render dashboard
4. Verify FRONTEND_URL is set on backend

**Common cause:** Backend URL incorrect or not running

### Issue: Data doesn't load
**Solution:**
1. Refresh the page
2. Check browser console for errors
3. Verify backend is running
4. Log out and log back in
5. Clear browser cache (Ctrl+Shift+Delete)

### Issue: 502 Bad Gateway on backend
**Solution:**
1. Check backend logs in Render dashboard
2. Wait 2 minutes (sometimes cold start takes time)
3. Verify environment variables are set correctly
4. Check that Start Command is: npm start

**Common cause:** Backend still starting up or env vars missing

---

## 💡 HELPFUL TIPS

### Check Logs (If something breaks)
```
1. Go to Render dashboard
2. Click your service (backend or frontend)
3. Click "Logs" tab on left
4. Look for red error messages
5. Copy error and search online or fix based on message
```

### Update Code (After fixing bugs)
```
1. Make changes locally
2. Push to GitHub: git add . && git commit -m "..." && git push
3. Render auto-deploys in 1-2 minutes
4. Watch the "In Progress" → "Live" indicator
```

### Monitor Performance
```
1. Go to Render dashboard
2. Click your service
3. Check "Metrics" tab to see:
   - CPU usage
   - Memory usage
   - Network traffic
```

---

## 📱 AFTER DEPLOYMENT

### Share with Friends
```
Share this info:

🌐 Visit: https://splitbill-client-xxxxx.onrender.com

Demo Account:
📧 Email: john@example.com
🔐 Password: demo123

Features:
✅ Create groups and add friends
✅ Track shared expenses
✅ See who owes whom automatically
✅ Record payments
✅ View history
```

### Monitor It
```
Check your Render dashboard occasionally:
- Look for errors in logs
- Monitor performance metrics
- Check resource usage

If using free tier, service may sleep after 15 min inactivity
(User can just reload page to wake it up)
```

---

## ✅ YOU'RE READY TO DEPLOY!

**Follow the steps above in order:**

1. **Step 0:** Generate JWT secret (1 min)
2. **Part 1:** Deploy backend (5 min)
3. **Part 2:** Deploy frontend (5 min)
4. **Part 3:** Update backend URL (1 min)
5. **Part 4:** Test everything (3 min)

**Total: ~15-20 minutes**

When you hit an issue, refer to the troubleshooting section above.

**Status: ✅ READY TO DEPLOY**

---

**Need help at any point? Let me know which step you're on and what error you see!**

