import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <motion.div
        className="max-w-lg mx-auto glass rounded-2xl shadow-xl p-8 text-center border border-white/10 backdrop-blur-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-lg mb-6">
          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
          My Profile
        </h2>
        <p className="text-gray-300">{user?.email || "Anonymous User"}</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <motion.div
            className="glass p-4 rounded-xl shadow-md shadow-green-500/30 border border-green-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xl font-bold text-green-400">₹12.4k</p>
            <p className="text-sm text-gray-400">Savings</p>
          </motion.div>
          <motion.div
            className="glass p-4 rounded-xl shadow-md shadow-blue-500/30 border border-blue-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xl font-bold text-blue-400">87</p>
            <p className="text-sm text-gray-400">Offers</p>
          </motion.div>
          <motion.div
            className="glass p-4 rounded-xl shadow-md shadow-pink-500/30 border border-pink-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xl font-bold text-pink-400">5</p>
            <p className="text-sm text-gray-400">Cashbacks</p>
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          className="mt-8 w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 transition hover:opacity-90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
