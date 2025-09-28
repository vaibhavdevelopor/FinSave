import { motion } from "framer-motion";

export default function Spotlight() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 border border-white/15 bg-gradient-to-br from-white/10 to-transparent shadow-xl"
    >
      <h1 className="text-3xl font-extrabold leading-tight">
        Find the <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">best cashback</span> for your next payment
      </h1>
      <p className="text-white/70 mt-2">
        Compare live offers across Paytm, GPay, CRED, PhonePe, Amazon Pay &amp; more — in one place.
      </p>
      <a href="#offers" className="inline-block mt-4 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:opacity-90">Start Saving</a>
    </motion.section>
  );
}
