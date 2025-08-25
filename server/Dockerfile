# Stage 1: Build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Runtime
FROM node:18-slim
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./
EXPOSE 5000
CMD ["npm", "run", "start"]
