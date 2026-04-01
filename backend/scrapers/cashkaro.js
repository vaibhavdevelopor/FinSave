import axios from "axios";
import * as cheerio from "cheerio";
import { normalizeOffer } from "../lib/offerUtils.js";

const source = "cashkaro";
const sourceName = "CashKaro";
const startUrl = "https://cashkaro.com/stores";
const maxStores = Number(process.env.CASHKARO_MAX_STORES || 20);

function createHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  };
}

function normalizeStoreUrl(href) {
  if (!href) {
    return null;
  }

  try {
    const url = new URL(href, startUrl);
    if (!url.pathname.startsWith("/stores/")) {
      return null;
    }

    if (url.pathname === "/stores/" || url.pathname === "/stores") {
      return null;
    }

    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function extractStoreUrls($) {
  const links = $("a[href]")
    .map((_, element) => normalizeStoreUrl($(element).attr("href")))
    .get()
    .filter(Boolean);

  return Array.from(new Set(links)).slice(0, maxStores);
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function extractPlatform($) {
  const heading = cleanText($("h1").first().text());
  if (!heading) {
    return "";
  }

  return heading
    .replace(/\bPromo Codes?\b/gi, "")
    .replace(/\bCoupon Codes?\b/gi, "")
    .replace(/\bOffers?\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractCashbackText(pageText) {
  const patterns = [
    /(Get\s+Upto\s+[^\n.]*?(?:Rewards|Cashback|Off))/i,
    /(Upto\s+[^\n.]*?(?:Rewards|Cashback|Off))/i,
    /(\d+(?:\.\d+)?%\s+Rewards(?:\s+on\s+[^\n.]*)?)/i,
    /(\d+(?:\.\d+)?%\s+Cashback(?:\s+on\s+[^\n.]*)?)/i,
  ];

  for (const pattern of patterns) {
    const match = pageText.match(pattern);
    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  return "";
}

function extractHeroTitle(pageText, platform, description) {
  const patterns = [
    new RegExp(`${platform}\\s+Cashback\\s*&\\s*Reward\\s*Offers\\s*([^\\n]+)`, "i"),
    new RegExp(`${platform}\\s+Promo\\s+Codes\\s+Offer\\s+Details\\s+([^\\n]+)`, "i"),
  ];

  for (const pattern of patterns) {
    const match = pageText.match(pattern);
    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  if (description) {
    return description;
  }

  return platform ? `${platform} cashback offers via CashKaro` : "";
}

async function scrapeStorePage(url) {
  const response = await axios.get(url, {
    headers: createHeaders(),
    timeout: 30000,
  });

  const $ = cheerio.load(response.data);
  const pageText = cleanText($("body").text());
  const platform = extractPlatform($);
  const cashbackText = extractCashbackText(pageText);
  const description = cleanText($("meta[name='description']").attr("content"));
  const title = extractHeroTitle(pageText, platform, description);
  const image = $("img").first().attr("src");

  return normalizeOffer(
    {
      platform,
      title,
      cashbackText,
      link: url,
      image,
      category: "Cashback",
      description,
    },
    { source, sourceName, baseUrl: url }
  );
}

export async function scrapeCashkaro() {
  const response = await axios.get(startUrl, {
    headers: createHeaders(),
    timeout: 30000,
  });

  const $ = cheerio.load(response.data);
  const storeUrls = extractStoreUrls($);

  if (!storeUrls.length) {
    throw new Error(
      "CashKaro page loaded, but no store links were discovered."
    );
  }

  const offers = [];

  for (const storeUrl of storeUrls) {
    try {
      const offer = await scrapeStorePage(storeUrl);
      if (offer) {
        offers.push(offer);
      }
    } catch (error) {
      console.warn(`Skipping CashKaro store ${storeUrl}: ${error.message}`);
    }
  }

  const uniqueOffers = Array.from(
    new Map(offers.map((offer) => [offer.offerId, offer])).values()
  );

  return {
    source,
    sourceName,
    fetchedUrl: startUrl,
    offers: uniqueOffers,
  };
}
