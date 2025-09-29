import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase"; // ✅ Firestore instance

export default function Dashboard() {
  const [topOffers, setTopOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopOffers = async () => {
      try {
        // ✅ Query Firestore for latest offers
        const q = query(
          collection(db, "offers"),
          orderBy("createdAt", "desc"), // needs createdAt as Firestore Timestamp
          limit(6) // show top 6
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopOffers(list);
      } catch (err) {
        console.error("Error fetching top offers:", err);
      }
    };

    fetchTopOffers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white leading-tight">
          Find the{" "}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            best cashback
          </span>{" "}
          for your next payment
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Compare live offers across Paytm, GPay, CRED, PhonePe, Amazon Pay & more — all in one place.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/discover")}
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
          text-white font-semibold shadow-lg shadow-pink-500/30 transition"
        >
          Start Saving
        </motion.button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { value: "₹12,450", label: "Avg. user savings", glow: "shadow-purple-500/30" },
          { value: "Sep 28", label: "Updated", glow: "shadow-blue-500/30" },
          { value: "98%", label: "Verified offers", glow: "shadow-green-500/30" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-gray-800/60 border border-white/10 rounded-2xl p-6 text-center 
              backdrop-blur-lg shadow-lg ${stat.glow}`}
          >
            <h2 className="text-2xl font-bold">{stat.value}</h2>
            <p className="text-gray-400">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Top Offers */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Top Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topOffers.length > 0 ? (
            topOffers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 
                  shadow-lg backdrop-blur-lg"
              >
                <h3 className="text-lg font-bold text-white">{offer.platform}</h3>
                <p className="text-gray-300">{offer.title}</p>
                <button
                  onClick={() => window.open(offer.link, "_blank")}
                  className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold 
                    hover:opacity-90 transition"
                >
                  View on {offer.platform}
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">Loading offers...</p>
          )}
        </div>
      </section>
    </div>
  );
}
