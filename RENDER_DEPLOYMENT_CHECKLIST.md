# 🚀 SplitBill - Deployment Checklist for Render

**Status:** Ready for Production Deployment  
**Repository:** https://github.com/skc147283/splitbill  
**Platform:** Render.com (Free Tier)  
**Estimated Time:** 15 minutes

---

## Pre-Deployment Preparation (2 minutes)

### ✅ Generate JWT Secret
```bash
# Run this command and copy the output
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
# Save this - you'll need it in Step 1
```

### ✅ Verify GitHub Credentials
- Account: skc147283@gmail.com
- Repository: https://github.com/skc147283/splitbill
- Status: ✅ Already pushed and ready

### ✅ Verify Render Access
- Go to: https://dashboard.render.com/
- Login with: skc147283@gmail.com
- Verify: Can access dashboard

---

## Step 1: Deploy Backend API (5 minutes)

### 1.1 Create Web Service
```
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Select "GitHub" as repository source
4. Search for "splitbill" and select: skc147283/splitbill
5. Click "Connect"
```

### 1.2 Configure Web Service
```
Name:                splitbill-api
Region:              (select closest to you)
Branch:              main
Root Directory:      server
Environment:         Node
Build Command:       npm install && npm run build
Start Command:       npm start
```

### 1.3 Add Environment Variables
Click "Advanced" and add these variables:

```
Variable Name          Value
─────────────────────────────────────────────────────────
NODE_ENV              production
JWT_SECRET            [paste the generated secret from Step 0]
DATABASE_PATH         ./splitbill.db
FRONTEND_URL          [will update after Step 2 completes]
PORT                  (leave empty - Render assigns automatically)
```

⚠️ **Important:** Don't set FRONTEND_URL yet - you'll get it after deploying frontend

### 1.4 Deploy Backend
```
1. Click "Create Web Service"
2. Wait for build and deployment (2-3 minutes)
3. When successful, you'll see a green "Live" status
4. Note your backend URL: https://splitbill-api-xxxxx.onrender.com
```

### 1.5 Update Backend Environment Variable
```
1. Go back to your Web Service
2. Settings → Environment
3. Edit FRONTEND_URL to: https://splitbill-client-xxxxx.onrender.com
   (Use the URL from Step 2.4)
4. Save and wait for auto-redeploy (1 minute)
```

---

## Step 2: Deploy Frontend (5 minutes)

### 2.1 Create Static Site
```
1. Go to https://dashboard.render.com/
2. Click "New +" → "Static Site"
3. Select "GitHub" as repository source
4. Search for "splitbill" and select: skc147283/splitbill
5. Click "Connect"
```

### 2.2 Configure Static Site
```
Name:                splitbill-client
Region:              (same as backend for best performance)
Branch:              main
Root Directory:      client
Build Command:       npm install && npm run build
Publish Directory:   dist
```

### 2.3 Add Environment Variable
Click "Advanced" and add:

```
Variable Name          Value
─────────────────────────────────────────────────────────
VITE_API_URL          https://splitbill-api-xxxxx.onrender.com
```

Use the backend URL from Step 1.4

### 2.4 Deploy Frontend
```
1. Click "Create Static Site"
2. Wait for build and deployment (2-3 minutes)
3. When successful, you'll see a green "Live" status
4. Note your frontend URL: https://splitbill-client-xxxxx.onrender.com
```

---

## Step 3: Verify Both Services (3 minutes)

### 3.1 Check Backend Health
```bash
# Replace xxxxx with your backend ID
curl https://splitbill-api-xxxxx.onrender.com/api/health

# Expected response:
# {"status":"ok","message":"API is running"}
```

### 3.2 Visit Frontend in Browser
```
1. Open: https://splitbill-client-xxxxx.onrender.com
2. You should see the SplitBill login page
3. The page should load without errors
```

### 3.3 Test Login
```
1. Enter email: john@example.com
2. Enter password: demo123
3. Click "Login"
4. Should redirect to Groups page
5. Should see "My Groups" list
```

---

## Step 4: Post-Deployment Testing (3 minutes)

### ✅ Test All Features

**Authentication:**
- ✅ Can login with john@example.com / demo123
- ✅ Can see user profile
- ✅ Can logout

**Groups:**
- ✅ Can see existing groups
- ✅ Can view group details
- ✅ Can see group members

**Expenses:**
- ✅ Can view group expenses
- ✅ Can see expense details
- ✅ Can see total amounts

**Settlements:**
- ✅ Can view balances
- ✅ Can see who owes whom
- ✅ Can mark as paid

**Responsiveness:**
- ✅ Test on mobile (use browser DevTools)
- ✅ Test on tablet
- ✅ Test on desktop

---

## 📋 Deployment Success Checklist

### Backend (API)
```
✅ Service created on Render
✅ Code deployed from GitHub
✅ Environment variables set
✅ Health endpoint responds (200 OK)
✅ Database initialized
✅ No errors in logs
```

### Frontend (Client)
```
✅ Static site created on Render
✅ Code deployed from GitHub
✅ Build completed successfully
✅ Assets loaded correctly
✅ Environment variables set
✅ Connects to backend API
```

### Integration
```
✅ Frontend can reach backend
✅ API calls successful
✅ Authentication working
✅ Data flowing correctly
✅ No CORS errors
```

### Features
```
✅ Login works
✅ Groups display
✅ Expenses show
✅ Settlements calculate
✅ Mobile responsive
```

---

## 🔍 Troubleshooting Guide

### Issue: Frontend shows blank page
**Solution:**
1. Check browser console (F12) for errors
2. Verify VITE_API_URL environment variable is set correctly
3. Check that backend URL is accessible
4. Redeploy frontend

### Issue: Login fails with network error
**Solution:**
1. Verify backend service is running (green "Live" status)
2. Check VITE_API_URL matches backend URL exactly
3. Verify FRONTEND_URL is set on backend
4. Check Render service logs for errors

### Issue: Backend gives 502 Bad Gateway
**Solution:**
1. Check backend service logs in Render dashboard
2. Verify Start Command is: `npm start`
3. Check that all environment variables are set
4. Redeploy backend service

### Issue: Expenses/Groups not showing
**Solution:**
1. Verify backend service is running
2. Check database file exists (in backend logs)
3. Try logging out and logging back in
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Cannot access backend health endpoint
**Solution:**
1. Verify correct backend URL
2. Check backend service status (should be green)
3. Wait 1-2 minutes for backend to fully start
4. Refresh the URL in browser

---

## 📊 Expected Results After Deployment

```
Frontend URL:    https://splitbill-client-xxxxx.onrender.com
Backend URL:     https://splitbill-api-xxxxx.onrender.com

Login Page:      ✅ Should load immediately
Login Speed:     ✅ Should take 2-3 seconds
Page Transitions: ✅ Should be smooth
Data Loading:    ✅ Should show groups and expenses
Mobile View:     ✅ Should be responsive
```

---

## 🛠️ Render Dashboard Useful Links

```
Main Dashboard:     https://dashboard.render.com/
Your Services:      https://dashboard.render.com/services
Deployment Logs:    [Service] → Logs tab
Environment Vars:   [Service] → Environment tab
Settings:           [Service] → Settings tab
```

---

## 📝 Final Notes

### ✅ What You'll Get
- Free SSL/HTTPS certificate
- Automatic backups
- 100 GB/month bandwidth
- Custom domain support (optional)
- Auto-deploy on GitHub push

### ⏰ Cold Start Time
- First request after 15 min inactive: 30-60 seconds
- Subsequent requests: <1 second
- (To avoid: upgrade to paid plan or use a ping service)

### 💾 Database
- SQLite file stored locally on Render
- Data persists across deployments
- Backup manually if needed

### 🔐 Security
- HTTPS enabled automatically
- Environment variables are secure
- JWT tokens expire after configured time
- CORS properly configured

---

## ✅ All Done!

Your SplitBill application is now live on:
```
🌐 https://splitbill-client-xxxxx.onrender.com

Demo Account:
📧 Email: john@example.com
🔐 Password: demo123
```

Share this URL with friends to start splitting bills!

---

**Deployment Status:** ✅ COMPLETE  
**Production URL:** https://splitbill-client-xxxxx.onrender.com  
**Backend API:** https://splitbill-api-xxxxx.onrender.com  
**Support:** See troubleshooting section above

