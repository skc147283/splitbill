# SplitBill - Local & Production Mode Setup Guide

## Overview

Your SplitBill application is now configured to run in **two modes**:
1. **LOCAL MODE** - Development with local backend
2. **PRODUCTION MODE** - Production with remote API

---

## Quick Start

### Option 1: Using Launcher Script (Recommended)

#### On Mac/Linux:
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill
./start-app.sh
```

#### On Windows:
```batch
cd C:\Users\...\SplitBill
start-app.bat
```

This opens an interactive menu to choose your mode and action.

---

### Option 2: Manual Setup

## LOCAL MODE (Development)

### 1. Start Backend Server
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/server
npm run dev:local
```

**Output:**
```
Database initialized successfully
SplitBill server is running on http://localhost:5001
```

### 2. Start Frontend Server (New Terminal)
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/client
npm run dev:local
```

**Output:**
```
➜  Local:   http://localhost:3000/
```

### 3. Access the App
- Visit: **http://localhost:3000**
- API requests go to: **http://localhost:5001**
- Database: **Local SQLite (server/splitbill.db)**

### 4. Run Tests in Local Mode (New Terminal)
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests

# Without browser (headless)
npm run test:local

# With visible browser (headed)
npm run test:local:headed

# Specific browser
npm run test:local:chromium
npm run test:local:firefox
npm run test:local:webkit
```

---

## PRODUCTION MODE

### 1. Start Frontend Only
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/client
npm run dev:prod
```

**Output:**
```
➜  Local:   http://localhost:3000/
```

**Important:** Backend must be running on production server (https://splitbill-api2.onrender.com)

### 2. Access the App
- Visit: **http://localhost:3000** (local frontend)
- API requests go to: **https://splitbill-api2.onrender.com** (production backend)
- Database: **Production Database**

### 3. Run Tests in Production Mode
```bash
cd /Users/sureshkc/Desktop/demo/SplitBill/playwright-tests

# Without browser (headless)
npm run test:production

# With visible browser (headed)
npm run test:prod:headed

# Specific browser
npm run test:prod:chromium
```

---

## Building for Production

### Build Frontend
```bash
cd client

# Build for production
npm run build:production

# Preview production build locally
npm run preview:production
```

### Build Backend
```bash
cd server

# Build TypeScript
npm run build:production

# Run production build
npm start
```

---

## Environment Files

The application uses environment files to determine mode:

### `.env.local` - Local Development
```env
NODE_ENV=development
VITE_API_URL=http://localhost:5001
VITE_APP_MODE=local
PORT_FRONTEND=3000
PORT_BACKEND=5001
DATABASE_PATH=./splitbill.db
JWT_SECRET=local-development-secret-key-change-in-production
```

### `.env.production` - Production
```env
NODE_ENV=production
VITE_API_URL=https://splitbill-api2.onrender.com
VITE_APP_MODE=production
PORT_FRONTEND=3000
PORT_BACKEND=5001
DATABASE_PATH=./splitbill.db
JWT_SECRET=your-production-jwt-secret-key-here-must-be-changed
```

---

## All Available Commands

### Frontend Commands
```bash
npm run dev              # Start dev server (local mode)
npm run dev:local       # Start dev server (explicitly local)
npm run dev:prod        # Start dev server (production mode)
npm run build           # Build for current mode
npm run build:local     # Build for local mode
npm run build:production # Build for production
npm run preview         # Preview build
npm run preview:local   # Preview local build
npm run preview:production # Preview production build
```

### Backend Commands
```bash
npm run dev             # Start dev server (local mode)
npm run dev:local       # Start dev server (explicitly local)
npm run dev:prod        # Start dev server (production mode)
npm run build           # Build TypeScript
npm run build:local     # Build for local
npm run build:production # Build for production
npm start              # Run production build
npm start:local        # Run local build
npm run seed           # Seed database with test data
```

### Test Commands
```bash
# LOCAL MODE
npm run test:local              # Run all tests
npm run test:local:headed       # Run with visible browser
npm run test:local:debug        # Run in debug mode
npm run test:local:chromium     # Run on Chrome only
npm run test:local:firefox      # Run on Firefox only
npm run test:local:webkit       # Run on Safari only

# PRODUCTION MODE
npm run test:production         # Run all tests
npm run test:prod:headed        # Run with visible browser
npm run test:prod:debug         # Run in debug mode
npm run test:prod:chromium      # Run on Chrome only

# Legacy/Shortcuts
npm run test              # Same as test:local
npm run test:headed       # Same as test:local:headed
npm run test:chromium     # Same as test:local:chromium
npm run test:firefox      # Same as test:local:firefox
npm run test:webkit       # Same as test:local:webkit
```

---

## Testing Different Scenarios

### Test 1: Local Development Workflow
```bash
# Terminal 1
cd server && npm run dev:local

# Terminal 2
cd client && npm run dev:local

# Terminal 3
cd playwright-tests && npm run test:local:headed

# Watch tests run in real browser against local app
```

### Test 2: Production Readiness
```bash
# Terminal 1
cd client && npm run dev:prod

# Terminal 2
cd playwright-tests && npm run test:prod:headed

# Tests run against production backend
```

### Test 3: Build & Deploy Check
```bash
cd client
npm run build:production
npm run preview:production

# Verify production build works locally
# Visit http://localhost:4173
```

---

## Configuration Summary

| Aspect | Local Mode | Production Mode |
|--------|-----------|-----------------|
| **Frontend Port** | 3000 | 3000 |
| **Backend Port** | 5001 (local) | Remote (Render) |
| **Backend URL** | http://localhost:5001 | https://splitbill-api2.onrender.com |
| **Database** | Local SQLite | Production Database |
| **Start Command** | `npm run dev:local` | `npm run dev:prod` |
| **Test Command** | `npm run test:local` | `npm run test:prod` |

---

## Switching Modes

### To Switch from Local to Production:

1. **Stop** current backend (Terminal 1)
2. **Run** frontend in production mode:
   ```bash
   cd client && npm run dev:prod
   ```
3. **Run** tests in production mode:
   ```bash
   cd playwright-tests && npm run test:prod:headed
   ```

### To Switch from Production to Local:

1. **Start** local backend:
   ```bash
   cd server && npm run dev:local
   ```
2. **Start** local frontend:
   ```bash
   cd client && npm run dev:local
   ```
3. **Run** tests in local mode:
   ```bash
   cd playwright-tests && npm run test:local:headed
   ```

---

## Troubleshooting

### "Port 3000 already in use"
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### "Port 5001 already in use"
```bash
# Find and kill process using port 5001
lsof -ti:5001 | xargs kill -9
```

### Tests timing out in local mode
- Ensure both backend and frontend servers are running
- Check that vite proxy is configured correctly in `client/vite.config.ts`
- Clear browser cache: Ctrl+Shift+Delete

### Tests failing in production mode
- Verify production backend is running
- Check JWT_SECRET matches between environments
- Verify database has test data

---

## Monitoring & Logs

### Backend Logs
Look at Terminal 1 (backend server) for:
- Database initialization
- API requests
- Error messages

### Frontend Logs
Look at Terminal 2 (frontend server) for:
- Vite compilation status
- Hot reload updates
- Network proxy activity

### Test Logs
Look at Terminal 3 (tests) for:
- Test execution progress
- Pass/fail results
- Detailed error messages

---

## Next Steps

1. **Run Local Tests:**
   ```bash
   cd playwright-tests && npm run test:local:headed
   ```

2. **Verify All Tests Pass:**
   - Should see: ✓ 22 passed (or similar)
   - If any fail, check error messages

3. **Build for Production:**
   ```bash
   cd client && npm run build:production
   ```

4. **Deploy to Production:**
   - Use deployment docs (DEPLOYMENT.md, RENDER_DEPLOYMENT.md)
   - Ensure production secrets are set

---

## Support

For issues or questions, refer to:
- **Test Analysis:** [TEST_ANALYSIS.md](./TEST_ANALYSIS.md)
- **Configuration Details:** See files in this directory
- **Deployment:** [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

---

**Status:** ✅ Application configured for both local and production modes!

