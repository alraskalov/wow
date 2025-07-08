# WoW Nexus - Инструкция по настройке

## 🎯 Режимы разработки

### 🔧 Локальная разработка

**Сценарий**: БД в Docker, сервисы локально. Быстрые hot-reloads, полный доступ к отладке.

```bash
# 1. Установка зависимостей
npm install

# 2. Создать .env файл (скопировать из .env.example)

# 3. Запуск одной командой (БД + миграции + сервисы)
npm run dev:local
```

### 🐳 Docker разработка

**Сценарий**: Все в контейнерах. Близко к продакшну, но медленнее hot-reloads.

```bash
# 1. Создать .env файл (скопировать из .env.example)

# 2. Запуск в Docker
npm run dev:docker
```

## 🛠 Полезные команды

### Локальная разработка

- `npm run dev:local` - Полный запуск (БД + сервисы)
- `npm run docker:dev:up` - Только БД и инфраструктура
- `npm run dev` - Только локальные сервисы

### Docker разработка

- `npm run dev:docker` - Сборка и запуск в Docker
- `npm run docker:prod:build` - Пересборка контейнеров

### Управление БД

- `npm run db:setup` - Применить миграции + генерация Prisma
- `npm run prisma:studio` - Открыть Prisma Studio (http://localhost:5555)
- Adminer: http://localhost:8080 (в dev режиме)

### Остановка

- `npm run docker:dev:down` - Остановить dev инфраструктуру
- `npm run docker:prod:down` - Остановить prod контейнеры

## 🚀 Быстрый старт для нового разработчика

```bash
git clone <repo>
cd <repo>
npm install
cp .env.example .env  # Настроить переменные
npm run dev:local     # Запуск всего стека
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

### "Port already in use"

```bash
npm run docker:prod:down  # Остановить все Docker контейнеры
# или
taskkill /f /im node.exe  # Остановить локальные Node процессы
```

### "Can't reach database server"

```bash
npm run docker:dev:up     # Запустить БД
npm run db:setup          # Применить миграции
```

### После изменений в schema.prisma

```bash
npm run db:setup          # Автоматически сгенерирует Client
```

### Разные версии зависимостей у участников команды

```bash
rm -rf node_modules       # Удалить node_modules (Windows: rmdir /s node_modules)
npm install               # Переустановить с актуальными версиями
npm run db:setup          # Настроить БД
```

⚠️ **Важно**: В проекте исключен `package-lock.json` для гибкости версий. Убедитесь что у всех участников команды совместимые версии Node.js (`>=18.0.0`).

## 🎯 Какой режим выбрать?

- **Локальная разработка** (`npm run dev:local`) - для ежедневной работы
- **Docker разработка** (`npm run dev:docker`) - для тестирования контейнеризации
- **Полный Docker** (`docker-compose up -d`) - для продакшена/CI
