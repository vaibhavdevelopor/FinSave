import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ShieldCheck, Sparkles, Radar, LogOut, BadgeIndianRupee } from "lucide-react";
import { db } from "../firebase";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getInitial(email) {
  return email ? email.charAt(0).toUpperCase() : "U";
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileStats, setProfileStats] = useState({
    offersCount: 0,
    averageCashback: null,
    sourceCount: 0,
  });

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, "offers"));
        const offers = snapshot.docs.map((doc) => doc.data());
        const cashbackValues = offers
          .map((offer) => Number(offer.cashbackValue))
          .filter((value) => Number.isFinite(value) && value > 0);

        const sourceCount = new Set(
          offers
            .map((offer) => offer.sourceName || offer.source || offer.platform)
            .filter(Boolean)
        ).size;

        setProfileStats({
          offersCount: snapshot.size,
          averageCashback: cashbackValues.length
            ? Math.round(
                cashbackValues.reduce((sum, value) => sum + value, 0) /
                  cashbackValues.length
              )
            : null,
          sourceCount,
        });
      } catch (err) {
        console.error("Error fetching profile stats:", err);
      }
    };

    fetchProfileStats();
  }, []);

  const statCards = [
    {
      value: profileStats.averageCashback
        ? formatCurrency(profileStats.averageCashback)
        : "--",
      label: "Average cashback",
      accent: "text-emerald-300",
      icon: BadgeIndianRupee,
    },
    {
      value: profileStats.offersCount,
      label: "Tracked offers",
      accent: "text-sky-300",
      icon: Radar,
    },
    {
      value: profileStats.sourceCount,
      label: "Live sources",
      accent: "text-orange-300",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 pb-6">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="theme-panel ambient-glow rounded-[36px] p-8 sm:p-10"
        >
          <p className="text-[11px] uppercase tracking-[0.34em] theme-muted">
            Account overview
          </p>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500 text-4xl font-black text-white shadow-2xl shadow-orange-500/20">
              {getInitial(user?.email)}
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-orange-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified session
              </div>
              <h1 className="mt-4 text-4xl font-black leading-none sm:text-5xl">
                {user?.displayName || "Profile overview"}
              </h1>
              <p className="mt-4 max-w-2xl break-all text-base leading-7 theme-muted">
                Review your account details, offer coverage, and reward activity
                across FinSave in one place.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="theme-panel rounded-[36px] p-6 sm:p-8"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] theme-muted">
            Account status
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-orange-400/15 via-pink-500/10 to-indigo-500/10 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] theme-muted">
                Session state
              </p>
              <p className="mt-3 text-3xl font-black">
                {profileStats.offersCount > 0 ? "Active" : "Waiting"}
              </p>
              <p className="mt-2 text-sm leading-6 theme-muted">
                Your account is active and ready to review the latest cashback
                opportunities available on the platform.
              </p>
            </div>

            <button
              onClick={logout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 px-5 py-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.01]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="theme-panel rounded-[30px] p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.28em] theme-muted">
                  {stat.label}
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                  <Icon className={`h-4 w-4 ${stat.accent}`} />
                </div>
              </div>
              <p className={`mt-5 text-3xl font-black sm:text-4xl ${stat.accent}`}>
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="theme-panel rounded-[32px] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] theme-muted">
            Account summary
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            A complete view of your rewards profile.
          </h2>
          <p className="mt-4 text-sm leading-7 theme-muted">
            This section summarizes your session status, source coverage, and
            current cashback metrics.
          </p>
        </div>

        <div className="theme-panel rounded-[32px] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] theme-muted">
            Current identity
          </p>
          <div className="mt-5 space-y-3">
            <div className="theme-input rounded-2xl px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.24em] theme-muted">
                Signed in as
              </p>
              <p className="mt-2 break-all text-sm font-semibold">
                {user?.email || "Anonymous User"}
              </p>
            </div>
            <div className="theme-input rounded-2xl px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.24em] theme-muted">
                Source coverage
              </p>
              <p className="mt-2 text-sm font-semibold">
                {profileStats.sourceCount} synced sources currently represented
                in your dataset
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
