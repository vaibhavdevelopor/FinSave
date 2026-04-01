function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseCashbackValue(text) {
  if (!text) {
    return null;
  }

  const rupeeMatch = String(text).match(/(?:rs\.?|inr|₹)\s*([\d,]+)/i);
  if (rupeeMatch) {
    return Number(rupeeMatch[1].replace(/,/g, ""));
  }

  const percentMatch = String(text).match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    return Number(percentMatch[1]);
  }

  return null;
}

function normalizeUrl(url, baseUrl) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return String(url).trim();
  }
}

function createOfferId({ source, platform, title, link }) {
  const key = [source, platform, title, link]
    .map((item) => slugify(item))
    .filter(Boolean)
    .join("__");

  return key || `offer__${Date.now()}`;
}

export function normalizeOffer(rawOffer, scraperMeta = {}) {
  const platform = normalizeWhitespace(
    rawOffer.platform || scraperMeta.platform || scraperMeta.sourceName || ""
  );
  const title = normalizeWhitespace(rawOffer.title);
  const cashbackText = normalizeWhitespace(
    rawOffer.cashbackText || rawOffer.cashback || ""
  );
  const description = normalizeWhitespace(rawOffer.description || "");
  const link = normalizeUrl(rawOffer.link, scraperMeta.baseUrl);

  if (!platform || !title || !link) {
    return null;
  }

  const source = rawOffer.source || scraperMeta.source || "unknown";
  const fetchedAt = new Date().toISOString();

  return {
    offerId: createOfferId({ source, platform, title, link }),
    source,
    sourceName: scraperMeta.sourceName || rawOffer.sourceName || platform,
    platform,
    title,
    link,
    cashbackText,
    cashbackValue: rawOffer.cashbackValue ?? parseCashbackValue(cashbackText),
    category: normalizeWhitespace(rawOffer.category || ""),
    description,
    image: normalizeUrl(rawOffer.image, scraperMeta.baseUrl),
    tags: Array.isArray(rawOffer.tags)
      ? rawOffer.tags.map((tag) => normalizeWhitespace(tag)).filter(Boolean)
      : [],
    scrapedAt: fetchedAt,
    lastSeenAt: fetchedAt,
    isActive: true,
  };
}
