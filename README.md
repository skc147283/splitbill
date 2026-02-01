# SplitBill - Expense Splitter Application

A lightweight, free, and open-source web application to help friends split expenses easily. Register with your email, add expenses, manage bills, and settle payments.

## Features

- **User Authentication**: Register and login with email
- **Group Management**: Create groups with friends and manage members
- **Expense Tracking**: Add expenses, track who paid, and how it should be split
- **Balance Calculation**: Automatically calculate who owes whom
- **Settlement Recording**: Record payments and track settlements
- **Real-time Updates**: See all expenses and balances in real-time

## Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **SQLite3** for lightweight database
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Vite** for fast development and builds

## Project Structure

```
SplitBill/
├── server/                 # Backend application
│   ├── src/
│   │   ├── db/            # Database connection and initialization
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth and other middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   ├── scripts/       # Seed data script
│   │   └── index.ts       # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── client/                 # Frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   ├── context/       # React context (Auth)
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Quick Deploy (FREE) 🚀

### Deploy to Render.com in 5 Minutes

Get your app live for FREE with no credit card required!

**See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for complete step-by-step guide:**

1. Go to https://render.com
2. Sign up with GitHub
3. Connect your SplitBill repository
4. Create backend web service
5. Create frontend static site
6. Done! Your app is live! 🎉

**Live Demo**: Your app will be at `https://splitbill-app.onrender.com`

### Alternative Deployment Platforms

- **Railway.app**: $5/month free credits - See [DEPLOYMENT.md](DEPLOYMENT.md)
- **DigitalOcean**: $4-5/month - Most affordable paid option
- **Docker Compose**: Completely free - Run locally
- **AWS, Heroku, Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md) for guides

---

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your settings (optional):
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
DATABASE_PATH=./splitbill.db
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Groups
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all user's groups
- `GET /api/groups/:groupId` - Get group details
- `POST /api/groups/:groupId/members` - Add member to group

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/group/:groupId` - Get group expenses
- `PUT /api/expenses/:expenseId` - Update expense
- `DELETE /api/expenses/:expenseId` - Delete expense

### Settlements
- `POST /api/settlements` - Record a payment
- `GET /api/settlements/group/:groupId` - Get group settlements
- `GET /api/settlements/balance/:groupId` - Calculate balances

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Group**: Create a new group (e.g., "Vacation Trip")
3. **Add Members**: Add friends to the group by their email
4. **Add Expenses**: Record expenses with description, amount, who paid, and how to split
5. **View Balances**: See who owes whom
6. **Settle Payments**: Record payments when friends pay back

## Demo Credentials

When seeding the database, sample users are created:
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`
- Email: `bob@example.com`, Password: `password123`

## Development

### Build Backend
```bash
cd server
npm run build
```

### Build Frontend
```bash
cd client
npm run build
```

### Run Seeder (Backend)
To populate sample data:
```bash
cd server
npm run seed
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

This is an open-source project. Feel free to fork, modify, and improve!

## Future Enhancements

- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] Recurring expenses
- [ ] Export reports (PDF, CSV)
- [ ] Dark mode
- [ ] Offline support

## Support

For issues or questions, please create an issue in the repository.
