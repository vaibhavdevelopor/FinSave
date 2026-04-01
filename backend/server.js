import express from "express";
import cors from "cors";
import { getFirebaseStatus, getFirestore } from "./lib/firebaseAdmin.js";
import { scrapeOffers, syncOffersToFirestore } from "./services/offerSync.js";

const app = express();
app.use(cors());
app.use(express.json());

const { firebaseReady, firebaseInitError } = getFirebaseStatus();

function requireDb(res) {
  if (!firebaseReady) {
    res.status(503).json({
      success: false,
      error: firebaseInitError || "Firebase Admin is not initialized.",
    });
    return null;
  }

  return getFirestore();
}

app.get("/health", (req, res) => {
  res.json({ ok: true, firebaseReady, firebaseInitError });
});

app.get("/offers", async (req, res) => {
  const db = requireDb(res);
  if (!db) {
    return;
  }

  try {
    const snapshot = await db
      .collection("offers")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const offers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/top-offers", async (req, res) => {
  const db = requireDb(res);
  if (!db) {
    return;
  }

  try {
    const snapshot = await db
      .collection("offers")
      .where("isActive", "==", true)
      .orderBy("cashbackValue", "desc")
      .limit(6)
      .get();

    const offers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching top offers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/scrape-offers", async (req, res) => {
  try {
    const result = await scrapeOffers();

    res.json({
      success: true,
      ranAt: result.ranAt,
      totalOffers: result.offers.length,
      sources: result.sources.map((source) => ({
        source: source.source,
        sourceName: source.sourceName,
        ok: source.ok,
        offers: source.offers.length,
        fetchedUrl: source.fetchedUrl ?? null,
        error: source.error ?? null,
      })),
      offers: result.offers,
    });
  } catch (error) {
    console.error("Error scraping offers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/sync-offers", async (req, res) => {
  if (!firebaseReady) {
    res.status(503).json({
      success: false,
      error: firebaseInitError || "Firebase Admin is not initialized.",
    });
    return;
  }

  try {
    const result = await syncOffersToFirestore();

    res.json({
      success: true,
      ranAt: result.ranAt,
      totalOffers: result.offers.length,
      savedCount: result.savedCount,
      sources: result.sources.map((source) => ({
        source: source.source,
        sourceName: source.sourceName,
        ok: source.ok,
        offers: source.offers.length,
        fetchedUrl: source.fetchedUrl ?? null,
        error: source.error ?? null,
      })),
    });
  } catch (error) {
    console.error("Error syncing offers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/test-offer", async (req, res) => {
  const db = requireDb(res);
  if (!db) {
    return;
  }

  try {
    const offer = {
      platform: "Paytm",
      title: "Get 10% Cashback on Mobile Recharge",
      createdAt: new Date(),
      isActive: true,
    };

    const docRef = await db.collection("offers").add(offer);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error writing offer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
