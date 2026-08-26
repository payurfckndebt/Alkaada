import { CATEGORY_MAP } from '../data/categories.js'
import './Result.css'

function scoreLabel(pct) {
  if (pct >= 85) return 'Sangat Baik'
  if (pct >= 70) return 'Baik'
  if (pct >= 50) return 'Cukup'
  return 'Perlu Belajar Lagi'
}

export default function Result({ result, meta, isMixed, onReview, onHome }) {
  const { correct, total, scorePercent, detail } = result
  const wrong = total - correct
  const circumference = 2 * Math.PI * 54

  const perCategory = isMixed
    ? Object.keys(CATEGORY_MAP).map((key) => {
        const items = detail.filter((d) => d.category === key)
        const c = items.filter((d) => d.isCorrect).length
        return { key, label: CATEGORY_MAP[key].code, correct: c, total: items.length }
      })
    : null

  return (
    <div className="result">
      <button className="result-home" onClick={onHome}>&larr; Beranda</button>

      <div className="result-card perforated">
        <span className="eyebrow result-card__label">{meta.title} &mdash; Selesai</span>

        <div className="result-ring">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="var(--paper-dim)" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="54" fill="none"
              stroke="var(--brass)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (scorePercent / 100) * circumference}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="result-ring__num">
            <span className="mono">{scorePercent}</span>
            <span className="result-ring__unit">/ 100</span>
          </div>
        </div>

        <h2 className="result-status">{scoreLabel(scorePercent)}</h2>

        <div className="result-stats">
          <div>
            <span className="mono result-stats__num" style={{ color: 'var(--green)' }}>{correct}</span>
            <span>Benar</span>
          </div>
          <div>
            <span className="mono result-stats__num" style={{ color: 'var(--red)' }}>{wrong}</span>
            <span>Salah</span>
          </div>
          <div>
            <span className="mono result-stats__num">{total}</span>
            <span>Total Soal</span>
          </div>
        </div>

        {perCategory && (
          <div className="result-breakdown">
            <span className="eyebrow">Rincian per Materi</span>
            {perCategory.map((p) => (
              <div className="result-breakdown__row" key={p.key}>
                <span className="mono">{p.label}</span>
                <div className="result-breakdown__bar">
                  <div
                    className="result-breakdown__fill"
                    style={{ width: p.total ? `${(p.correct / p.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="mono result-breakdown__frac">{p.correct}/{p.total}</span>
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button className="result-btn result-btn--primary" onClick={onReview}>Lihat Pembahasan</button>
          <button className="result-btn result-btn--ghost" onClick={onHome}>Kembali ke Beranda</button>
        </div>
      </div>
    </div>
  )
}
