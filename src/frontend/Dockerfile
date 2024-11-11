# Stage 1: Build the React app
FROM node:18-alpine AS build
ARG BUILD_ENV=production

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you use Yarn)
COPY package*.json ./

# Install dependencies based on the specified environment
RUN npm install --only=$BUILD_ENV

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS serve
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose the port that the application will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
