# Dockerfile for backend deployment to Render.com
# This is the server/backend deployment

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY server/src ./src
COPY server/tsconfig.json ./

# Build the application
RUN npm run build

# Start the application
CMD ["node", "dist/index.js"]
