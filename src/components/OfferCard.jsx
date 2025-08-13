import React from 'react'

export default function OfferCard({ offer, expired }) {
  const {
    platform, type, title, cashback_text, cashback_value_rupees,
    conditions, valid_till, trust_score, source_url
  } = offer

  return (
    <article className={`card ${expired ? 'card--expired' : ''}`}>
      <div className="card-head">
        <div className="pill">{platform}</div>
        <div className={`pill ${expired ? 'pill-red' : 'pill-green'}`}>
          {expired ? 'Expired' : 'Active'}
        </div>
      </div>

      <h3 className="card-title">{title}</h3>

      <div className="card-row">
        <span className="badge">{type}</span>
        <span className="cashback">🎁 {cashback_text}</span>
      </div>

      <p className="muted">{conditions}</p>

      <div className="meta">
        <div className="meta-item">
          <span className="meta-label">Est. Value</span>
          <span className="meta-value">₹{Number(cashback_value_rupees || 0).toFixed(0)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Valid till</span>
          <span className="meta-value">{new Date(valid_till).toLocaleDateString()}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Trust</span>
          <span className="meta-value">{Math.round((trust_score || 0) * 100)}%</span>
        </div>
      </div>

      <a className="btn" href={source_url} target="_blank" rel="noreferrer">
        View on {platform}
      </a>
    </article>
  )
}
