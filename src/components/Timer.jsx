import { useEffect, useRef, useState } from 'react'

function format(seconds) {
  const s = Math.max(0, seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

export default function Timer({ endTime, onExpire }) {
  const [remaining, setRemaining] = useState(() => Math.round((endTime - Date.now()) / 1000))
  const firedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      const rem = Math.round((endTime - Date.now()) / 1000)
      setRemaining(rem)
      if (rem <= 0 && !firedRef.current) {
        firedRef.current = true
        clearInterval(id)
        onExpire?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [endTime, onExpire])

  const low = remaining <= 300 // last 5 minutes
  const critical = remaining <= 60

  return (
    <div className={`timer mono ${low ? 'timer--low' : ''} ${critical ? 'timer--critical' : ''}`}>
      <span className="timer-dot" aria-hidden="true" />
      {format(remaining)}
    </div>
  )
}
