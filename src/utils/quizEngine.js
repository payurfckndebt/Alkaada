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
  // Returns two SEPARATE, independently-timed-but-shared-clock sessions per the official rule:
  // Part 1 (Accounting & Laporan Keuangan) must be fully completed — with its own score shown —
  // before Part 2 (Data Analytics & Audit) can even be started. Each is its own flat array;
  // the caller (App) is responsible for sequencing them and only combining scores at the end.
  const result = {}
  TRYOUT_REAL.parts.forEach((part) => {
    const perCategory = part.count / part.categories.length
    let block = []
    part.categories.forEach((key) => {
      const picked = sampleQuestions(bank[key] || [], perCategory)
      block = block.concat(picked.map((q) => ({ ...q, __category: key, __part: part.key })))
    })
    block = shuffle(block)
    result[part.key] = block.map((q, idx) => ({
      ...randomizeOptionOrder(q, `tor-${part.key}-${idx}-${q.id}`),
      category: q.__category,
      part: q.__part,
    }))
  })
  return result // { part1: [...40 questions], part2: [...40 questions] }
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

// Combines two already-scored parts into one summary result object for the final
// screen — used only after BOTH parts are complete. Pass/fail is still determined
// per-part (see evaluatePass), this is purely for the combined display numbers.
export function combineResults(resultA, resultB) {
  const detail = [...resultA.detail, ...resultB.detail]
  const correct = resultA.correct + resultB.correct
  const total = resultA.total + resultB.total
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
