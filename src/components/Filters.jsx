export default function Filters({
  platforms, categories, platform, category, sortBy,
  onPlatform, onCategory, onSort
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 my-3">
      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs text-white/60 px-1">Platform</label>
        <select value={platform} onChange={e => onPlatform(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none">
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs text-white/60 px-1">Category</label>
        <select value={category} onChange={e => onCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs text-white/60 px-1">Sort</label>
        <select value={sortBy} onChange={e => onSort(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none">
          <option value="cashback-desc">Highest cashback</option>
          <option value="cashback-asc">Lowest cashback</option>
          <option value="expiry-asc">Expiring soon</option>
        </select>
      </div>
    </div>
  );
}
