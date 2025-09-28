/* eslint-disable react/prop-types */
const palette = {
  green:  "bg-green-500/10 border-green-500 shadow-green-500/20",
  orange: "bg-orange-500/10 border-orange-500 shadow-orange-500/20",
  blue:   "bg-blue-500/10 border-blue-500 shadow-blue-500/20",
};

export default function OfferCard({ platform, title, cashback, color = "green" }) {
  const clr = palette[color] ?? palette.green;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    <div className={`rounded-2xl border p-6 shadow-lg ${clr}`}>
      <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-white/10 border border-white/20">
        {platform}
      </span>

      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mt-1 text-gray-300 text-sm">{cashback}</p>

      <button className="mt-4 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
        View Offer
      </button>
    </div>
    </div>
  );
}
