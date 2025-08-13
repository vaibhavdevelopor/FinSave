import React from 'react'

export default function Filters({
  platforms, categories, platform, category, sortBy,
  onPlatform, onCategory, onSort
}) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>Platform</label>
        <select value={platform} onChange={e => onPlatform(e.target.value)}>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select value={category} onChange={e => onCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort</label>
        <select value={sortBy} onChange={e => onSort(e.target.value)}>
          <option value="cashback-desc">Highest cashback</option>
          <option value="cashback-asc">Lowest cashback</option>
          <option value="expiry-asc">Expiring soon</option>
        </select>
      </div>
    </div>
  )
}
