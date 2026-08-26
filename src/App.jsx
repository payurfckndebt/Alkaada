import { useState } from 'react'
import Home from './pages/Home.jsx'
import Preflight from './pages/Preflight.jsx'
import Quiz from './pages/Quiz.jsx'
import PartResult from './pages/PartResult.jsx'
import Result from './pages/Result.jsx'
import Review from './pages/Review.jsx'
import History from './pages/History.jsx'
import BankSoal from './pages/BankSoal.jsx'
import PasswordDialog from './components/PasswordDialog.jsx'
import { CATEGORY_MAP, TRYOUT_REAL } from './data/categories.js'
import {
  buildLatihanSession,
  buildTryoutRealSession,
  scoreSession,
  combineResults,
  evaluatePass,
} from './utils/quizEngine.js'
import { loadHistory, addHistoryEntry, clearHistory } from './utils/history.js'

function getMeta(key) {
  return key === TRYOUT_REAL.key ? TRYOUT_REAL : CATEGORY_MAP[key]
}

export default function App() {
  // screen: home | preflight | quiz | result-part1 | result | review | history | banksoal
  const [screen, setScreen] = useState('home')
  const [activeKey, setActiveKey] = useState(null)
  const [session, setSession] = useState(null) // used for regular Latihan sessions
  const [endTime, setEndTime] = useState(null)
  const [result, setResult] = useState(null) // final result (Latihan, or combined Try Out Real)
  const [history, setHistory] = useState(() => loadHistory())
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [bankUnlocked, setBankUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem('aalkada_bank_unlocked') === '1'
    } catch {
      return false
    }
  })

  // Try Out Real specific: two independent part sessions + Part 1's own finished result,
  // kept separate until Part 2 is also done.
  const [torParts, setTorParts] = useState(null) // { part1: [...], part2: [...] }
  const [currentPartKey, setCurrentPartKey] = useState('part1')
  const [resultPart1, setResultPart1] = useState(null)

  const isTryoutReal = activeKey === TRYOUT_REAL.key

  const handleSelect = (key) => {
    setActiveKey(key)
    setScreen('preflight')
  }

  const handleBackHome = () => {
    setActiveKey(null)
    setSession(null)
    setResult(null)
    setTorParts(null)
    setCurrentPartKey('part1')
    setResultPart1(null)
    setScreen('home')
  }

  const startSession = (key) => {
    const meta = getMeta(key)
    setResult(null)
    setEndTime(Date.now() + meta.durationMinutes * 60 * 1000)
    if (key === TRYOUT_REAL.key) {
      setTorParts(buildTryoutRealSession())
      setCurrentPartKey('part1')
      setResultPart1(null)
      setSession(null)
    } else {
      setSession(buildLatihanSession(key, meta.questionCount))
      setTorParts(null)
    }
    setScreen('quiz')
  }

  const handleStart = () => startSession(activeKey)
  const handleRepeat = () => startSession(activeKey)

  // Regular Latihan submit — single session, single final result.
  const handleSubmitLatihan = (answers) => {
    const scored = scoreSession(session, answers)
    setResult(scored)
    const meta = getMeta(activeKey)
    const { passed } = evaluatePass(meta, scored)
    recordHistory(meta, scored, passed)
    setScreen('result')
  }

  // Part 1 submit — score it standalone and show its own result screen.
  // Part 2 is not even built/visible yet at this point.
  const handleSubmitPart1 = (answers) => {
    const scored = scoreSession(torParts.part1, answers)
    setResultPart1(scored)
    setScreen('result-part1')
  }

  const handleContinueToPart2 = () => {
    setCurrentPartKey('part2')
    setScreen('quiz')
  }

  // Part 2 submit (or time running out during the Part-1-result interlude, in which case
  // answers is simply {} — nothing done on Part 2). Combines both parts' scores, evaluates
  // pass/fail per part, and only now writes a single history entry for the whole exam.
  const handleSubmitPart2 = (answers) => {
    const scoredPart2 = scoreSession(torParts.part2, answers)
    const combined = combineResults(resultPart1, scoredPart2)
    setResult(combined)
    const { passed } = evaluatePass(TRYOUT_REAL, combined)
    recordHistory(TRYOUT_REAL, combined, passed)
    setScreen('result')
  }

  const recordHistory = (meta, scored, passed) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      key: activeKey,
      code: meta.code,
      title: meta.title,
      correct: scored.correct,
      total: scored.total,
      scorePercent: scored.scorePercent,
      passed,
      timestamp: Date.now(),
    }
    setHistory(addHistoryEntry(entry))
  }

  const handleOpenHistory = () => setScreen('history')
  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  const handleRequestBankSoal = () => {
    if (bankUnlocked) {
      setScreen('banksoal')
    } else {
      setPasswordOpen(true)
    }
  }
  const handlePasswordSuccess = () => {
    setPasswordOpen(false)
    setBankUnlocked(true)
    try {
      window.sessionStorage.setItem('aalkada_bank_unlocked', '1')
    } catch {
      // ignore
    }
    setScreen('banksoal')
  }

  const meta = activeKey ? getMeta(activeKey) : null
  const isMixed = isTryoutReal

  // Which part config + result are we showing on 'result-part1'?
  const part1Config = TRYOUT_REAL.parts[0]
  const part2Config = TRYOUT_REAL.parts[1]
  // resultPart1.detail already carries `.part === 'part1'` on every question (set at session
  // build time), so evaluatePass against the full TRYOUT_REAL config correctly isolates it.
  const part1Passed = resultPart1 ? evaluatePass(TRYOUT_REAL, resultPart1).partScores[0].passed : false

  // The current quiz session/props to render, depending on plain Latihan vs Try Out Real part.
  const quizSession = isTryoutReal ? (torParts ? torParts[currentPartKey] : null) : session
  const quizMeta = isTryoutReal
    ? { ...TRYOUT_REAL, title: `${TRYOUT_REAL.title} — ${currentPartKey === 'part1' ? part1Config.label : part2Config.label}`, questionCount: (currentPartKey === 'part1' ? part1Config.count : part2Config.count) }
    : meta
  const quizOnSubmit = isTryoutReal ? (currentPartKey === 'part1' ? handleSubmitPart1 : handleSubmitPart2) : handleSubmitLatihan
  const quizFinishLabel = isTryoutReal && currentPartKey === 'part1' ? `Selesai ${part1Config.label} \u2192` : 'Submit'
  const quizFinishDialogTitle = isTryoutReal && currentPartKey === 'part1' ? `Yakin sudah selesai ${part1Config.label}?` : 'Yakin mau submit?'
  const quizFinishDialogMessage = isTryoutReal && currentPartKey === 'part1'
    ? `Setelah ini nilai ${part1Config.label} langsung final dan kamu lanjut ke ${part2Config.label}. Kamu tidak bisa kembali lagi ke ${part1Config.label}.`
    : undefined
  const quizFinishConfirmLabel = isTryoutReal && currentPartKey === 'part1' ? 'Ya, Selesai' : 'Ya, Submit'

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <Home
          onSelect={handleSelect}
          onHistory={handleOpenHistory}
          onBankSoal={handleRequestBankSoal}
          historyCount={history.length}
        />
      )}

      {screen === 'preflight' && meta && (
        <Preflight meta={meta} onStart={handleStart} onBack={handleBackHome} />
      )}

      {screen === 'quiz' && quizSession && quizMeta && (
        <Quiz
          session={quizSession}
          meta={quizMeta}
          endTime={endTime}
          onExit={handleBackHome}
          onSubmit={quizOnSubmit}
          finishLabel={quizFinishLabel}
          finishDialogTitle={quizFinishDialogTitle}
          finishDialogMessage={quizFinishDialogMessage}
          finishConfirmLabel={quizFinishConfirmLabel}
        />
      )}

      {screen === 'result-part1' && resultPart1 && (
        <PartResult
          part={part1Config}
          nextPart={part2Config}
          scored={resultPart1}
          passed={part1Passed}
          endTime={endTime}
          onContinue={handleContinueToPart2}
          onExit={handleBackHome}
          onTimeUp={() => handleSubmitPart2({})}
          onRepeat={handleRepeat}
        />
      )}

      {screen === 'result' && result && meta && (
        <Result
          result={result}
          meta={meta}
          isMixed={isMixed}
          onReview={() => setScreen('review')}
          onHome={handleBackHome}
        />
      )}

      {screen === 'review' && result && meta && (
        <Review
          result={result}
          meta={meta}
          onHome={handleBackHome}
          onRepeat={handleRepeat}
          onBackToResult={() => setScreen('result')}
        />
      )}

      {screen === 'history' && (
        <History items={history} onHome={handleBackHome} onClear={handleClearHistory} />
      )}

      {screen === 'banksoal' && (
        <BankSoal onHome={handleBackHome} />
      )}

      <PasswordDialog
        open={passwordOpen}
        onSuccess={handlePasswordSuccess}
        onCancel={() => setPasswordOpen(false)}
      />
    </div>
  )
}
