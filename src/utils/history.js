const KEY = 'aalkada_history_v1'

export function loadHistory() {
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addHistoryEntry(entry) {
  const current = loadHistory()
  const next = [entry, ...current].slice(0, 50)
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // sessionStorage unavailable (e.g. private mode) — history just won't persist across reloads.
  }
  return next
}

export function clearHistory() {
  try {
    window.sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
