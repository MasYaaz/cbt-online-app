# CBT Online

<p align="center">
  <img src="mobile/assets/images/icon.png" alt="CBT Online app icon" width="96" />
</p>

CBT Online is a computer-based test app with an Expo mobile client and a Bun/Express API. The API serves quiz questions and scores submitted answers.

## Project layout

- `backend/` — Express API written in TypeScript
- `mobile/` — Expo and React Native app using Expo Router

## Requirements

- [Bun](https://bun.sh/) for installing dependencies and running both projects
- An Android or iOS device, emulator, or web browser for the Expo app

## Initialize and run

Install dependencies in each project directory:

```bash
cd backend
bun install / npm install

cd ../mobile
bun install / npm install
```

Configure the mobile app to reach the API. Create `mobile/.env` with:

```dotenv
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_ADDRESS:3000/api
```

Replace `YOUR_COMPUTER_ADDRESS` with an address reachable from the device running the app. For a physical device, use your computer's local network IP and keep both devices on the same network. For an emulator, use the host address supported by that emulator. The API listens on port `3000`.

Start the API in one terminal:

```bash
cd backend
bun run server
```

Start Expo in another terminal:

```bash
cd mobile
bun run start
```

Use the Expo terminal to open the app on a device, emulator, or web. If Expo Go cannot run the project's installed SDK, use a compatible development build.

> [!NOTE]
> Restart Expo after changing `EXPO_PUBLIC_API_URL` so the updated environment value is loaded.

## API

The backend currently provides:

- `GET /api/questions` — returns quiz questions without answer keys
- `POST /api/submit` — accepts `{ "answers": { "1": "A" } }` and returns the score, correct answer count, and total questions

## Useful commands

```bash
# Backend type check
cd backend && bun run typecheck

# Mobile lint
cd mobile && bun run lint

# Start Expo for a specific target
cd mobile && bun run android
cd mobile && bun run ios
cd mobile && bun run web
```
