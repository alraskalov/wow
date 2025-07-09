# WoW Nexus - Инструкция по настройке

## 🎯 Режимы разработки

### 🔧 Локальная разработка

**Сценарий**: БД в Docker, сервисы локально. Быстрые hot-reloads, полный доступ к отладке.

```bash
# 1. Полная установка и настройка (для первого запуска)
npm run setup

# 2. Создать .env файл (скопировать из .env.example)

# 3. Запуск разработки
npm run dev
```

### 🐳 Docker разработка

**Сценарий**: Все в контейнерах. Близко к продакшну, но медленнее hot-reloads.

```bash
# 1. Создать .env файл (скопировать из .env.example)

# 2. Запуск в Docker
npm run dev:docker
```

## 🛠 Основные команды

### Разработка

- `npm run setup` - 🚀 Полная установка и настройка (первый запуск)
- `npm run dev:local` - 💻 Локальная разработка (БД в Docker, сервисы локально)
- `npm run dev:docker` - 🐳 Docker разработка (всё в контейнерах)
- `npm run dev` - ⚡ Только локальные сервисы

### База данных

- `npm run db:setup` - 📊 Применить миграции + генерация Prisma
- `npm run db:studio` - 🔍 Prisma Studio (http://localhost:5555)
- `npm run db:generate` - 🔧 Генерация Prisma клиента
- `npm run db:migrate` - 📈 Применить миграции

### Docker

- `npm run docker:up` - ⬆️ Запустить инфраструктуру (БД, Redis)
- `npm run docker:down` - ⬇️ Остановить инфраструктуру
- `npm run docker:build` - 🔨 Сборка и запуск всех сервисов
- `npm run docker:logs` - 📋 Логи инфраструктуры
- `npm run docker:deploy` - 🚀 Production деплой

### Отладка

- `npm run stop` - 🛑 Остановить Node.js процессы
- `npm run ports` - 🔍 Показать занятые порты (3000, 3001)

## 🚀 Быстрый старт для нового разработчика

```bash
git clone <repo>
cd <repo>
cp .env.example .env  # Настроить переменные
npm run setup         # Полная установка и настройка
npm run dev:local     # Запуск в локальном режиме
```

## 🔍 Порты и сервисы

### Локальная разработка

- Gateway: http://localhost:3000
- User Service: http://localhost:3001
- PostgreSQL: localhost:5432
- Prisma Studio: http://localhost:5555
- Adminer: http://localhost:8080

### Docker разработка

- Все то же самое, но сервисы запущены в контейнерах

## ❌ Устранение проблем

### "Port already in use" / Gateway падает при запуске

```bash
# Остановить все Node.js процессы
npm run stop

# Проверить какие порты заняты
npm run ports

# Остановить Docker контейнеры
npm run docker:down
```

**Причина**: Обычно остаются фоновые процессы от предыдущих запусков.

### "Can't reach database server"

```bash
npm run docker:dev:up     # Запустить БД
npm run db:setup          # Применить миграции
```

### После изменений в schema.prisma

```bash
npm run db:setup          # Автоматически сгенерирует Client
```

### Ошибки Prisma в Windows (EPERM)

```bash
# Удалить папку .prisma и перегенерировать
Remove-Item -Path "node_modules/.prisma" -Recurse -Force -ErrorAction SilentlyContinue
npm run docker:up
npm run db:generate
```

### Разные версии зависимостей у участников команды

```bash
rm -rf node_modules       # Удалить node_modules (Windows: rmdir /s node_modules)
npm run setup             # Полная переустановка с настройкой
```

⚠️ **Важно**: В проекте исключен `package-lock.json` для гибкости версий. Убедитесь что у всех участников команды совместимые версии Node.js (`>=18.0.0`).

## 🎯 Какой режим выбрать?

- **Локальная разработка** (`npm run dev:local`) - для ежедневной работы
- **Docker разработка** (`npm run dev:docker`) - для тестирования контейнеризации
- **Полный Docker** (`docker-compose up -d`) - для продакшена/CI
