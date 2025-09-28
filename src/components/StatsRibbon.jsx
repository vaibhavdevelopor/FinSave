import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle2, Stars } from "lucide-react";

const items = [
  { icon: Trophy, k: "₹12,450", l: "Avg. user savings" },
  { icon: Clock, k: "Today", l: "Updated" },
  { icon: CheckCircle2, k: "98%", l: "Verified offers" },
  { icon: Stars, k: "Top 10", l: "Cashback picks" },
];

export default function StatsRibbon() {
  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
      {items.map(({ icon: Icon, k, l }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 * i }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/15 bg-white/5"
        >
          <Icon size={18} />
          <div className="font-extrabold">{k}</div>
          <div className="text-white/60 text-sm">{l}</div>
        </motion.div>
      ))}
    </div>
    </div>
  );
}
