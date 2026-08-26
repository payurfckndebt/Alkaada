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
  subtitle: 'Simulasi ujian resmi — 2 bagian berurutan',
  questionCount: 80,
  durationMinutes: 120,
  parts: [
    {
      key: 'part1',
      label: 'Bagian 1',
      subtitle: 'Accounting & Laporan Keuangan',
      categories: ['akuntansi', 'alk'],
      count: 40,
    },
    {
      key: 'part2',
      label: 'Bagian 2',
      subtitle: 'Data Analytics & Audit',
      categories: ['dataanalytics', 'audit'],
      count: 40,
    },
  ],
}

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]))

export const PASSING_GRADE = 75
