# Stage 1: Build React frontend
FROM node:20 as build

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy all files and build the frontend
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Node.js backend
FROM node:20

WORKDIR /app

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy backend files
COPY backend/ ./

# Copy built frontend files to backend's public directory
COPY --from=build /app/frontend/build ./public

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "index.js"]
