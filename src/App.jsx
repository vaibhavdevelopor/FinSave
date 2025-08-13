import React, { useMemo, useState, useEffect } from 'react'
import offersData from './data/offers.json'
import Filters from './components/Filters.jsx'
import OfferCard from './components/OfferCard.jsx'
import logo from './assets/LOGO__.png';
export default function App() {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('All')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('cashback-desc') // 'cashback-asc' | 'expiry-asc'
  const [offers, setOffers] = useState([])

  // Load (simulate fetching)
  useEffect(() => {
    setOffers(offersData)
  }, [])

  const platforms = useMemo(() => ['All', ...Array.from(new Set(offers.map(o => o.platform)))], [offers])
  const categories = useMemo(() => ['All', ...Array.from(new Set(offers.map(o => o.type)))], [offers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = offers.filter(o => {
      const matchesQuery =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.platform.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q) ||
        (o.conditions && o.conditions.toLowerCase().includes(q))

      const matchesPlatform = platform === 'All' || o.platform === platform
      const matchesCategory = category === 'All' || o.type === category

      return matchesQuery && matchesPlatform && matchesCategory
    })

    // Sorting
    out.sort((a, b) => {
      if (sortBy === 'cashback-desc') return (b.cashback_value_rupees ?? 0) - (a.cashback_value_rupees ?? 0)
      if (sortBy === 'cashback-asc') return (a.cashback_value_rupees ?? 0) - (b.cashback_value_rupees ?? 0)
      if (sortBy === 'expiry-asc') {
        const da = new Date(a.valid_till).getTime()
        const db = new Date(b.valid_till).getTime()
        return da - db
      }
      return 0
    })

    return out
  }, [offers, query, platform, category, sortBy])

  const today = new Date()

  return (
    <div className="page">
      <header className="nav">
        <div className="brand">
           <img src={logo} alt="FinSave Logo" className="navbar-logo" />
           FinSave
        </div>
      </header>

      <section className="hero">
        <h1>Find the <span className="highlight">best cashback</span> for your payment</h1>
        <p>Compare live offers across Paytm, GPay, CRED, PhonePe, Amazon Pay & more — in one place.</p>

        <div className="searchbar">
          <input
            placeholder="Search: 'electricity bill', 'movie', 'Amazon', 'recharge'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Filters
          platforms={platforms}
          categories={categories}
          platform={platform}
          category={category}
          sortBy={sortBy}
          onPlatform={setPlatform}
          onCategory={setCategory}
          onSort={setSortBy}
        />
      </section>

      <main className="grid">
        {filtered.length === 0 && (
          <div className="empty">
            <h3>No matching offers</h3>
            <p>Try a different search or remove some filters.</p>
          </div>
        )}

        {filtered.map((offer) => {
          const expired = new Date(offer.valid_till) < today
          return <OfferCard key={offer.id} offer={offer} expired={expired} />
        })}
      </main>

      <footer className="footer">
        <p>⚠️ This is a demo aggregator for portfolio use. Always verify offer terms on the official platform.</p>
        <p>© {new Date().getFullYear()} FinSave</p>
      </footer>
    </div>
  )
}
