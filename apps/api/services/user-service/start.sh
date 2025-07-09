#!/bin/sh

echo "🚀 Запуск User Service..."

# Применяем миграции
echo "📊 Применение миграций базы данных..."
npx prisma migrate deploy

# Проверяем подключение к БД
echo "🔍 Проверка подключения к базе данных..."
npx prisma db pull --preview-feature 2>/dev/null || echo "⚠️  Предупреждение: не удалось проверить схему БД"

echo "✅ Запуск приложения..."
# Запускаем приложение
exec node dist/main.js 