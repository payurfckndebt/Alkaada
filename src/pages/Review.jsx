import { useMemo, useState } from 'react'
import { CATEGORY_MAP } from '../data/categories.js'
import './Review.css'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'correct', label: 'Benar' },
  { key: 'wrong', label: 'Salah' },
  { key: 'empty', label: 'Kosong' },
]

export default function Review({ result, meta, onHome, onRepeat, onBackToResult }) {
  const [filter, setFilter] = useState('all')

  const items = useMemo(() => {
    return result.detail.filter((d) => {
      if (filter === 'correct') return d.isCorrect
      if (filter === 'wrong') return d.isAnswered && !d.isCorrect
      if (filter === 'empty') return !d.isAnswered
      return true
    })
  }, [result.detail, filter])

  return (
    <div className="review">
      <header className="review-header">
        <button className="quiz-icon-btn" onClick={onBackToResult} aria-label="Kembali ke hasil skor">
          <BackIcon />
        </button>
        <div>
          <span className="eyebrow review-header__title">{meta.title}</span>
          <span className="mono review-header__score">{result.correct}/{result.total} benar &middot; {result.scorePercent}</span>
        </div>
      </header>

      <div className="review-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`review-filter ${filter === f.key ? 'review-filter--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <main className="review-list">
        {items.length === 0 && <p className="review-empty">Tidak ada soal pada filter ini.</p>}
        {items.map((q, i) => (
          <article key={q.instanceId} className={`review-item ${q.isAnswered ? (q.isCorrect ? 'review-item--correct' : 'review-item--wrong') : 'review-item--empty'}`}>
            <div className="review-item__top">
              <span className="mono review-item__num">Soal {result.detail.indexOf(q) + 1}</span>
              <span className={`review-item__tag mono ${q.isAnswered ? (q.isCorrect ? 'tag--correct' : 'tag--wrong') : 'tag--empty'}`}>
                {q.isAnswered ? (q.isCorrect ? 'Benar' : 'Salah') : 'Tidak Dijawab'}
              </span>
              {q.category && <span className="review-item__cat mono">{CATEGORY_MAP[q.category].code}</span>}
            </div>
            <p className="review-item__q">{q.question}</p>
            <div className="review-item__options">
              {['A', 'B', 'C', 'D'].map((letter) => {
                const isCorrectOpt = letter === q.answer
                const isGivenOpt = letter === q.given
                let cls = 'review-opt'
                if (isCorrectOpt) cls += ' review-opt--correct'
                if (isGivenOpt && !isCorrectOpt) cls += ' review-opt--wrong'
                return (
                  <div key={letter} className={cls}>
                    <span className="mono review-opt__letter">{letter}</span>
                    <span>{q.options[letter]}</span>
                    {isGivenOpt && <span className="review-opt__flag mono">Jawabanmu</span>}
                    {isCorrectOpt && !isGivenOpt && <span className="review-opt__flag mono">Kunci</span>}
                  </div>
                )
              })}
            </div>
            <div className="review-item__explanation">
              <span className="eyebrow">Pembahasan</span>
              <p>{q.explanation}</p>
            </div>
          </article>
        ))}
      </main>

      <div className="review-endactions">
        <button className="review-endbtn review-endbtn--ghost" onClick={onHome}>Home?</button>
        <button className="review-endbtn review-endbtn--primary" onClick={onRepeat}>Ulangi?</button>
      </div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
