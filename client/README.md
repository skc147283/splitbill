# Client README

Frontend React application for SplitBill Expense Splitter.

## Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── GroupsPage.tsx
│   └── GroupDetailPage.tsx
├── components/
│   └── ProtectedRoute.tsx
├── services/
│   └── api.ts
├── context/
│   └── AuthContext.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Pages

### LoginPage
- User login with email and password
- Redirects to groups on successful login

### RegisterPage
- New user registration
- Creates account with email, password, and name

### GroupsPage
- Lists all user's groups
- Create new group
- Navigate to group details

### GroupDetailPage
- View group members
- Add members to group
- Add expenses
- View expense list
- Track splits

## Features

- Authentication with JWT tokens
- Protected routes
- Group management
- Expense tracking
- Member management
- Responsive design

## API Configuration

Backend API base URL is configured in `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

All API calls through `/api/*` are forwarded to the backend server.

## Authentication

- Tokens stored in `localStorage`
- JWT tokens included in all API requests
- Auto-logout on token expiration
- Redirect to login for unauthorized access

## Component Hierarchy

```
App
├── AuthProvider
│   └── AppRoutes
│       ├── LoginPage
│       ├── RegisterPage
│       ├── GroupsPage
│       └── ProtectedRoute
│           └── GroupDetailPage
```

## Development

- TypeScript for type safety
- React hooks for state management
- Context API for authentication
- Axios for HTTP requests
- React Router for navigation

## Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.
