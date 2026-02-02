# Base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from base stage
COPY --from=base /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main"]

# Development stage
FROM base AS development

WORKDIR /app

# Expose port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Start the application in development mode
CMD ["npm", "run", "start:dev"]
