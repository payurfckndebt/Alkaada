import { useState } from 'react'
import Home from './pages/Home.jsx'
import Preflight from './pages/Preflight.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import Review from './pages/Review.jsx'
import { CATEGORY_MAP, TRYOUT_REAL } from './data/categories.js'
import { buildLatihanSession, buildTryoutRealSession, scoreSession } from './utils/quizEngine.js'

function getMeta(key) {
  return key === TRYOUT_REAL.key ? TRYOUT_REAL : CATEGORY_MAP[key]
}

export default function App() {
  const [screen, setScreen] = useState('home') // home | preflight | quiz | result | review
  const [activeKey, setActiveKey] = useState(null)
  const [session, setSession] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [result, setResult] = useState(null)

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
    setScreen('quiz')
  }

  const handleSubmit = (answers) => {
    const scored = scoreSession(session, answers)
    setResult(scored)
    setScreen('result')
  }

  const meta = activeKey ? getMeta(activeKey) : null
  const isMixed = activeKey === TRYOUT_REAL.key

  return (
    <div className="app-shell">
      {screen === 'home' && <Home onSelect={handleSelect} />}

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
        <Review result={result} meta={meta} onHome={handleBackHome} />
      )}
    </div>
  )
}
