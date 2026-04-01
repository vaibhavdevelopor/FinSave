import { FieldValue } from "firebase-admin/firestore";
import { getFirestore } from "../lib/firebaseAdmin.js";
import { runAllScrapers } from "../scrapers/index.js";

export async function scrapeOffers() {
  return runAllScrapers();
}

export async function syncOffersToFirestore() {
  const scrapeResult = await runAllScrapers();
  const db = getFirestore();
  const batch = db.batch();
  let savedCount = 0;

  for (const offer of scrapeResult.offers) {
    const docRef = db.collection("offers").doc(offer.offerId);

    batch.set(
      docRef,
      {
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
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    savedCount += 1;
  }

  if (savedCount > 0) {
    await batch.commit();
  }

  return {
    ...scrapeResult,
    savedCount,
  };
}
