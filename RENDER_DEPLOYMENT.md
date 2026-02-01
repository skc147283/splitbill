# Render.com Deployment Guide for SplitBill

Complete step-by-step guide to deploy SplitBill (Backend + Frontend) to Render.com for FREE.

## Prerequisites

- GitHub account with SplitBill repository: https://github.com/skc147283/splitbill
- Render.com account (sign up at https://render.com)
- No credit card required for free tier

---

## Step 1: Sign Up on Render.com

1. Go to https://render.com
2. Click "Get Started" or "Sign Up"
3. Choose "GitHub" for authentication
4. Authorize Render to access your GitHub account
5. Review and accept permissions
6. You're now logged in!

---

## Step 2: Deploy Backend API

### 2.1: Create a New Web Service

1. In Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **`splitbill`** repository
5. Click "Connect"

### 2.2: Configure Backend Service

| Setting | Value |
|---------|-------|
| **Name** | `splitbill-api` |
| **Region** | `Oregon (US West)` or closest to you |
| **Branch** | `main` |
| **Plan** | `Free` |

**Note**: Render will auto-detect the `Dockerfile` and use it automatically. You don't need to specify Build or Start commands.

### 2.3: Add Environment Variables

Click **"Advanced"** to add environment variables:

```
JWT_SECRET = your-super-secret-key-change-this-12345
NODE_ENV = production
DATABASE_PATH = /tmp/splitbill.db
PORT = 5000
```

**Important**: Change `JWT_SECRET` to something unique and secure!

Example format (don't use this exact value):
```
JWT_SECRET = your-generated-secret-key-here-12345
```

To generate a secure secret in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

Use that as your JWT_SECRET.

### 2.4: Deploy Backend

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Wait for deployment (2-3 minutes)
4. You'll see a URL like: `https://splitbill-api.onrender.com`
5. **Save this URL** - you'll need it for frontend

**Check Status:**
- Green status = deployed successfully ✅
- Logs tab shows build progress
- Click the URL to test: `https://your-api-url.onrender.com/api/health`
- Should return: `{"status":"ok"}`

---

## Step 3: Update Frontend Configuration

Before deploying frontend, update the API URL in your code.

### 3.1: Update Vite Config

Edit `client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://splitbill-api.onrender.com',  // ← UPDATE THIS
        changeOrigin: true,
      },
    },
  },
})
```

### 3.2: Commit Changes

```bash
cd /Users/sureshkc/Desktop/demo/SplitBill
git add client/vite.config.ts
git commit -m "Update API URL for Render.com deployment"
git push origin main
```

---

## Step 4: Deploy Frontend

### 4.1: Create a Static Site

1. In Render dashboard, click **"New +"**
2. Select **"Static Site"**
3. Click **"Connect a repository"**
4. Select **`splitbill`** repository
5. Click "Connect"

### 4.2: Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `splitbill-app` |
| **Environment** | `Vite` |
| **Region** | Same as backend (Oregon) |
| **Branch** | `main` |
| **Build Command** | `cd client && npm install && npm run build` |
| **Publish Directory** | `client/dist` |
| **Plan** | `Free` |

### 4.3: Deploy Frontend

1. Scroll to bottom
2. Click **"Create Static Site"**
3. Wait for deployment (2-3 minutes)
4. You'll see a URL like: `https://splitbill-app.onrender.com`
5. **This is your live app!** 🎉

---

## Step 5: Verify Deployment

### 5.1: Test Backend API

Open in browser:
```
https://splitbill-api.onrender.com/api/health
```

Expected response:
```json
{"status":"ok"}
```

### 5.2: Test Frontend

Open in browser:
```
https://splitbill-app.onrender.com
```

You should see:
- SplitBill login page ✅
- Ability to register a new account ✅
- Ability to login with demo accounts ✅

### 5.3: Test Full Workflow

1. **Register**: Create new account with email
2. **Create Group**: Create "Test Group"
3. **Add Member**: Add your friend's email
4. **Add Expense**: Add test expense
5. **Check**: Verify expense appears in list

---

## Step 6: Custom Domain (Optional)

If you want a custom domain like `app.example.com`:

1. Go to your service settings
2. Click **"Settings"** → **"Custom Domain"**
3. Enter your domain name
4. Add DNS records as shown
5. Wait for SSL certificate (usually 24 hours)

---

## Important Notes ⚠️

### Free Tier Limitations

- **Spins down after 15 minutes of inactivity**
  - First request after inactivity takes 30-60 seconds to wake up
  - This is normal on free tier
  
- **Limited to 750 free tier hours per month**
  - Enough for hobby/personal use
  - ~25 hours of continuous usage

- **Database**: SQLite stored locally (limited)
  - Fine for testing
  - For production, upgrade to PostgreSQL

### Security Best Practices

1. **Change JWT_SECRET** 
   - Use strong random string
   - Never use default values
   - Command to generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Enable HTTPS**
   - Automatically enabled on Render ✅

3. **Set NODE_ENV**
   - Always set to `production`

4. **Keep .env files local**
   - Never commit `.env` to GitHub
   - Use Render's environment variables instead

---

## Troubleshooting

### Issue: 502 Bad Gateway

**Solution:**
1. Check if backend service is still running
2. Check build logs for errors
3. Verify environment variables are set
4. Restart service: Settings → "Restart"

### Issue: Frontend Can't Connect to API

**Solution:**
1. Verify backend API is working (test health endpoint)
2. Check if API URL is correctly set in `vite.config.ts`
3. Verify CORS is enabled on backend
4. Check browser console for error messages

### Issue: Database Not Persisting

**Solution:**
1. SQLite on free tier stores in `/tmp` (temporary)
2. Data resets when service restarts
3. For persistent data, upgrade to PostgreSQL
4. Or use: `DATABASE_PATH = /var/data/splitbill.db`

### Issue: Build Takes Too Long

**Solution:**
1. Render caches dependencies
2. First build is slowest (3-5 minutes)
3. Subsequent builds are faster (1-2 minutes)
4. Clear cache if needed in service settings

---

## Upgrade to Paid (Optional)

When you're ready for production:

1. **Render.com Pro**: $7/month
   - Faster deployments
   - No spin-down
   - Better performance
   - PostgreSQL database included

2. **Costs:**
   - Web Service: $7/month minimum
   - Static Site: Free with Pro
   - PostgreSQL: $15/month

---

## Testing Demo Accounts

The database is seeded with demo accounts:

```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123

Email: bob@example.com
Password: password123
```

---

## Next Steps

After successful deployment:

1. ✅ Test the live app
2. ✅ Create groups and add expenses
3. ✅ Share the app link with friends
4. ✅ Add your own custom domain (optional)
5. ✅ Monitor logs for any issues
6. ✅ Consider upgrading if needed

---

## Useful Render.com Commands

### View Logs
```
Settings → "Logs" tab
See real-time deployment and runtime logs
```

### Restart Service
```
Settings → "Restart" button
Useful if you need to restart after updating env variables
```

### Update Code
```bash
# Just push to main branch
git push origin main

# Render auto-detects and redeploys
# (if webhook is connected)
```

### Manual Redeploy
```
Service Settings → "Deploy" → "Deploy latest commit"
```

---

## Deploy Status Indicators

| Status | Meaning | Action |
|--------|---------|--------|
| 🟢 Live | Service is running | All good! |
| 🟡 Deploying | Building and deploying | Wait for completion |
| 🔴 Failed | Build or runtime error | Check logs |
| ⚫ Suspended | Too many restarts | Check error logs |

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Render Community**: https://discourse.render.com
- **SplitBill GitHub**: https://github.com/skc147283/splitbill
- **Email Support**: support@render.com

---

## Deployment Checklist ✅

- [ ] Signed up on Render.com
- [ ] Connected GitHub account
- [ ] Created backend web service
- [ ] Backend service is live (green status)
- [ ] Tested health endpoint
- [ ] Updated frontend API URL
- [ ] Committed and pushed changes
- [ ] Created frontend static site
- [ ] Frontend site is live
- [ ] Tested registration and login
- [ ] Tested full workflow (groups, expenses)
- [ ] Shared app link with friends

---

**Congratulations! Your SplitBill app is now live on the internet! 🎉**

Share your app URL: `https://splitbill-app.onrender.com`

Questions? Check the troubleshooting section or visit Render's documentation.
