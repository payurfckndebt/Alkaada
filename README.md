# MLE TryOut AALKADA

Aplikasi latihan soal & try out interaktif untuk 4 materi: **A**kuntansi, **A**nalisis **L**aporan **K**euangan, **A**udit Risk Based, dan **D**ata **A**nalytics (AALKADA). Dibangun sebagai static web app (React + Vite) — tidak butuh backend/database, semua bank soal ter-bundle sebagai data statis.

## Fitur

- **4 menu Latihan** (Akuntansi, ALK, Audit Risk Based, Data Analytics & Decision Dashboard) — masing-masing 50 soal random, waktu 100 menit.
- **Try Out Real** — 60 soal campuran (15 soal per materi), waktu 90 menit.
- Soal & urutan opsi jawaban diacak setiap sesi dimulai.
- Timer countdown otomatis submit saat waktu habis.
- Navigator soal (lompat ke soal manapun, lihat status terjawab/belum).
- Skor akhir + breakdown per materi (khusus Try Out Real).
- Halaman pembahasan lengkap per soal (benar/salah/tidak dijawab) dengan filter.
- Dialog konfirmasi setiap kali keluar dari sesi yang sedang berjalan (klik ikon Home atau tutup/refresh tab).
- Mobile-first, responsive, tanpa dependency backend.

## Menjalankan secara lokal

Butuh Node.js 18+.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview   # opsional, untuk cek hasil build secara lokal
```

Hasil build ada di folder `dist/`.

## Deploy ke Vercel (via GitHub)

1. Push folder ini ke repository GitHub baru.
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo GitHub tersebut.
3. Vercel akan otomatis mendeteksi framework **Vite**. Pastikan pengaturan berikut (biasanya sudah otomatis lewat `vercel.json`):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Klik **Deploy**. Selesai — tidak ada environment variable atau database yang perlu dikonfigurasi.

## Struktur proyek

```
├── index.html
├── vercel.json
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # entry point
    ├── App.jsx               # state machine layar (home/preflight/quiz/result/review)
    ├── data/
    │   ├── questionBank.json # 498 soal (Akuntansi 215+, ALK 124+, Audit 114, Data Analytics 28)
    │   └── categories.js     # metadata 4 materi + Try Out Real
    ├── utils/
    │   └── quizEngine.js     # sampling soal, acak opsi, scoring
    ├── components/
    │   ├── Timer.jsx
    │   └── ConfirmDialog.jsx
    ├── pages/
    │   ├── Home.jsx / Home.css
    │   ├── Preflight.jsx / Preflight.css
    │   ├── Quiz.jsx / Quiz.css
    │   ├── Result.jsx / Result.css
    │   └── Review.jsx / Review.css
    └── styles/
        └── global.css        # design tokens (warna, tipografi)
```

## Mengubah / menambah bank soal

Edit langsung `src/data/questionBank.json`. Formatnya:

```json
{
  "akuntansi": [
    {
      "id": "AKT-1",
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": "B",
      "explanation": "..."
    }
  ],
  "alk": [...],
  "audit": [...],
  "dataanalytics": [...]
}
```

Key kategori (`akuntansi`, `alk`, `audit`, `dataanalytics`) harus sesuai dengan `key` di `src/data/categories.js`.

## Catatan sumber soal

- Bank soal Akuntansi/ALK/Audit diambil dari kompilasi bank soal latihan (215/124/114 soal) ditambah 4 studi kasus (dikonversi menjadi 17 soal pilihan ganda).
- Bank soal Data Analytics diambil dari modul latihan Data Analytics OJK (28 soal, Modul 1–10).
- Karena bank soal Data Analytics lebih sedikit dari yang lain, soal dapat berulang dalam satu sesi 50 soal (sesuai preferensi yang dipilih saat pengembangan).
