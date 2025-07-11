# ===========================================
# Базовый образ для всех этапов
# ===========================================
FROM node:20-alpine AS base
WORKDIR /app

# Установка необходимых пакетов
RUN apk add --no-cache libc6-compat curl

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Копирование файлов зависимостей
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/gateway/package*.json ./apps/api/gateway/

# ===========================================
# Этап установки зависимостей
# ===========================================
FROM base AS deps
# Установка turbo глобально
RUN npm install -g turbo

# Копирование всей монорепы
COPY . .

# Создание "облегченной" версии монорепы для gateway
RUN turbo prune --scope=@wow-nexus/gateway --docker

# Установка зависимостей
RUN npm install

# ===========================================
# Этап сборки для разработки
# ===========================================
FROM base AS development
WORKDIR /app

# Копирование зависимостей из этапа deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/package-lock.json .

# Копирование исходного кода
COPY --from=deps /app/out/full/ .

# Возврат в корневую директорию
WORKDIR /app

USER nestjs

# ===========================================
# Этап сборки для продакшена
# ===========================================
FROM base AS builder
WORKDIR /app

# Копирование зависимостей из этапа deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/package-lock.json .

# Копирование исходного кода
COPY --from=deps /app/out/full/ .

# Сборка приложения
WORKDIR /app/apps/api/gateway
RUN npm run build

# ===========================================
# Этап установки production зависимостей
# ===========================================
FROM base AS production-deps
WORKDIR /app

# Копирование package.json и установка только production зависимостей
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/package-lock.json .
RUN npm install --omit=dev

# ===========================================
# Финальный production образ
# ===========================================
FROM node:20-alpine AS production
WORKDIR /app

# Установка необходимых пакетов
RUN apk add --no-cache libc6-compat curl

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Копирование production зависимостей
COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Копирование собранного приложения
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/gateway/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/gateway/package.json ./package.json

USER nestjs

# Открытие порта
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "start:prod"] 