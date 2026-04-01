import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");

let firebaseReady = false;
let firebaseInitError = null;

function getServiceAccountFromEnv() {
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
  } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null;
  }

  return {
    project_id: FIREBASE_PROJECT_ID,
    client_email: FIREBASE_CLIENT_EMAIL,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

function getServiceAccountFromFile() {
  if (!fs.existsSync(serviceAccountPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

if (!admin.apps.length) {
  try {
    const serviceAccount =
      getServiceAccountFromEnv() || getServiceAccountFromFile();

    if (!serviceAccount) {
      throw new Error(
        "Firebase credentials not found. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, or provide backend/serviceAccountKey.json."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseReady = true;
    console.log("Firebase Admin initialized.");
  } catch (error) {
    firebaseInitError = error;
    console.error("Failed to initialize Firebase Admin:", error.message);
  }
} else {
  firebaseReady = true;
}

export function getFirestore() {
  if (!admin.apps.length) {
    throw firebaseInitError ?? new Error("Firebase Admin is not initialized.");
  }

  return admin.firestore();
}

export function getFirebaseStatus() {
  return {
    firebaseReady,
    firebaseInitError: firebaseInitError?.message ?? null,
  };
}

export { admin };
