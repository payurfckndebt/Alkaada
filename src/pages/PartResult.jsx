import { useEffect, useState } from 'react'
import Timer from '../components/Timer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { PASSING_GRADE } from '../data/categories.js'
import { scoreLabel } from '../utils/messages.js'
import './Result.css'
import './PartResult.css'

export default function PartResult({ part, scored, passed, endTime, onContinue, onExit, onTimeUp, onRepeat, nextPart }) {
  const [exitDialog, setExitDialog] = useState(false)
  const [repeatDialog, setRepeatDialog] = useState(false)
  const { correct, total, scorePercent, detail } = scored
  const unanswered = detail.filter((d) => !d.isAnswered).length
  const wrong = total - correct - unanswered
  const circumference = 2 * Math.PI * 54

  // The exam clock keeps running through this interlude — the same guards used in
  // Quiz.jsx apply here too, since the exam isn't actually finished yet.
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  useEffect(() => {
    window.history.pushState({ quizGuard: true }, '')
    const onPopState = () => {
      setExitDialog(true)
      window.history.pushState({ quizGuard: true }, '')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <div className="result">
      <div className="partresult-timerbar">
        <span className="mono partresult-timerbar__note">Waktu ujian tetap berjalan</span>
        <Timer endTime={endTime} onExpire={onTimeUp} />
      </div>

      <div className="result-card perforated">
        <span className="eyebrow result-card__label">{part.label} &mdash; Selesai</span>

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

        <h2 className={`result-status ${passed ? 'result-status--pass' : 'result-status--fail'}`}>
          {scoreLabel(passed)}
        </h2>
        <p className="result-passgrade mono">
          KKM {part.label}: {PASSING_GRADE} &middot; {passed ? 'Lulus' : 'Belum Lulus'}
        </p>

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
            <span className="mono result-stats__num" style={{ color: 'var(--text-mute)' }}>{unanswered}</span>
            <span>Belum Dijawab</span>
          </div>
          <div>
            <span className="mono result-stats__num">{total}</span>
            <span>Total Soal</span>
          </div>
        </div>

        <p className="partresult-note">
          Nilai {part.label} sudah final dan tidak bisa diubah lagi. Nilai akhir gabungan baru muncul setelah {nextPart.label} selesai.
        </p>

        <div className="result-actions">
          <button className="result-btn result-btn--primary" onClick={onContinue}>Lanjut ke {nextPart.label} &rarr;</button>
          <button className="result-btn result-btn--ghost" onClick={() => setRepeatDialog(true)}>Ulangi dari Awal</button>
        </div>
      </div>

      <ConfirmDialog
        open={exitDialog}
        title="Keluar dari sesi?"
        message="Ujian belum selesai. Kalau keluar sekarang, seluruh progress (termasuk nilai yang sudah kamu dapat) akan dibatalkan. Yakin ingin kembali ke beranda?"
        confirmLabel="Ya, Keluar"
        cancelLabel="Lanjutkan Ujian"
        tone="danger"
        onConfirm={onExit}
        onCancel={() => setExitDialog(false)}
      />

      <ConfirmDialog
        open={repeatDialog}
        title="Ulangi dari awal?"
        message={`Nilai ${part.label} yang barusan kamu dapat akan hilang, dan soal akan diacak ulang dari Bagian 1. Yakin mau mengulang?`}
        confirmLabel="Ya, Ulangi"
        cancelLabel="Batal"
        tone="danger"
        onConfirm={onRepeat}
        onCancel={() => setRepeatDialog(false)}
      />
    </div>
  )
}
