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

# Copy package files again, but only install production deps
COPY package*.json ./
RUN npm install --only=production

# Expose the port (Render will set process.env.PORT, but 3000 is typical)
EXPOSE 3000

# Start the app (point to where Nest actually puts main.js)
CMD ["node", "dist/src/main.js"]
