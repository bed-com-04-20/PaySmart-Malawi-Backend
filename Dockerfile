# 1) Base image
FROM node:18-alpine

# 2) Create app directory
WORKDIR /usr/src/app

# 3) Copy package files & install
COPY package*.json ./
RUN npm install --only=production

# 4) Copy the rest of your code
COPY . .

# 5) Build your NestJS app (this assumes you have "build" script in package.json)
RUN npm run build

# 6) Expose the port
EXPOSE 3000

# 7) Command to run the app (looking for main.js in /dist folder)
CMD [ "node", "dist/main.js" ]
