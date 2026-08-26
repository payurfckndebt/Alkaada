import { useMemo, useState } from 'react'
import bank from '../data/questionBank.json'
import { CATEGORIES } from '../data/categories.js'
import './BankSoal.css'

export default function BankSoal({ onHome }) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].key)
  const items = useMemo(() => bank[activeCat] || [], [activeCat])

  return (
    <div className="banksoal">
      <header className="banksoal-header">
        <button className="quiz-icon-btn" onClick={onHome} aria-label="Kembali ke beranda">
          <BackIcon />
        </button>
        <div>
          <span className="eyebrow banksoal-header__title">Bank Soal</span>
          <span className="mono banksoal-header__note">{items.length} soal &middot; lengkap dengan kunci jawaban</span>
        </div>
      </header>

      <div className="banksoal-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`banksoal-tab ${activeCat === c.key ? 'banksoal-tab--active' : ''}`}
            onClick={() => setActiveCat(c.key)}
          >
            {c.code}
          </button>
        ))}
      </div>

      <main className="banksoal-list">
        {items.map((q, i) => (
          <article key={q.id} className="banksoal-item">
            <div className="banksoal-item__top">
              <span className="mono banksoal-item__num">{i + 1}. {q.id}</span>
            </div>
            <p className="banksoal-item__q">{q.question}</p>
            <div className="banksoal-item__options">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <div key={letter} className={`banksoal-opt ${letter === q.answer ? 'banksoal-opt--correct' : ''}`}>
                  <span className="mono banksoal-opt__letter">{letter}</span>
                  <span>{q.options[letter]}</span>
                  {letter === q.answer && <span className="banksoal-opt__flag mono">Kunci</span>}
                </div>
              ))}
            </div>
            <div className="banksoal-item__explanation">
              <span className="eyebrow">Pembahasan</span>
              <p>{q.explanation}</p>
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
