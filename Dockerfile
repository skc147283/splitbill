# Dockerfile for backend deployment to Render.com
# Build stage
FROM node:18-alpine AS builder

WORKDIR /build

# Copy server package files
COPY server/package*.json ./
RUN npm install

# Copy server source code
COPY server/src ./src
COPY server/tsconfig.json ./

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy built application from builder
COPY --from=builder /build/dist ./dist

# Expose port (Render will override this)
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
