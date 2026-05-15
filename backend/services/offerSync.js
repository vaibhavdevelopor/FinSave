import { FieldValue } from "firebase-admin/firestore";
import { getFirestore } from "../lib/firebaseAdmin.js";
import { runAllScrapers } from "../scrapers/index.js";

export async function scrapeOffers() {
  return runAllScrapers();
}

export async function syncOffersToFirestore() {
  const scrapeResult = await runAllScrapers();
  const db = getFirestore();
  let savedCount = 0;

  for (const offer of scrapeResult.offers) {
    const docRef = db.collection("offers").doc(offer.offerId);
    const snapshot = await docRef.get();
    const payload = {
      source: offer.source,
      sourceName: offer.sourceName,
      platform: offer.platform,
      title: offer.title,
      link: offer.link,
      cashbackText: offer.cashbackText,
      cashbackValue: offer.cashbackValue,
      category: offer.category,
      description: offer.description,
      image: offer.image,
      tags: offer.tags,
      isActive: offer.isActive,
      scrapedAt: offer.scrapedAt,
      lastSeenAt: offer.lastSeenAt,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!snapshot.exists) {
      payload.createdAt = FieldValue.serverTimestamp();
    }

    await docRef.set(payload, { merge: true });

    savedCount += 1;
  }

  return {
    ...scrapeResult,
    savedCount,
  };
}
