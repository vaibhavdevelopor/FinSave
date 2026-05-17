import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Radar, Clock3 } from "lucide-react";
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const [topOffers, setTopOffers] = useState([]);
  const [stats, setStats] = useState([
    { value: "--", label: "Tracked offers", icon: Radar },
    { value: "--", label: "Last updated", icon: Clock3 },
    { value: "--", label: "Avg cashback", icon: Zap },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "offers"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const sortedOffers = [...list].sort((a, b) => {
          const firstDate = getOfferDate(a)?.getTime() ?? 0;
          const secondDate = getOfferDate(b)?.getTime() ?? 0;
          return secondDate - firstDate;
        });

        setTopOffers(sortedOffers.slice(0, 6));

        const latestDate = sortedOffers
          .map(getOfferDate)
          .filter(Boolean)
          .sort((a, b) => b - a)[0];

        const cashbackValues = sortedOffers
          .map((offer) => Number(offer.cashbackValue))
          .filter((value) => Number.isFinite(value) && value > 0);

        const averageCashback = cashbackValues.length
          ? Math.round(
              cashbackValues.reduce((sum, value) => sum + value, 0) /
                cashbackValues.length
            )
          : null;

        setStats([
          {
            value: String(list.length),
            label: "Tracked offers",
            icon: Radar,
          },
          {
            value: latestDate
              ? latestDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "--",
            label: "Last updated",
            icon: Clock3,
          },
          {
            value: averageCashback ? formatCurrency(averageCashback) : "--",
            label: "Avg cashback",
            icon: Zap,
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 pb-6">
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="theme-panel ambient-glow rounded-[36px] p-8 sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.34em] theme-muted">
            FinSave intelligence layer
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] sm:text-5xl xl:text-6xl">
            Payment offers, shaped into a premium decision feed.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 theme-muted sm:text-lg">
            Scan rewards faster, filter weak signals out, and move toward the
            highest-value cashback path before you pay.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/discover")}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02]"
            >
              Enter Discover
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="theme-input rounded-2xl px-4 py-3 text-sm theme-muted">
              Daily sync pipeline active
            </div>
          </div>
        </div>

        <div className="theme-panel rounded-[36px] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.3em] theme-muted">
            Signal quality
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-orange-400/15 to-fuchsia-500/10 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">High-intent shortlist</p>
                  <p className="text-sm theme-muted">
                    Focus on the freshest reward opportunities first.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.26em] theme-muted">
                Right now
              </p>
              <p className="mt-3 text-3xl font-black">{stats[0].value}</p>
              <p className="mt-2 text-sm theme-muted">
                live offer entries ready to compare across the app.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="theme-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.28em] theme-muted">
                  {stat.label}
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                  <Icon className="h-4 w-4 text-orange-300" />
                </div>
              </div>
              <p className="mt-5 text-3xl font-black sm:text-4xl">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] theme-muted">
              Top lane
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Highest-priority offer picks
            </h2>
          </div>
          <button
            onClick={() => navigate("/discover")}
            className="theme-hover rounded-2xl px-4 py-3 text-sm font-medium"
          >
            See everything
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {topOffers.length > 0 ? (
            topOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                className="theme-panel ambient-glow rounded-[30px] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-orange-300">
                      {offer.sourceName || offer.source || "Live source"}
                    </p>
                    <h3 className="mt-3 text-2xl font-black">{offer.platform}</h3>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold">
                    {offer.cashbackText || "Reward live"}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 theme-muted">{offer.title}</p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[0.22em] theme-muted">
                    {getOfferDate(offer)
                      ? getOfferDate(offer).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "Live now"}
                  </div>
                  <button
                    onClick={() => window.open(offer.link, "_blank")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/15"
                  >
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="theme-muted">Loading offers...</p>
          )}
        </div>
      </section>
    </div>
  );
}
