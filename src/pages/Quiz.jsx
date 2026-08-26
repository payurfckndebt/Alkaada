import { useEffect, useMemo, useState } from 'react'
import Timer from '../components/Timer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { CATEGORY_MAP } from '../data/categories.js'
import { getPartInfo } from '../utils/quizEngine.js'
import './Quiz.css'

export default function Quiz({ session, meta, endTime, onExit, onSubmit }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [navOpen, setNavOpen] = useState(false)
  const [exitDialog, setExitDialog] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)
  const [nextPartDialog, setNextPartDialog] = useState(false)
  // Once true, question indices belonging to earlier parts become locked (view-only nav blocked),
  // matching the official rule: "Bagian 2 dikerjakan setelah Bagian 1 selesai" (no going back).
  const [unlockedPartIndex, setUnlockedPartIndex] = useState(0)

  const total = session.length
  const current = session[index]
  const answeredCount = Object.keys(answers).length
  const hasParts = Boolean(meta.parts)
  const partInfo = hasParts ? getPartInfo(meta, index) : null

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
    if (hasParts) {
      const targetPart = getPartInfo(meta, i)
      if (targetPart.partIndex < unlockedPartIndex) return // locked, earlier part already finished
    }
    setIndex(i)
    setNavOpen(false)
  }

  const handleExpire = () => {
    onSubmit(answers)
  }

  const confirmFinishPart = () => {
    setUnlockedPartIndex((p) => p + 1)
    setNextPartDialog(false)
    goto(index + 1)
  }

  const categoryBadge = current.category ? CATEGORY_MAP[current.category] : null

  const isLastOfPart = hasParts && partInfo && partInfo.localIndex === partInfo.part.count - 1
  const isVeryLastQuestion = index === total - 1

  return (
    <div className="quiz">
      <header className="quiz-header">
        <button className="quiz-icon-btn" onClick={() => setExitDialog(true)} aria-label="Kembali ke beranda">
          <HomeIcon />
        </button>
        <div className="quiz-header__mid">
          <span className="eyebrow quiz-header__title">
            {meta.title}{partInfo ? ` — ${partInfo.part.label}` : ''}
          </span>
          <span className="mono quiz-header__progress">
            {partInfo ? `${partInfo.localIndex + 1} / ${partInfo.part.count}` : `${index + 1} / ${total}`}
          </span>
        </div>
        <Timer endTime={endTime} onExpire={handleExpire} />
      </header>

      <div className="quiz-progressbar">
        <div className="quiz-progressbar__fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <main className="quiz-body">
        <div className="quiz-qcard">
          <div className="quiz-qcard__top">
            <span className="quiz-qnum mono">
              {partInfo ? `${partInfo.part.label} · Soal ${partInfo.localIndex + 1}` : `Soal ${index + 1}`}
            </span>
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
        <button
          className="quiz-navbtn"
          onClick={() => goto(index - 1)}
          disabled={index === 0 || (hasParts && partInfo.localIndex === 0)}
        >
          &larr; Sebelumnya
        </button>
        <button className="quiz-navgrid-toggle mono" onClick={() => setNavOpen(true)}>{answeredCount}/{total} terjawab</button>
        {isVeryLastQuestion ? (
          <button className="quiz-navbtn quiz-navbtn--submit" onClick={() => setSubmitDialog(true)}>Submit</button>
        ) : isLastOfPart ? (
          <button className="quiz-navbtn quiz-navbtn--submit" onClick={() => setNextPartDialog(true)}>Selesai {partInfo.part.label} &rarr;</button>
        ) : (
          <button className="quiz-navbtn quiz-navbtn--primary" onClick={() => goto(index + 1)}>Selanjutnya &rarr;</button>
        )}
      </footer>

      {navOpen && (
        <div className="quiz-navsheet-backdrop" onClick={() => setNavOpen(false)}>
          <div className="quiz-navsheet" onClick={(e) => e.stopPropagation()}>
            <div className="quiz-navsheet__handle" />
            <h3>Navigasi Soal</h3>
            {hasParts && (
              <p className="quiz-navsheet__note">
                Bagian yang sudah diselesaikan terkunci dan tidak bisa diakses ulang, sesuai aturan ujian.
              </p>
            )}
            <div className="quiz-navsheet__grid">
              {session.map((q, i) => {
                const isAnswered = answers[q.instanceId] != null
                const isCurrent = i === index
                const isLocked = hasParts && getPartInfo(meta, i).partIndex < unlockedPartIndex
                return (
                  <button
                    key={q.instanceId}
                    className={`quiz-navdot mono ${isAnswered ? 'quiz-navdot--answered' : ''} ${isCurrent ? 'quiz-navdot--current' : ''} ${isLocked ? 'quiz-navdot--locked' : ''}`}
                    onClick={() => goto(i)}
                    disabled={isLocked}
                  >
                    {isLocked ? <LockDotIcon /> : i + 1}
                  </button>
                )
              })}
            </div>
            <button className="quiz-navsheet__submit" onClick={() => { setNavOpen(false); setSubmitDialog(true) }}>
              Akhiri &amp; Submit Sekarang
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

      {hasParts && partInfo && (
        <ConfirmDialog
          open={nextPartDialog}
          title={`Selesai ${partInfo.part.label}?`}
          message={`Setelah lanjut ke ${meta.parts[partInfo.partIndex + 1]?.label}, kamu tidak bisa kembali lagi ke ${partInfo.part.label}. Yakin sudah selesai?`}
          confirmLabel="Ya, Lanjut"
          cancelLabel="Cek Lagi"
          tone="brass"
          onConfirm={confirmFinishPart}
          onCancel={() => setNextPartDialog(false)}
        />
      )}

      <ConfirmDialog
        open={submitDialog}
        title="Yakin mau submit?"
        message={
          answeredCount < total
            ? `Halo? Yakin udahan? Masih ada ${total - answeredCount} soal yang belum kamu jawab.`
            : 'Halo? Yakin udahan? Semua soal udah kejawab kok.'
        }
        confirmLabel="Ya, Submit"
        cancelLabel="Cek Lagi"
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

function LockDotIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
