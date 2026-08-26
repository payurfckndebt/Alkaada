import { CATEGORIES, TRYOUT_REAL } from '../data/categories.js'
import './Home.css'

export default function Home({ onSelect }) {
  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header__mark">MLE</div>
        <h1 className="home-header__title">
          TryOut <span>AALKADA</span>
        </h1>
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

      <footer className="home-footer">
        <p>Bank soal disusun dari materi persiapan AP OJK &mdash; acak setiap sesi, lengkap dengan pembahasan.</p>
      </footer>
    </div>
  )
}
