import bank from '../data/questionBank.json'
import { TRYOUT_REAL } from '../data/categories.js'

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
  const categoryKeys = ['akuntansi', 'alk', 'audit', 'dataanalytics']
  let combined = []
  categoryKeys.forEach((key) => {
    const picked = sampleQuestions(bank[key] || [], TRYOUT_REAL.perCategory)
    combined = combined.concat(picked.map((q) => ({ ...q, __category: key })))
  })
  combined = shuffle(combined)
  return combined.map((q, idx) => ({
    ...randomizeOptionOrder(q, `tor-${idx}-${q.id}`),
    category: q.__category,
  }))
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
