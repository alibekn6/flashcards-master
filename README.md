# Flashcards Master – core api / client

Это серверная и клиентская часть проекта **Flashcards Master** – приложения для интерактивного обучения с использованием карточек. Сервис позволяет пользователям регистрироваться, входить в систему, создавать карточки, отслеживать прогресс и использовать внешние источники, для автоматической генерации карточек.

## Стек

core-api
- **NestJS** – фреймворк Node.js для серверной части
- **TypeORM** – ORM для PostgreSQL
- **PostgreSQL** – основная база данных
- **JWT (JSON Web Token)** – авторизация и аутентификация
- **Swagger (OpenAPI)** – документация API
- **Jest** – модульное тестирование
- **ESLint + Prettier + Husky + lint-staged** – обеспечение качества кода

client
- **React** – фреймворк клиентской части

---

## 🛠 Установка и запуск сервера

```bash
# 1. Клонировать репозиторий
git clone https://github.com/alibekn6/flashcards-master
cd flashcards-api

# 2. Установить зависимости
npm install

# 3. Создать .env файл
.env
# отредактируйте .env и укажите свои значения (DB_USER, DB_PASSWORD, JWT_SECRET and so on)

# 4. Запустить PostgreSQL
pgadmin / psql на юникс системах через терминал
- psql -U {username} -d
- CREATE DATABASE flashcards, \q
- psql -U {username} -d flashcards
или сделать тоже самое на графическом интерфейсе

# 5. Запустить сервер
npm run start:dev
