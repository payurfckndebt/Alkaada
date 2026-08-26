import './Preflight.css'

export default function Preflight({ meta, onStart, onBack }) {
  return (
    <div className="preflight">
      <button className="preflight-back" onClick={onBack} aria-label="Kembali ke beranda">&larr; Beranda</button>
      <div className="preflight-card perforated">
        <div className="preflight-card__code mono">{meta.code}&ndash;{String(Date.now()).slice(-4)}</div>
        <h1>{meta.title}</h1>
        <p className="preflight-card__sub">{meta.subtitle}</p>

        <div className="punch-row" style={{ '--perf-top': '0' }}>
          {Array.from({ length: 16 }).map((_, i) => <span className="punch" key={i} />)}
        </div>

        <div className="preflight-stats">
          <div>
            <span className="mono preflight-stats__num">{meta.questionCount}</span>
            <span>Soal</span>
          </div>
          <div>
            <span className="mono preflight-stats__num">{meta.durationMinutes}</span>
            <span>Menit</span>
          </div>
          <div>
            <span className="mono preflight-stats__num">4</span>
            <span>Opsi Jawaban</span>
          </div>
        </div>

        <ul className="preflight-rules">
          <li>Soal diacak secara acak dari bank soal setiap kali sesi dimulai.</li>
          <li>Waktu berjalan mundur otomatis dan sesi akan disubmit otomatis saat habis.</li>
          <li>Kamu bisa berpindah antar soal bebas dan mengubah jawaban sebelum submit.</li>
          <li>Skor dan pembahasan lengkap ditampilkan setelah sesi selesai.</li>
          {meta.perCategory && (
            <li>Soal gabungan dari 4 materi, masing-masing menyumbang {meta.perCategory} soal.</li>
          )}
        </ul>

        <button className="preflight-start" onClick={onStart}>Mulai Sesi</button>
      </div>
    </div>
  )
}
