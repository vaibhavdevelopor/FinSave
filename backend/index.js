import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

let firebaseReady = false;

// Check if the service account file exists
if (fs.existsSync("./serviceAccountKey.json")) {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync("./serviceAccountKey.json", "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseReady = true;
    console.log("✅ Firebase Admin initialized!");
  } catch (err) {
    console.error("❌ Error initializing Firebase Admin:", err);
  }
} else {
  console.warn("⚠️ serviceAccountKey.json not found!");
}

// Routes
app.get("/health", (req, res) => {
  res.json({ ok: true, firebaseReady });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Firestore reference
const db = admin.firestore();

// Test route to write dummy offer
app.post("/test-offer", async (req, res) => {
  try {
    const offer = {
      platform: "Paytm",
      title: "Get 10% Cashback on Mobile Recharge",
      createdAt: new Date(),
    };

    const docRef = await db.collection("offers").add(offer);
    res.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("Error writing offer:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test route to read all offers
app.get("/test-offer", async (req, res) => {
  try {
    const snapshot = await db.collection("offers").get();
    const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, offers });
  } catch (err) {
    console.error("Error reading offers:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all offers
app.get("/offers", async (req, res) => {
  try {
    const snapshot = await db.collection("offers").orderBy("createdAt", "desc").get();

    const offers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ New API route for top offers
app.get("/top-offers", async (req, res) => {
  try {
    const snapshot = await db.collection("offers").limit(3).get();
    const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(offers);
  } catch (error) {
    console.error("Error fetching top offers:", error);
    res.status(500).json({ error: "Failed to fetch top offers" });
  }
});



