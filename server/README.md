# Server README

Backend API for SplitBill Expense Splitter application.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run built application
- `npm run seed` - Populate database with sample data

## API Documentation

### Auth Endpoints

**Register User**
```
POST /api/auth/register
Body: { email, password, name }
Response: { userId, token, name, email }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response: { userId, token, name, email }
```

**Get Current User**
```
GET /api/auth/me
Header: Authorization: Bearer <token>
Response: { id, email, name, createdAt }
```

### Group Endpoints

**Create Group**
```
POST /api/groups
Body: { name }
Header: Authorization: Bearer <token>
```

**List User Groups**
```
GET /api/groups
Header: Authorization: Bearer <token>
```

**Get Group Details**
```
GET /api/groups/:groupId
Header: Authorization: Bearer <token>
```

**Add Member**
```
POST /api/groups/:groupId/members
Body: { email }
Header: Authorization: Bearer <token>
```

### Expense Endpoints

**Create Expense**
```
POST /api/expenses
Body: { groupId, description, amount, splits: {userId: amount} }
Header: Authorization: Bearer <token>
```

**Get Expenses**
```
GET /api/expenses/group/:groupId
Header: Authorization: Bearer <token>
```

**Update Expense**
```
PUT /api/expenses/:expenseId
Body: { description, amount, splits }
Header: Authorization: Bearer <token>
```

**Delete Expense**
```
DELETE /api/expenses/:expenseId
Header: Authorization: Bearer <token>
```

### Settlement Endpoints

**Record Settlement**
```
POST /api/settlements
Body: { groupId, toUserId, amount }
Header: Authorization: Bearer <token>
```

**Get Settlements**
```
GET /api/settlements/group/:groupId
Header: Authorization: Bearer <token>
```

**Calculate Balance**
```
GET /api/settlements/balance/:groupId
Header: Authorization: Bearer <token>
```

## Environment Variables

```
PORT=5000                                    # Server port
JWT_SECRET=your-secret-key-change-in-prod   # JWT signing secret
DATABASE_PATH=./splitbill.db                 # SQLite database path
NODE_ENV=development                         # Environment
```

## Database

SQLite3 database with the following tables:
- `users` - User accounts
- `groups` - Expense groups
- `group_members` - Group memberships
- `expenses` - Expenses
- `expense_splits` - Expense splits
- `settlements` - Payment settlements

Automatically created on first run.
