# Wow-Nexus

Экосистема микросервисов для инструментов по игре World of Warcraft, построенная на NestJS и Next.js.

## Требования к окружению

Для работы с проектом на локальной машине необходимо установить:

- [nvm](https://github.com/coreybutler/nvm-windows) (или любую другую утилиту для управления версиями Node.js)
- [Docker](https://www.docker.com/products/docker-desktop/)

## Первоначальная настройка

1.  **Установите правильную версию Node.js:**

    ```bash
    nvm use
    ```

    (Проект использует версию, указанную в файле `.nvmrc`)

2.  **Установите зависимости:**

    ```bash
    npm install
    ```

3.  **Создайте файлы конфигурации:**
    Необходимо создать `.env` файлы для каждого сервиса.
    - Создайте файл `apps/api/gateway/.env` со следующим содержимым:

      ```
      PORT=3000
      ```

    - Создайте файл `apps/api/services/user-service/.env` со следующим содержимым:
      ```
      PORT=3001
      DATABASE_URL="postgresql://user:password@localhost:5432/user-db?schema=public"
      ```

## Запуск в режиме разработки

1.  **Запустите инфраструктуру (базы данных):**
    Эта команда запустит контейнеры с PostgreSQL и Redis в фоновом режиме.

    ```bash
    docker-compose up -d
    ```

2.  **Запустите все сервисы:**
    Эта команда одновременно запустит `gateway` и `user-service` в режиме разработки с отслеживанием изменений.
    ```bash
    npm run dev
    ```

После запуска будут доступны:

- **API Gateway**: `http://localhost:3000`
- **User Service**: `http://localhost:3001`

## Развертывание (Production)

Инструкции по развертыванию проекта на сервере будут добавлены позже.
