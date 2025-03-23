# -----------------------
# 1) Builder stage
# -----------------------
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# -----------------------
# 2) Final stage
# -----------------------
FROM node:20-alpine as runner

WORKDIR /app

# Copy compiled output from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Copy the Firebase JSON file
COPY paysmart-malawi-firebase-adminsdk-fbsvc-2fe77fc295.json ./paysmart-malawi-firebase-adminsdk-fbsvc-2fe77fc295.json

# Copy package.json again, but install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Expose the port (Render sets process.env.PORT, but we note 3000)
EXPOSE 3000

# Start the app (point to wherever Nest puts main.js)
CMD ["node", "dist/src/main.js"]
