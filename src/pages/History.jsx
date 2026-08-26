import { PASSING_GRADE } from '../data/categories.js'
import './History.css'

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function History({ items, onHome, onClear }) {
  return (
    <div className="history">
      <header className="history-header">
        <button className="quiz-icon-btn" onClick={onHome} aria-label="Kembali ke beranda">
          <BackIcon />
        </button>
        <div>
          <span className="eyebrow history-header__title">Riwayat Sesi Ini</span>
          <span className="mono history-header__note">{items.length} sesi tercatat &middot; hilang saat tab ditutup</span>
        </div>
      </header>

      <main className="history-list">
        {items.length === 0 && (
          <p className="history-empty">Belum ada sesi yang diselesaikan. Riwayat akan muncul di sini selama tab ini masih terbuka.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className={`history-item ${item.passed ? 'history-item--pass' : 'history-item--fail'}`}>
            <div className="history-item__top">
              <span className="mono history-item__code">{item.code}</span>
              <span className="history-item__title">{item.title}</span>
            </div>
            <div className="history-item__bottom">
              <span className={`history-item__badge mono ${item.passed ? 'badge--pass' : 'badge--fail'}`}>
                {item.passed ? 'Lulus' : 'Belum Lulus'}
              </span>
              <span className="mono history-item__score">{item.correct}/{item.total} &middot; {item.scorePercent}</span>
              <span className="mono history-item__time">{formatTime(item.timestamp)}</span>
            </div>
          </div>
        ))}
      </main>

      {items.length > 0 && (
        <div className="history-footer">
          <span className="mono">Passing grade: {PASSING_GRADE}</span>
          <button className="history-clear" onClick={onClear}>Hapus Riwayat</button>
        </div>
      )}
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
