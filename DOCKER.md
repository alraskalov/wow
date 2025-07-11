# Docker Architecture для Warcraft Nexus

## Обзор архитектуры

Проект использует монорепозиторий с Turborepo и состоит из следующих компонентов:

### Сервисы

- **PostgreSQL** (порт 5432) - основная база данных
- **Redis** (порт 6379) - кеширование
- **User Service** (порт 3001) - NestJS микросервис для пользователей
- **API Gateway** (порт 3000) - NestJS шлюз для API
- **Frontend** (порт 3002) - Next.js приложение
- **Nginx** (порт 80/443) - reverse proxy (только для продакшена)

## Порядок запуска

1. **PostgreSQL** - база данных
2. **Redis** - кеширование
3. **User Service** - микросервис пользователей (с миграциями Prisma)
4. **API Gateway** - API шлюз
5. **Frontend** - веб-приложение
6. **Nginx** - reverse proxy (только продакшен)

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

### Основные переменные:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` - настройки PostgreSQL
- `REDIS_URL` - URL для подключения к Redis
- `DATABASE_URL` - полный URL для подключения к базе данных
- `USER_SERVICE_PORT`, `GATEWAY_PORT`, `FRONTEND_PORT` - порты сервисов

## Команды для разработки

### Запуск в режиме разработки

```bash
# Запуск всех сервисов
npm run docker:dev

# Остановка
npm run docker:dev:down

# Просмотр логов
npm run docker:dev:logs

# Сборка образов
npm run docker:build
```

### Запуск в продакшене

```bash
# Запуск всех сервисов
npm run docker:prod

# Остановка
npm run docker:prod:down

# Просмотр логов
npm run docker:prod:logs

# Сборка образов
npm run docker:build:prod
```

## Доступные сервисы

### Разработка

- **Frontend**: http://localhost:3002
- **API Gateway**: http://localhost:3000
- **User Service**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Продакшен

- **Frontend**: http://localhost (через Nginx)
- **API**: http://localhost/api (через Nginx)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Особенности архитектуры

### Multi-stage Dockerfile

Каждый сервис использует multi-stage сборку:

- `base` - базовый образ
- `deps` - установка зависимостей
- `development` - для разработки с hot reload
- `builder` - сборка приложения
- `production` - оптимизированный продакшен образ

### Безопасность

- Все контейнеры запускаются от непривилегированных пользователей
- Используются Alpine Linux образы для уменьшения размера
- Health checks для всех сервисов

### Оптимизация

- Использование Turbo для кеширования сборки
- Объемы для данных PostgreSQL и Redis
- Hot reload для разработки
- Standalone режим для Next.js

## Миграции базы данных

Миграции Prisma выполняются автоматически при запуске User Service:

1. Ожидание готовности PostgreSQL
2. Выполнение `prisma migrate deploy`
3. Запуск приложения

## Мониторинг

### Health Checks

- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- Сервисы: HTTP health endpoints

### Логирование

```bash
# Логи всех сервисов
npm run docker:dev:logs

# Логи конкретного сервиса
docker-compose -f docker-compose.dev.yml logs -f user-service
```

## Troubleshooting

### Проблемы с подключением к базе данных

```bash
# Проверка статуса PostgreSQL
docker-compose -f docker-compose.dev.yml exec postgres pg_isready

# Подключение к базе данных
docker-compose -f docker-compose.dev.yml exec postgres psql -U warcraft -d warcraft_db
```

### Пересборка образов

```bash
# Полная пересборка
docker-compose -f docker-compose.dev.yml build --no-cache

# Пересборка конкретного сервиса
docker-compose -f docker-compose.dev.yml build --no-cache user-service
```

### Очистка

```bash
# Остановка и удаление контейнеров
docker-compose -f docker-compose.dev.yml down -v

# Удаление всех образов
docker system prune -a
```
