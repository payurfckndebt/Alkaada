import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import './Preflight.css'

export default function Preflight({ meta, onStart, onBack }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const hasParts = Boolean(meta.parts)

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

        {hasParts && (
          <div className="preflight-parts">
            {meta.parts.map((part, i) => (
              <div className="preflight-parts__row" key={part.key}>
                <span className="mono preflight-parts__num">{i + 1}</span>
                <div>
                  <span className="preflight-parts__label">{part.label} &mdash; {part.count} soal</span>
                  <span className="preflight-parts__sub">{part.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <ul className="preflight-rules">
          <li>Soal diacak secara acak dari bank soal setiap kali sesi dimulai.</li>
          <li>Waktu berjalan mundur otomatis dan sesi akan disubmit otomatis saat habis.</li>
          {hasParts ? (
            <>
              <li>Bagian dikerjakan berurutan &mdash; begitu {meta.parts[0].label} selesai dan lanjut ke {meta.parts[1]?.label}, kamu tidak bisa kembali lagi.</li>
              <li>Timer berjalan menyeluruh untuk kedua bagian, tidak direset di antara bagian.</li>
            </>
          ) : (
            <li>Kamu bisa berpindah antar soal bebas dan mengubah jawaban sebelum submit.</li>
          )}
          <li>Skor dan pembahasan lengkap ditampilkan setelah sesi selesai.</li>
        </ul>

        <button className="preflight-start" onClick={() => setConfirmOpen(true)}>Mulai Sesi</button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Dah siap belom?"
        message={`${meta.questionCount} soal, ${meta.durationMinutes} menit. Begitu mulai, timer langsung jalan.`}
        confirmLabel="Gaskeun"
        cancelLabel="Bentar Deh"
        tone="brass"
        onConfirm={onStart}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
