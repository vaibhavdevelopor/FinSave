import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, ArrowUpRight, Filter } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function getOfferDate(offer) {
  const rawDate =
    offer.updatedAt?.toDate?.() ||
    offer.lastSeenAt ||
    offer.scrapedAt ||
    offer.createdAt?.toDate?.() ||
    offer.updatedAt ||
    offer.createdAt ||
    offer.scrapedAt ||
    offer.lastSeenAt;

  if (!rawDate) {
    return null;
  }

  const parsedDate = rawDate instanceof Date ? rawDate : new Date(rawDate);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export default function Discover() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "offers"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOffers(list);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredOffers = offers
    .filter((offer) => {
      const term = searchTerm.toLowerCase();
      return (
        offer.platform?.toLowerCase().includes(term) ||
        offer.title?.toLowerCase().includes(term) ||
        offer.sourceName?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const firstDate = getOfferDate(a)?.getTime() ?? 0;
      const secondDate = getOfferDate(b)?.getTime() ?? 0;
      return secondDate - firstDate;
    });

  return (
    <div className="space-y-8 pb-6">
      <section className="theme-panel rounded-[34px] p-8 sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] theme-muted">
              Discover mode
            </p>
            <h1 className="mt-3 text-4xl font-black leading-none sm:text-5xl">
              Browse live offers with less noise.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 theme-muted">
              Every card below is designed to surface the reward first, the
              source second, and the next action immediately.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="theme-input inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm">
              <Filter className="h-4 w-4 text-orange-300" />
              {filteredOffers.length} visible offers
            </div>
            <div className="theme-input inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm">
              <SearchIcon className="h-4 w-4 text-orange-300" />
              Search synced from top bar
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="theme-muted">Loading offers...</p>
      ) : filteredOffers.length === 0 ? (
        <div className="theme-panel rounded-[30px] p-10 text-center">
          <h2 className="text-2xl font-black">No offers found</h2>
          <p className="mt-3 theme-muted">
            Try a broader search term or clear the current query.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((offer, i) => (
            <motion.div
              key={offer.id || i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              whileHover={{ y: -4 }}
              className="theme-panel ambient-glow rounded-[30px] p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-orange-300">
                    {offer.sourceName || offer.source || "Live source"}
                  </p>
                  <h3 className="mt-3 text-2xl font-black">{offer.platform}</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-[0.22em] theme-muted">
                    Reward
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {offer.cashbackText || "Live offer"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 theme-muted">{offer.title}</p>

              <div className="mt-6 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] theme-muted">
                <span>
                  {getOfferDate(offer)
                    ? getOfferDate(offer).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    : "Live now"}
                </span>
                <span>{offer.category || "Cashback"}</span>
              </div>

              <button
                onClick={() => window.open(offer.link, "_blank")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.01]"
              >
                Open offer
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
