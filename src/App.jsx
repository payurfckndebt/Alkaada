import { useState } from 'react'
import Home from './pages/Home.jsx'
import Preflight from './pages/Preflight.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import Review from './pages/Review.jsx'
import History from './pages/History.jsx'
import BankSoal from './pages/BankSoal.jsx'
import PasswordDialog from './components/PasswordDialog.jsx'
import { CATEGORY_MAP, TRYOUT_REAL, PASSING_GRADE } from './data/categories.js'
import { buildLatihanSession, buildTryoutRealSession, scoreSession } from './utils/quizEngine.js'
import { loadHistory, addHistoryEntry, clearHistory } from './utils/history.js'

function getMeta(key) {
  return key === TRYOUT_REAL.key ? TRYOUT_REAL : CATEGORY_MAP[key]
}

export default function App() {
  const [screen, setScreen] = useState('home') // home | preflight | quiz | result | review | history | banksoal
  const [activeKey, setActiveKey] = useState(null)
  const [session, setSession] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(() => loadHistory())
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [bankUnlocked, setBankUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem('aalkada_bank_unlocked') === '1'
    } catch {
      return false
    }
  })

  const handleSelect = (key) => {
    setActiveKey(key)
    setScreen('preflight')
  }

  const handleBackHome = () => {
    setActiveKey(null)
    setSession(null)
    setResult(null)
    setScreen('home')
  }

  const handleStart = () => {
    const meta = getMeta(activeKey)
    const built = activeKey === TRYOUT_REAL.key
      ? buildTryoutRealSession()
      : buildLatihanSession(activeKey, meta.questionCount)
    setSession(built)
    setEndTime(Date.now() + meta.durationMinutes * 60 * 1000)
    setResult(null)
    setScreen('quiz')
  }

  const handleRepeat = () => {
    handleStart()
  }

  const handleSubmit = (answers) => {
    const scored = scoreSession(session, answers)
    setResult(scored)
    const meta = getMeta(activeKey)
    const passed = scored.scorePercent >= PASSING_GRADE
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
    setScreen('result')
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
  const isMixed = activeKey === TRYOUT_REAL.key

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

      {screen === 'quiz' && session && meta && (
        <Quiz
          session={session}
          meta={meta}
          endTime={endTime}
          onExit={handleBackHome}
          onSubmit={handleSubmit}
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
        <Review result={result} meta={meta} onHome={handleBackHome} onRepeat={handleRepeat} />
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
