import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSearch } from "../context/SearchContext"; // ✅ import context

export default function Discover() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch(); // ✅ get global search term

  // Fetch offers from backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/offers");
        if (res.data.success) {
          setOffers(res.data.offers);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // ✅ Filter offers based on global search term
  const filteredOffers = offers.filter((offer) => {
    const term = searchTerm.toLowerCase();
    return (
      offer.platform?.toLowerCase().includes(term) ||
      offer.title?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-3xl font-extrabold">
        Discover Cashback{" "}
        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Offers
        </span>
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading offers...</p>
      ) : filteredOffers.length === 0 ? (
        <p className="text-gray-400">No offers found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl p-6 backdrop-blur-lg border shadow-lg transition 
                         bg-white/10 border-pink-500 text-pink-400 shadow-pink-500/30"
            >
              <h3 className="text-lg font-bold text-white">{offer.platform}</h3>
              <p className="text-gray-300">{offer.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {offer.createdAt?._seconds
                  ? new Date(offer.createdAt._seconds * 1000).toLocaleString()
                  : ""}
              </p>
              <button
                onClick={() => window.open(offer.link, "_blank")}
                className="mt-4 px-4 py-2 rounded-lg text-white font-bold 
                           bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition"
              >
                View Offer
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
