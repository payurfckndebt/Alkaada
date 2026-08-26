import { useEffect, useState } from 'react'
import Timer from '../components/Timer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { CATEGORY_MAP } from '../data/categories.js'
import './Quiz.css'

export default function Quiz({
  session,
  meta,
  endTime,
  onExit,
  onSubmit,
  finishLabel = 'Submit',
  finishDialogTitle = 'Yakin mau submit?',
  finishDialogMessage,
  finishConfirmLabel = 'Ya, Submit',
}) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [navOpen, setNavOpen] = useState(false)
  const [exitDialog, setExitDialog] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)

  const total = session.length
  const current = session[index]
  const answeredCount = Object.keys(answers).length

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  // Guard against accidental hardware/browser back button during the exam.
  useEffect(() => {
    window.history.pushState({ quizGuard: true }, '')
    const onPopState = () => {
      setExitDialog(true)
      window.history.pushState({ quizGuard: true }, '')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleAnswer = (letter) => {
    setAnswers((prev) => ({ ...prev, [current.instanceId]: letter }))
  }

  const goto = (i) => {
    if (i < 0 || i >= total) return
    setIndex(i)
    setNavOpen(false)
  }

  const handleExpire = () => {
    onSubmit(answers)
  }

  const categoryBadge = current.category ? CATEGORY_MAP[current.category] : null

  const defaultMessage = answeredCount < total
    ? `Halo? Yakin udahan? Masih ada ${total - answeredCount} soal yang belum kamu jawab.`
    : 'Halo? Yakin udahan? Semua soal udah kejawab kok.'

  return (
    <div className="quiz">
      <header className="quiz-header">
        <button className="quiz-icon-btn" onClick={() => setExitDialog(true)} aria-label="Kembali ke beranda">
          <HomeIcon />
        </button>
        <div className="quiz-header__mid">
          <span className="eyebrow quiz-header__title">{meta.title}</span>
          <span className="mono quiz-header__progress">{index + 1} / {total}</span>
        </div>
        <Timer endTime={endTime} onExpire={handleExpire} />
      </header>

      <div className="quiz-progressbar">
        <div className="quiz-progressbar__fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <main className="quiz-body">
        <div className="quiz-qcard">
          <div className="quiz-qcard__top">
            <span className="quiz-qnum mono">Soal {index + 1}</span>
            {categoryBadge && <span className="quiz-catbadge mono">{categoryBadge.code}</span>}
          </div>
          <p className="quiz-qtext">{current.question}</p>

          <div className="quiz-options">
            {['A', 'B', 'C', 'D'].map((letter) => {
              const selected = answers[current.instanceId] === letter
              return (
                <button
                  key={letter}
                  className={`quiz-option ${selected ? 'quiz-option--selected' : ''}`}
                  onClick={() => handleAnswer(letter)}
                >
                  <span className="quiz-option__letter mono">{letter}</span>
                  <span className="quiz-option__text">{current.options[letter]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="quiz-footer">
        <button className="quiz-navbtn" onClick={() => goto(index - 1)} disabled={index === 0}>&larr; Sebelumnya</button>
        <button className="quiz-navgrid-toggle mono" onClick={() => setNavOpen(true)}>{answeredCount}/{total} terjawab</button>
        {index === total - 1 ? (
          <button className="quiz-navbtn quiz-navbtn--submit" onClick={() => setSubmitDialog(true)}>{finishLabel}</button>
        ) : (
          <button className="quiz-navbtn quiz-navbtn--primary" onClick={() => goto(index + 1)}>Selanjutnya &rarr;</button>
        )}
      </footer>

      {navOpen && (
        <div className="quiz-navsheet-backdrop" onClick={() => setNavOpen(false)}>
          <div className="quiz-navsheet" onClick={(e) => e.stopPropagation()}>
            <div className="quiz-navsheet__handle" />
            <h3>Navigasi Soal</h3>
            <div className="quiz-navsheet__grid">
              {session.map((q, i) => {
                const isAnswered = answers[q.instanceId] != null
                const isCurrent = i === index
                return (
                  <button
                    key={q.instanceId}
                    className={`quiz-navdot mono ${isAnswered ? 'quiz-navdot--answered' : ''} ${isCurrent ? 'quiz-navdot--current' : ''}`}
                    onClick={() => goto(i)}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <button className="quiz-navsheet__submit" onClick={() => { setNavOpen(false); setSubmitDialog(true) }}>
              {finishLabel === 'Submit' ? 'Akhiri & Submit Sekarang' : finishLabel}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={exitDialog}
        title="Keluar dari sesi?"
        message="Progress pengerjaanmu saat ini tidak akan disimpan dan sesi akan dibatalkan. Yakin ingin kembali ke beranda?"
        confirmLabel="Ya, Keluar"
        cancelLabel="Lanjutkan Mengerjakan"
        tone="danger"
        onConfirm={onExit}
        onCancel={() => setExitDialog(false)}
      />

      <ConfirmDialog
        open={submitDialog}
        title={finishDialogTitle}
        message={finishDialogMessage || defaultMessage}
        confirmLabel={finishConfirmLabel}        cancelLabel="Cek Lagi"
        tone="brass"
        onConfirm={() => onSubmit(answers)}
        onCancel={() => setSubmitDialog(false)}
      />
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
