import { useState } from 'react'
import './PasswordDialog.css'

// Client-side gate only — this is a static site with no backend/database,
// so the password is just a soft lock, not real security.
const BANKSOAL_PASSWORD = 'kelasbea3x'

export default function PasswordDialog({ open, onSuccess, onCancel }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === BANKSOAL_PASSWORD) {
      setValue('')
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  const handleCancel = () => {
    setValue('')
    setError(false)
    onCancel()
  }

  return (
    <div className="pwd-backdrop" role="dialog" aria-modal="true" aria-labelledby="pwd-title">
      <form className={`pwd-card ${shake ? 'pwd-card--shake' : ''}`} onSubmit={handleSubmit}>
        <div className="pwd-badge">
          <LockIcon />
        </div>
        <h3 className="pwd-title" id="pwd-title">Bank Soal Terkunci</h3>
        <p className="pwd-message">Masukkan password untuk melihat seluruh bank soal beserta kunci jawabannya.</p>
        <input
          type="password"
          className={`pwd-input ${error ? 'pwd-input--error' : ''}`}
          placeholder="Password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          autoFocus
        />
        {error && <p className="pwd-error">Password salah, coba lagi.</p>}
        <div className="pwd-actions">
          <button type="button" className="pwd-btn pwd-btn--ghost" onClick={handleCancel}>Batal</button>
          <button type="submit" className="pwd-btn pwd-btn--primary">Buka</button>
        </div>
      </form>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
