export const CATEGORIES = [
  {
    key: 'akuntansi',
    code: 'AKT',
    title: 'Akuntansi',
    subtitle: 'Prinsip dasar, laporan keuangan & PSAK perbankan',
    questionCount: 50,
    durationMinutes: 100,
  },
  {
    key: 'alk',
    code: 'ALK',
    title: 'Analisis Laporan Keuangan',
    subtitle: 'Rasio keuangan, common size & interpretasi kinerja',
    questionCount: 50,
    durationMinutes: 100,
  },
  {
    key: 'audit',
    code: 'AUD',
    title: 'Audit Risk Based',
    subtitle: 'Opini audit, pengendalian internal & GCG',
    questionCount: 50,
    durationMinutes: 100,
  },
  {
    key: 'dataanalytics',
    code: 'DDD',
    title: 'Data Analytics & Decision Dashboard',
    subtitle: 'Data understanding, Power Query & analitik prediktif',
    questionCount: 50,
    durationMinutes: 100,
  },
]

export const TRYOUT_REAL = {
  key: 'tryout-real',
  code: 'TOR',
  title: 'Try Out Real',
  subtitle: 'Simulasi ujian gabungan — 15 soal tiap materi',
  questionCount: 60,
  durationMinutes: 90,
  perCategory: 15,
}

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]))

export const PASSING_GRADE = 70
