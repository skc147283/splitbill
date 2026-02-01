# SplitBill - Workspace Setup

## Workspace Structure

This repository contains a full-stack expense splitter application with separate backend and frontend folders.

## Quick Start

### Start Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:5000`

### Start Frontend Application (in another terminal)
```bash
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

## Building for Production

### Backend
```bash
cd server
npm install
npm run build
npm start
```

### Frontend
```bash
cd client
npm install
npm run build
npm preview
```

## Project Setup Completed

- ✅ Backend API with Express, TypeScript, and SQLite
- ✅ Frontend React application with TypeScript
- ✅ User authentication with JWT
- ✅ Group and expense management
- ✅ Settlement tracking
- ✅ Database schema with all required tables

## Key Features

1. **User Management**: Register, login, and manage user profiles
2. **Groups**: Create groups and add members
3. **Expenses**: Add and track shared expenses
4. **Splits**: Flexible expense splitting among group members
5. **Settlements**: Track and record payments

## Environment Configuration

### Server .env
Create `server/.env` based on `.env.example`:
```
PORT=5000
JWT_SECRET=your-secret-key
DATABASE_PATH=./splitbill.db
NODE_ENV=development
```

## Database

SQLite database is automatically created on first run. Database file: `splitbill.db` in server directory.

### Tables:
- `users` - User accounts and authentication
- `groups` - Expense groups
- `group_members` - Group membership
- `expenses` - Recorded expenses
- `expense_splits` - How expenses are split
- `settlements` - Payment records

## API Base URL

Frontend connects to backend via proxy configured in `vite.config.ts`:
- All `/api/*` requests are forwarded to `http://localhost:5000`
