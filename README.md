# CBT Online

<p align="center">
  <img src="mobile/assets/images/icon.png" alt="CBT Online app icon" width="96" />
</p>

CBT Online is a computer-based test app with an Expo mobile client and a Bun, Express, and PostgreSQL backend. Students can take a timed multiple-choice quiz; admins can create, edit, and delete questions.

## Project layout

- `backend/` — Express API, Drizzle ORM schema, and PostgreSQL migrations
- `mobile/` — Expo and React Native app with Expo Router

## Requirements

- [Bun](https://bun.sh/) for dependencies and backend commands
- PostgreSQL
- An Android or iOS device, emulator, or web browser for the Expo app

## Initialize the project

### 1. Set up PostgreSQL

Create a PostgreSQL database named `cbt_db`. For example, using `psql`:

```sql
CREATE DATABASE cbt_db;
```

The backend defaults to `postgres://postgres:postgres@localhost:5432/cbt_db`. If your local PostgreSQL credentials or connection details differ, create `backend/.env` and set:

```dotenv
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/cbt_db
```

Run the initial schema migration:

```bash
cd backend
bun install
bun run db:migrate
```

### 2. Configure and start the backend

The API listens on port `3000` and binds to `0.0.0.0` so devices on your local network can reach it.

```bash
cd backend
bun run server
```

### 3. Configure and start the mobile app

Create `mobile/.env` with the API base URL:

```dotenv
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_ADDRESS:3000/api
```

Use `localhost` if the app runs on the same computer. For a physical device, use your computer's local network IP and keep both devices on the same network. For an emulator, use the host address supported by that emulator.

Install dependencies and start Expo:

```bash
cd mobile
bun install
bun run start
```

Open the app from the Expo terminal on a device, emulator, or web browser. Restart Expo after changing `.env` so it reloads the API URL. If Expo Go is incompatible with the installed SDK or native modules, use a compatible development build.

## API routes

All routes use the `/api` prefix.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/questions` | List quiz questions without answer keys |
| `POST` | `/api/submit` | Submit answers and return score, correct count, and question count |
| `GET` | `/api/admin/questions` | List questions including answer keys |
| `POST` | `/api/admin/questions` | Create a question |
| `PUT` | `/api/admin/questions/:id` | Update a question |
| `DELETE` | `/api/admin/questions/:id` | Delete a question |

Submit answers as JSON, for example:

```json
{ "answers": { "1": "A", "2": "C" } }
```

The admin routes currently have no authentication; restrict access before exposing the API beyond local development.

## Useful commands

Run these from their respective directories:

```bash
# Backend
bun run typecheck
bun run db:generate  # generate a migration after changing the schema
bun run db:migrate

# Mobile
bun run lint
bun run android
bun run ios
bun run web
```
