import { CATEGORIES, TRYOUT_REAL } from '../data/categories.js'
import './Home.css'

export default function Home({ onSelect, onHistory, onBankSoal, historyCount }) {
  return (
    <div className="home">
      <div className="home-topbar">
        <button className="home-topbar__btn" onClick={onHistory}>
          <HistoryIcon />
          Riwayat{historyCount > 0 ? ` (${historyCount})` : ''}
        </button>
      </div>

      <header className="home-header">
        <span className="eyebrow home-header__eyebrow">Try Out</span>
        <h1 className="home-header__title">AALKADA</h1>
        <p className="home-header__sub">
          Akuntansi &middot; Analisis Laporan Keuangan &middot; Audit Risk Based &middot; Data Analytics
        </p>
      </header>

      <section className="tor-section">
        <button className="tor-card perforated" onClick={() => onSelect(TRYOUT_REAL.key)}>
          <div className="tor-card__stub">
            <span className="eyebrow">Simulasi Ujian</span>
            <span className="mono tor-card__code">{TRYOUT_REAL.code}&ndash;01</span>
          </div>
          <div className="punch-row" style={{ '--perf-top': '0' }}>
            {Array.from({ length: 14 }).map((_, i) => <span className="punch" key={i} />)}
          </div>
          <div className="tor-card__body">
            <h2>{TRYOUT_REAL.title}</h2>
            <p>{TRYOUT_REAL.subtitle}</p>
            <div className="tor-card__meta mono">
              <span>{TRYOUT_REAL.questionCount} soal</span>
              <span aria-hidden="true">&bull;</span>
              <span>{TRYOUT_REAL.durationMinutes} menit</span>
              <span aria-hidden="true">&bull;</span>
              <span>4 materi &times; 15 soal</span>
            </div>
          </div>
          <div className="tor-card__arrow" aria-hidden="true">&rarr;</div>
        </button>
      </section>

      <section className="latihan-section">
        <div className="latihan-heading">
          <span className="eyebrow">Menu Latihan</span>
          <h2>Pilih Materi</h2>
        </div>
        <div className="ticket-grid">
          {CATEGORIES.map((cat) => (
            <button key={cat.key} className="ticket perforated" onClick={() => onSelect(cat.key)}>
              <div className="ticket__top">
                <span className="ticket__code mono">{cat.code}</span>
                <span className="ticket__stamp">TRY&nbsp;OUT</span>
              </div>
              <h3 className="ticket__title">{cat.title}</h3>
              <p className="ticket__sub">{cat.subtitle}</p>
              <div className="punch-row" style={{ '--perf-bottom': '0' }}>
                {Array.from({ length: 10 }).map((_, i) => <span className="punch" key={i} />)}
              </div>
              <div className="ticket__meta mono">
                <span>{cat.questionCount} soal</span>
                <span>{cat.durationMinutes} menit</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="banklock-section">
        <button className="banklock-card" onClick={onBankSoal}>
          <div className="banklock-card__icon">
            <LockIcon />
          </div>
          <div className="banklock-card__text">
            <span className="eyebrow">Terkunci</span>
            <h3>Bank Soal</h3>
            <p>Semua soal &amp; kunci jawaban &mdash; butuh password. Belum punya? Hubungi admin.</p>
          </div>
          <span className="banklock-card__arrow" aria-hidden="true">&rarr;</span>
        </button>
      </section>

      <footer className="home-footer">
        <p>Bank soal disusun dari materi persiapan AP OJK &mdash; acak setiap sesi, lengkap dengan pembahasan.</p>
      </footer>
    </div>
  )
}

function HistoryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 4v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
