    # Quick Action: Deploy SplitBill to Render.com

## 🚀 5-Minute Deployment Checklist

### STEP 1: Prepare (1 minute)
- [ ] Go to https://render.com
- [ ] Click "Get Started"
- [ ] Sign in with GitHub (authorize)

---

### STEP 2: Deploy Backend API (2 minutes)

1. Click **"New +"** → **"Web Service"**
2. Select repository: **`splitbill`**
3. Fill in these fields:

```
Name:              splitbill-api
Region:            Oregon (closest to you)
Branch:            main
Plan:              Free
```

**Note**: Render will auto-detect the `Dockerfile` and use it automatically. You don't need to specify Build or Start commands.

4. Click **"Advanced"**
5. Add Environment Variables:
   - `JWT_SECRET` = (generate secure key - see below)
   - `NODE_ENV` = `production`
   - `DATABASE_PATH` = `/tmp/splitbill.db`
   - `PORT` = `5000`

6. Click **"Create Web Service"**
7. **Wait 2-3 minutes** for green "Live" status ✅

**Save your Backend URL** when it appears (something like `https://splitbill-api.onrender.com`)

---

### STEP 3: Update Frontend Config (30 seconds)

Edit this file on your computer:
**`client/vite.config.ts`**

Find this line:
```typescript
target: 'http://localhost:5001',
```

Replace with your backend URL:
```typescript
target: 'https://splitbill-api.onrender.com',
```

Save and run:
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill
git add client/vite.config.ts
git commit -m "Update API URL for Render deployment"
git push origin main
```

---

### STEP 4: Deploy Frontend (2 minutes)

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select repository: **`splitbill`**
3. Fill in:

```
Name:                splitbill-app
Region:              Oregon (same as backend)
Branch:              main
Build Command:       cd client && npm install && npm run build
Publish Directory:   client/dist
Plan:                Free
```

4. Click **"Create Static Site"**
5. **Wait 2-3 minutes** for green status ✅

**Your Frontend URL** will appear (something like `https://splitbill-app.onrender.com`)

---

### STEP 5: Test Your App! (1 minute)

Open in browser:
```
https://splitbill-app.onrender.com
```

You should see:
- ✅ Login page loads
- ✅ Can register new account
- ✅ Can login with demo account:
  - Email: `john@example.com`
  - Password: `password123`

---

## 🔐 How to Generate Secure JWT_SECRET

Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it into Render's `JWT_SECRET` field.

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## ✅ Deployment Complete!

Your app is now LIVE at:
```
https://splitbill-app.onrender.com
```

### Share it with friends:
- Send them the link above
- They can create accounts and use it immediately
- No installation needed!

---

## 📱 Test Features

1. **Register**: Create new account
2. **Create Group**: Create a test group
3. **Add Friends**: Add group members by email
4. **Add Expenses**: Test adding an expense
5. **Split Bills**: Verify expense appears in list

---

## ⚠️ Important Notes

- **Free tier note**: Service may go to sleep after 15 minutes of no use
  - First request after sleep takes 30-60 seconds to wake up
  - Perfectly normal! Just wait a moment.

- **Data reset**: If Render restarts, SQLite data may reset
  - Demo accounts are recreated automatically
  - Not for production use - but perfect for learning!

- **Uptime**: Great for development and personal use
  - Consider upgrading ($7/month) for better performance

---

## 🆘 Troubleshooting

### Issue: "502 Bad Gateway" error

**Fix:**
1. Check backend service status (should be green)
2. Wait 30-60 seconds and refresh
3. Click "Restart" in backend service settings

### Issue: Frontend can't connect to API

**Fix:**
1. Double-check you updated `vite.config.ts` with correct backend URL
2. Commit and push changes
3. Render will auto-redeploy in 2-3 minutes
4. Refresh frontend page (hard refresh: Cmd+Shift+R)

### Issue: "Can't register/login"

**Fix:**
1. Check backend API is running (visit health endpoint)
2. Check browser console for error messages (F12)
3. Verify environment variables in Render dashboard

---

## 🎉 Success!

You've successfully deployed a full-stack web application to the internet!

**Next steps:**
- [ ] Share with friends
- [ ] Add more features
- [ ] Deploy improvements
- [ ] Consider upgrading to paid tier for production

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **GitHub Issues**: https://github.com/skc147283/splitbill/issues
- **Detailed Guide**: See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

---

**You're awesome! 🚀**
