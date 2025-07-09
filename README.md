# Wow-Nexus

Экосистема микросервисов для инструментов по игре World of Warcraft, построенная на NestJS и Next.js.

## Требования к окружению

Для работы с проектом на локальной машине необходимо установить:

- [nvm](https://github.com/coreybutler/nvm-windows) (или любую другую утилиту для управления версиями Node.js)
- [Docker](https://www.docker.com/products/docker-desktop/)

## 🚀 Быстрый старт

```bash
git clone https://github.com/alraskalov/wow-nexus.git
cd wow-nexus
cp .env.example .env  # Настроить переменные
npm run setup         # Полная установка и настройка
npm run dev:local     # Запуск в локальном режиме
```

## 📋 Основные команды

### Разработка

- `npm run setup` - 🚀 Полная установка (первый раз)
- `npm run dev:local` - 💻 Локальная разработка
- `npm run dev:docker` - 🐳 Docker разработка
- `npm run dev` - ⚡ Только сервисы

### База данных

- `npm run db:setup` - 📊 Миграции + генерация
- `npm run db:studio` - 🔍 Prisma Studio

### Docker

- `npm run docker:up` - ⬆️ Запуск инфраструктуры
- `npm run docker:down` - ⬇️ Остановка

### Отладка

- `npm run stop` - 🛑 Остановить процессы
- `npm run ports` - 🔍 Показать порты

📖 **Подробная документация**: [SETUP.md](./SETUP.md)

## Запуск с помощью Docker

Для запуска всего проекта в режиме разработки выполните одну команду:

```bash
docker-compose up -d --build
```

Эта команда сделает следующее:

- Соберет Docker-образ для `user-service`.
- Запустит контейнеры: `user-service`, `user-db` (PostgreSQL) и `redis`.
- `user-service` будет запущен в режиме `watch` с hot-reload. Любые изменения в его исходном коде будут автоматически подхвачены.

После запуска будут доступны:

- **User Service API**: `http://localhost:3001` (порт настроен в `docker-compose.override.yml`)
- **PostgreSQL**: доступен на порту `5432` (настроен в `.env`)
- **Redis**: доступен на порту `6379`

## Остановка окружения

Чтобы остановить все запущенные контейнеры, выполните:

```bash
docker-compose down
```

Эта команда остановит и удалит контейнеры, но сохранит данные в `volumes` (например, данные базы данных).

## Развертывание (Production)

Инструкции по развертыванию проекта на сервере будут добавлены позже.
