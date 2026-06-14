# Stage 1: build
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: production
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
# Копируем миграции
COPY --from=builder /app/prisma/migrations ./prisma/migrations
EXPOSE 3000
# Запускаем миграции и приложение
CMD npx prisma migrate deploy && npm run start:prod