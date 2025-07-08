# --- Builder Stage ---
# Используем полный образ Node.js для сборки, так как он содержит все необходимые инструменты.
FROM node:20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем Turborepo глобально
RUN npm install -g turbo

# Копируем все файлы проекта
# .dockerignore должен исключить ненужные файлы, такие как node_modules
COPY . .

# Создаем "облегченную" версию монорепы только с зависимостями для user-service
RUN turbo prune --scope=@wow-nexus/user-service --docker

# --- Installation Stage ---
# Создаем отдельный слой для установки зависимостей
FROM node:20 AS installer

WORKDIR /app

# Копируем "облегченные" package.json и lock-файл
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json .

# Устанавливаем зависимости
RUN npm install

# --- Final Build Stage ---
# Возвращаемся к builder-образу, но используем установленные зависимости
FROM node:20 AS final-builder

WORKDIR /app

# Копируем исходный код "облегченной" версии
COPY --from=builder /app/out/full/ .
# Копируем установленные node_modules
COPY --from=installer /app/node_modules ./node_modules

# Запускаем сборку конкретного приложения
RUN npx turbo run build --filter=@wow-nexus/user-service

# --- Production Dependencies Installer Stage ---
# Устанавливаем ТОЛЬКО production-зависимости для финального образа
FROM node:20 AS prod-installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json .
RUN npm install --omit=dev

# --- Production Stage ---
# Используем легковесный образ Alpine Linux для продакшена.
FROM node:20-alpine AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Создаем пользователя с ограниченными правами
RUN addgroup -S node && adduser -S node -G node

# Копируем production-зависимости и меняем владельца
COPY --from=prod-installer --chown=node:node /app/node_modules ./node_modules
# Копируем собранный код и меняем владельца
COPY --from=final-builder --chown=node:node /app/apps/api/services/user-service/dist ./dist
# Копируем package.json и меняем владельца
COPY --from=final-builder --chown=node:node /app/apps/api/services/user-service/package.json .
# Копируем схему Prisma, необходимую для работы Prisma Client, и меняем владельца
COPY --from=final-builder --chown=node:node /app/apps/api/services/user-service/prisma ./prisma

# Переключаемся на пользователя с ограниченными правами
USER node

# Указываем команду для запуска приложения
CMD ["node", "dist/main.js"] 