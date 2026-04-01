import { scrapeCashkaro } from "./cashkaro.js";

export const scrapers = [
  {
    source: "cashkaro",
    sourceName: "CashKaro",
    run: scrapeCashkaro,
  },
];

export async function runAllScrapers() {
  const results = await Promise.all(
    scrapers.map(async (scraper) => {
      try {
        const result = await scraper.run();
        return {
          source: scraper.source,
          sourceName: scraper.sourceName,
          ok: true,
          offers: result.offers,
          fetchedUrl: result.fetchedUrl,
        };
      } catch (error) {
        return {
          source: scraper.source,
          sourceName: scraper.sourceName,
          ok: false,
          offers: [],
          error: error.message,
        };
      }
    })
  );

  const offers = results.flatMap((result) => result.offers);

  return {
    ranAt: new Date().toISOString(),
    sources: results,
    offers,
  };
}
