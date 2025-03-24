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

# Start the container by first running migrations, then starting the app
# We assume you have "typeorm" in your production deps. If you have a script "migration:run" in package.json, you can do: "npm run migration:run"
CMD ["/bin/sh", "-c", "npx typeorm migration:run -d dist/data-source.js && node dist/main.js"]

