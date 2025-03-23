# --------------------------
# 1) Builder stage
# --------------------------
FROM node:18-alpine as builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --------------------------
# 2) Final stage
# --------------------------
FROM node:18-alpine

WORKDIR /app

# Copy only compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy package files to install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Expose the port (Render will set process.env.PORT)
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]

