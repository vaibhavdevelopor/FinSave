# FinSave

FinSave is a full-stack cashback discovery platform that helps users find, compare, and monitor live reward offers across payment and commerce platforms.

It combines a premium React frontend with a backend ingestion pipeline that scrapes, normalizes, and syncs offers into Firestore for a fast, modern discovery experience.

## Live Demo

[FinSave on Render](https://finsave-dalp.onrender.com)

## Features

- Firebase authentication with email/password and Google sign-in
- Premium dashboard with live offer metrics and highlighted opportunities
- Discover view for browsing and searching synced offers
- Profile and settings pages with account-level controls
- Firestore-backed offer storage and dynamic stats
- Automated backend scraping, normalization, and sync flow
- Render-ready backend service with daily sync job support
- Responsive UI with motion, theme switching, and premium layouts

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router

### Backend

- Node.js
- Express
- Axios
- Cheerio
- Firebase Admin SDK

### Data & Auth

- Firebase Auth
- Cloud Firestore

### Deployment

- Render

## Architecture

### Frontend

The frontend includes:

- protected routes for authenticated users
- dashboard, discover, profile, and settings experiences
- premium responsive UI with theme support
- Firestore-backed stats and offer views

### Backend

The backend includes:

- scraper registry and source-specific scrapers
- offer normalization and deduplication helpers
- Firestore sync flow
- cron-friendly commands for scheduled refresh
- API endpoints for offers and top offers

## Project Structure

```text
FinSave/
+-- backend/
¦   +-- lib/
¦   +-- scrapers/
¦   +-- services/
¦   +-- server.js
¦   +-- syncOffers.js
+-- public/
+-- src/
¦   +-- components/
¦   +-- context/
¦   +-- pages/
¦   +-- styles/
¦   +-- firebase.js
+-- render.yaml
+-- RENDER_SETUP.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/vaibhavdevelopor/FinSave.git
cd FinSave
```

### 2. Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
cd ..
```

### 3. Configure environment variables

Create `.env.local` for the frontend:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_BASE_URL=http://localhost:5001
```

For backend local development, either place `serviceAccountKey.json` inside `backend/` or configure:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## Run Locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

## Scraping & Sync Commands

From the `backend/` folder:

Preview scraped offers:

```bash
npm run scrape
```

Scrape and persist to Firestore:

```bash
npm run sync
```

## Render Deployment

This repo includes:

- `render.yaml` for Render service configuration
- `RENDER_SETUP.md` for deployment notes

The deployment setup supports:

- backend web service
- daily cron job for syncing offers
- Firebase Admin credentials via environment variables

## Screenshots

### Authentication

<img width="1919" height="829" alt="image" src="https://github.com/user-attachments/assets/531c6bc6-0ce8-4b3f-9036-f081a52ea13b" />



### Dashboard

<img width="1919" height="827" alt="image" src="https://github.com/user-attachments/assets/c813712a-7190-4768-bc26-196aa3714da9" />


### Discover Offers

<img width="1919" height="823" alt="image" src="https://github.com/user-attachments/assets/b4077b60-e811-4d74-8868-2cbf9e98cdaa" />


## Resume-Ready Summary

FinSave demonstrates:

- full-stack product development
- Firebase authentication and Firestore integration
- backend data ingestion and synchronization
- UI/UX design and responsive frontend engineering
- deployment and scheduled background jobs

## Author

Vaibhav Sharma

- GitHub: [vaibhavdevelopor](https://github.com/vaibhavdevelopor)
