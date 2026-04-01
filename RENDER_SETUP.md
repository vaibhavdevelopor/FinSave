## Render Setup

This project is now ready for a daily offer sync on Render.

### What the cron job does

- Runs `npm run sync` inside [backend/package.json](/C:/vaibhav/FinSave/backend/package.json)
- Scrapes supported sources
- Writes normalized offers into Firestore

### Files involved

- [render.yaml](/C:/vaibhav/FinSave/render.yaml)
- [backend/server.js](/C:/vaibhav/FinSave/backend/server.js)
- [backend/syncOffers.js](/C:/vaibhav/FinSave/backend/syncOffers.js)
- [backend/lib/firebaseAdmin.js](/C:/vaibhav/FinSave/backend/lib/firebaseAdmin.js)

### Required Render environment variables

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

For `FIREBASE_PRIVATE_KEY`, paste the private key as a single env var value and keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines. Escaped `\n` line breaks are supported.

### Recommended frontend env var

For deployed frontend notifications, set:

- `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com`

### Schedule

The cron schedule in [render.yaml](/C:/vaibhav/FinSave/render.yaml) is:

- Every day at `02:00` UTC

You can change that later in Render or in `render.yaml`.
