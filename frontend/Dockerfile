# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
# Копируем папки app и lib (они нужны для маршрутизации)
COPY --from=builder /app/app ./app
COPY --from=builder /app/lib ./lib
EXPOSE 3000
CMD ["npm", "run", "start"]