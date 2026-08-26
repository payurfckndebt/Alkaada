import bank from '../data/questionBank.json'
import { TRYOUT_REAL, PASSING_GRADE } from '../data/categories.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Pick `count` questions from a pool. Repeats allowed if pool smaller than count,
// but we still avoid immediate duplicates by cycling through shuffled copies of the pool.
function sampleQuestions(pool, count) {
  if (pool.length === 0) return []
  const picked = []
  let cycle = shuffle(pool)
  while (picked.length < count) {
    if (cycle.length === 0) cycle = shuffle(pool)
    picked.push(cycle.pop())
  }
  return picked
}

// Re-key options into a shuffled order per question instance, remapping the answer key.
function randomizeOptionOrder(question, instanceId) {
  const letters = ['A', 'B', 'C', 'D']
  const entries = letters.map((l) => ({ letter: l, text: question.options[l] }))
  const shuffled = shuffle(entries)
  const newOptions = {}
  let newAnswer = null
  shuffled.forEach((entry, idx) => {
    const newLetter = letters[idx]
    newOptions[newLetter] = entry.text
    if (entry.letter === question.answer) newAnswer = newLetter
  })
  return {
    instanceId,
    sourceId: question.id,
    question: question.question,
    options: newOptions,
    answer: newAnswer,
    explanation: question.explanation,
  }
}

export function buildLatihanSession(categoryKey, questionCount) {
  const pool = bank[categoryKey] || []
  const picked = sampleQuestions(pool, questionCount)
  return picked.map((q, idx) => randomizeOptionOrder(q, `${categoryKey}-${idx}-${q.id}`))
}

export function buildTryoutRealSession() {
  // Builds the exam as sequential blocks per the official rule: Part 1 (Accounting &
  // Laporan Keuangan) must be fully ordered before Part 2 (Data Analytics & Audit).
  // Questions are shuffled within each part, but the two parts are never interleaved.
  const session = []
  TRYOUT_REAL.parts.forEach((part) => {
    const perCategory = part.count / part.categories.length
    let block = []
    part.categories.forEach((key) => {
      const picked = sampleQuestions(bank[key] || [], perCategory)
      block = block.concat(picked.map((q) => ({ ...q, __category: key, __part: part.key })))
    })
    block = shuffle(block)
    session.push(...block)
  })
  return session.map((q, idx) => ({
    ...randomizeOptionOrder(q, `tor-${idx}-${q.id}`),
    category: q.__category,
    part: q.__part,
  }))
}

// Given a session index and a meta with `parts` config, returns info about which
// part that question belongs to, its 1-based position within the part, and the
// part's start/end index boundaries within the flat session array.
export function getPartInfo(meta, index) {
  if (!meta?.parts) return null
  let offset = 0
  for (let i = 0; i < meta.parts.length; i++) {
    const part = meta.parts[i]
    const start = offset
    const end = offset + part.count // exclusive
    if (index < end) {
      return {
        part,
        partIndex: i,
        isLastPart: i === meta.parts.length - 1,
        start,
        end,
        localIndex: index - start, // 0-based within the part
      }
    }
    offset = end
  }
  return null
}

export function scoreSession(questions, answers) {
  let correct = 0
  const detail = questions.map((q) => {
    const given = answers[q.instanceId] || null
    const isCorrect = given === q.answer
    if (isCorrect) correct += 1
    return {
      ...q,
      given,
      isCorrect,
      isAnswered: given !== null && given !== undefined,
    }
  })
  const total = questions.length
  const scorePercent = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0
  return { correct, total, scorePercent, detail }
}

// Determines pass/fail. For sessions with `parts` (Try Out Real), the KKM/passing grade
// applies PER SECTION independently — a candidate must clear 75 in Bagian 1 AND Bagian 2
// separately, not just on the combined 80-question average. Regular single-category
// Latihan sessions still use one overall passing grade check.
export function evaluatePass(meta, result) {
  if (meta?.parts) {
    const partScores = meta.parts.map((part) => {
      const items = result.detail.filter((d) => d.part === part.key)
      const correct = items.filter((d) => d.isCorrect).length
      const total = items.length
      const scorePercent = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0
      return {
        key: part.key,
        label: part.label,
        correct,
        total,
        scorePercent,
        passed: scorePercent >= PASSING_GRADE,
      }
    })
    return { passed: partScores.every((p) => p.passed), partScores }
  }
  return { passed: result.scorePercent >= PASSING_GRADE, partScores: null }
}
