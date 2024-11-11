# Stage 1: Build the React application
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the application with next start
FROM node:18 AS runtime

# Set working directory
WORKDIR /app

# Copy build files from the builder stage
COPY --from=builder /app ./

# Expose the port Next.js will run on (default: 3000)
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
