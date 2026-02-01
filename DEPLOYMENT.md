# SplitBill Deployment Guide

## Deployment Options

### 1. Docker & Docker Compose (Recommended for Local/Self-Hosted)

#### Prerequisites
- Docker and Docker Compose installed

#### Build and Run
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

#### Stop Services
```bash
docker-compose down
```

---

### 2. Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Setup
```bash
# Create Heroku apps
heroku create splitbill-server
heroku create splitbill-client

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key --app splitbill-server
heroku config:set DATABASE_PATH=/tmp/splitbill.db --app splitbill-server

# Add buildpacks
heroku buildpacks:add heroku/nodejs --app splitbill-server
heroku buildpacks:add heroku/static --app splitbill-client

# Deploy
git push heroku main
```

---

### 3. Railway.app Deployment

#### Prerequisites
- Railway account

#### Setup via Web
1. Connect your GitHub repository to Railway
2. Railway will auto-detect `package.json` files
3. Set environment variables in Railway dashboard
4. Deploy automatically

#### Build Environment Variables
```
JWT_SECRET=your-secret-key
DATABASE_PATH=/tmp/splitbill.db
NODE_ENV=production
PORT=5000
```

---

### 4. Render.com Deployment

#### For Backend
1. Go to https://dashboard.render.com/new/web
2. Connect GitHub repository
3. Configure:
   - **Name**: splitbill-api
   - **Environment**: Node
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `node server/dist/index.js`
   - **Environment Variables**:
     - `JWT_SECRET=your-secret-key`
     - `NODE_ENV=production`

#### For Frontend
1. Go to https://dashboard.render.com/new/static
2. Connect GitHub repository
3. Configure:
   - **Name**: splitbill-app
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

---

### 5. Vercel Deployment (Frontend Only)

#### Prerequisites
- Vercel account

#### Deploy
```bash
npm i -g vercel
vercel --prod
```

#### Configure
- Set backend URL in environment variables
- Update `VITE_API_URL` to point to your backend

---

### 6. AWS Deployment

#### Using EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone https://github.com/skc147283/splitbill.git
cd splitbill

# Install and build
npm install
cd server && npm install && npm run build
cd ../client && npm install && npm run build

# Start with PM2
sudo npm install -g pm2
pm2 start server/dist/index.js --name "splitbill-api"
pm2 start "npm run dev" --name "splitbill-client"
pm2 save
```

#### Using ECS with Docker
```bash
# Push Docker image to ECR
aws ecr create-repository --repository-name splitbill-server
docker tag splitbill-server:latest <AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/splitbill-server:latest
docker push <AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/splitbill-server:latest
```

---

### 7. DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Select GitHub and your repository
4. Configure services:
   - **Backend**: Node.js environment
   - **Frontend**: Static Site
5. Set environment variables
6. Deploy

---

## Environment Variables Required

### Backend
```
PORT=5000                              # Server port
JWT_SECRET=your-secure-secret-key      # JWT signing secret
DATABASE_PATH=./splitbill.db           # Database file path
NODE_ENV=production                    # Environment
```

### Frontend
```
VITE_API_URL=http://localhost:5000     # Backend API URL
```

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a secure random value
- [ ] Set `NODE_ENV=production`
- [ ] Update backend URL in frontend config
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Set up monitoring
- [ ] Configure CORS properly
- [ ] Rate limiting on API
- [ ] Input validation on backend

---

## CI/CD with GitHub Actions

The project includes GitHub Actions workflow (`.github/workflows/build.yml`) that:
- Builds backend on Node 18 and 20
- Builds frontend on Node 18 and 20
- Builds Docker images
- Validates TypeScript compilation
- Uploads build artifacts

The workflow runs on:
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

---

## Monitoring & Logging

### Recommended Tools
- **Monitoring**: Datadog, New Relic, or AWS CloudWatch
- **Logging**: ELK Stack, Splunk, or LogRocket
- **Error Tracking**: Sentry or Rollbar
- **Performance**: Lighthouse CI or WebPageTest

### Basic Logging Setup
Add to `server/src/index.ts`:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## Database Backup Strategy

### For SQLite (Self-Hosted)
```bash
# Daily backup script
0 2 * * * cp /app/splitbill.db /backups/splitbill-$(date +\%Y\%m\%d).db
```

### For Cloud Deployment
- Use managed database services (PostgreSQL on Heroku/Railway)
- Enable automated backups
- Set retention policies

---

## Scaling Considerations

1. **Database**: Migrate from SQLite to PostgreSQL for production
2. **Cache**: Add Redis for session management
3. **API**: Use API Gateway and load balancing
4. **CDN**: Use CloudFlare or AWS CloudFront for static assets
5. **Containers**: Use Kubernetes for orchestration

---

For more information, visit: https://github.com/skc147283/splitbill
