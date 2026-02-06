# 🎯 DEPLOYMENT CHECKLIST - FOLLOW ALONG WITH ME

**Your deployment guide is in:** RENDER_DEPLOYMENT_WALKTHROUGH.md  
**Status:** Ready to go!  
**Estimated time:** 15-20 minutes

---

## ✅ PRE-DEPLOYMENT (Do first!)

- [ ] **Generated JWT Secret?**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Paste your secret here for reference: ________________
  
- [ ] **Have Render dashboard open?**
  https://dashboard.render.com/ (login with skc147283@gmail.com)

- [ ] **Have GitHub ready?**
  Repository: https://github.com/skc147283/splitbill

---

## 📋 DEPLOYMENT STEPS

### **BACKEND DEPLOYMENT (Part 1)**

- [ ] Click "New +" in Render dashboard
- [ ] Select "Web Service"
- [ ] Connect GitHub repo: skc147283/splitbill
- [ ] 
  **Configure Service:**
  - [ ] Name: `splitbill-api`
  - [ ] Root Directory: `server`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
  
- [ ] **Add Environment Variables:**
  - [ ] NODE_ENV = `production`
  - [ ] JWT_SECRET = `[your generated secret]`
  - [ ] DATABASE_PATH = `./splitbill.db`
  - [ ] FRONTEND_URL = `[LEAVE BLANK FOR NOW]`

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-3 minutes)
- [ ] ✅ Shows "Live" (green)

**Your Backend URL:** https://splitbill-api-XXXXX.onrender.com  
Save it here: ________________________________

- [ ] **Test Backend Health:**
  ```
  Visit: https://splitbill-api-XXXXX.onrender.com/api/health
  Should see: {"status":"ok","message":"API is running"}
  ```

---

### **FRONTEND DEPLOYMENT (Part 2)**

- [ ] Click "New +" in Render dashboard
- [ ] Select "Static Site"
- [ ] Connect GitHub repo: skc147283/splitbill
- [ ] 
  **Configure Service:**
  - [ ] Name: `splitbill-client`
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Publish Directory: `dist`

- [ ] **Add Environment Variable:**
  - [ ] VITE_API_URL = `[your backend URL from above]`
  
- [ ] Click "Create Static Site"
- [ ] Wait for deployment (2-3 minutes)
- [ ] ✅ Shows "Live" (green)

**Your Frontend URL:** https://splitbill-client-XXXXX.onrender.com  
Save it here: ________________________________

- [ ] **Test Frontend:**
  ```
  Visit: https://splitbill-client-XXXXX.onrender.com
  Should see: SplitBill login page
  ```

---

### **UPDATE BACKEND (Part 3)**

- [ ] Go back to Render dashboard
- [ ] Click on "splitbill-api" service
- [ ] Click "Settings" or scroll to Environment section
- [ ] Find and edit "FRONTEND_URL"
- [ ] Set to: `https://splitbill-client-XXXXX.onrender.com`
- [ ] Click "Save"
- [ ] ✅ Auto-redeploys (wait for "Live" again)

---

## 🧪 TESTING (Part 4)

### Test Backend
- [ ] Visit: https://splitbill-api-XXXXX.onrender.com/api/health
- [ ] ✅ Returns: {"status":"ok","message":"API is running"}

### Test Frontend
- [ ] Visit: https://splitbill-client-XXXXX.onrender.com
- [ ] ✅ See login page

### Test Login
- [ ] Email: `john@example.com`
- [ ] Password: `demo123`
- [ ] ✅ Click Login
- [ ] ✅ See "My Groups" dashboard

### Test Features
- [ ] ✅ Click on a group (see group details)
- [ ] ✅ See expenses in group
- [ ] ✅ View settlements
- [ ] ✅ Mobile responsive (F12 → resize)

---

## 🎉 SUCCESS!

When you check all boxes above:

```
✅ Backend is live
✅ Frontend is live
✅ They're connected
✅ Login works
✅ Features work
✅ Mobile responsive

🎊 YOU'RE LIVE ON PRODUCTION! 🎊
```

**Share this URL with friends:**
```
🌐 https://splitbill-client-XXXXX.onrender.com

Demo Account:
📧 john@example.com
🔐 demo123
```

---

## 🆘 HELP

If you get stuck on any step:
1. Check RENDER_DEPLOYMENT_WALKTHROUGH.md (troubleshooting section)
2. Check Render dashboard logs (Service → Logs)
3. Let me know which step and what error!

---

**You've got this! 🚀 Start with Step 1 of Part 1 (Backend)**

When you're ready to start, let me know what step you're on and I'll help you through any issues!

