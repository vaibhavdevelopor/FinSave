import { getFirebaseStatus } from "./lib/firebaseAdmin.js";
import { scrapeOffers, syncOffersToFirestore } from "./services/offerSync.js";

async function main() {
  const persist = process.argv.includes("--persist");
  const firebaseStatus = getFirebaseStatus();

  if (persist && !firebaseStatus.firebaseReady) {
    console.error("Firebase is not ready. Cannot persist scraped offers.");
    process.exit(1);
  }

  const result = persist ? await syncOffersToFirestore() : await scrapeOffers();

  console.log(
    JSON.stringify(
      {
        ranAt: result.ranAt,
        totalOffers: result.offers.length,
        savedCount: result.savedCount ?? 0,
        sources: result.sources.map((source) => ({
          source: source.source,
          ok: source.ok,
          offers: source.offers.length,
          error: source.error ?? null,
        })),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error("Offer sync failed:", error);
  process.exit(1);
});
