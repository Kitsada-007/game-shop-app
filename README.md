# Game Shop App

This repository contains a full-stack game shop application with a Node.js/TypeScript backend and an Angular frontend.

## Project structure

- `backend/` - Node.js API server using TypeScript
- `frontend/` - Angular web client
- `docker-compose.yml` - local Docker setup for MySQL, backend, and frontend
- `init.sql` - MySQL initialization script for the application database

## Supported services

- MySQL 8
- Node.js 20
- Angular 21

## Run locally with Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- MySQL: `localhost:3306`

To rebuild without cache:

```bash
docker compose build --no-cache
docker compose up --force-recreate
```

## Run backend locally without Docker

```bash
cd backend
npm install
npm run build
npm start
```

The backend reads environment variables from `backend/.env`.

Example `.env` values:

```env
DB_HOST=localhost
DB_USER=appuser
DB_PASS=apppass
DB_NAME=game_shop
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run frontend locally without Docker

```bash
cd frontend
npm install
npm start
```

Open the app at:

```text
http://localhost:4200
```

## Database

The database initialization script is `init.sql`.
It creates the `game_shop` database and initial tables for:

- users
- games
- promo_codes
- orders
- order_items
- user_games
- user_promo_usage

## Notes

- Frontend uses Angular dev server and should be reachable at `http://localhost:4200`.
- Backend is an API server and may not serve a web page at root `/`.
- If you see database access errors, ensure `backend/.env` and `docker-compose.yml` use the same database name.
