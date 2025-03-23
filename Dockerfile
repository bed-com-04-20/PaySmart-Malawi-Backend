# -----------------------
# 1) Builder stage
# -----------------------
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -----------------------
# 2) Final stage
# -----------------------
FROM node:18-alpine

WORKDIR /app

# Copy only compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy package files again, but only install production deps
COPY package*.json ./
RUN npm install --only=production

# Expose the port (Render will set PORT, but we note 3000 here for convenience)
EXPOSE 3000

# Start the app
CMD ["node", "dist/src/main.js"]

