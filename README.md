# AALKADA — Try Out

Aplikasi latihan soal & try out interaktif untuk 4 materi: **A**kuntansi, **A**nalisis **L**aporan **K**euangan, **A**udit Risk Based, dan **D**ata **A**nalytics (AALKADA). Dibangun sebagai static web app (React + Vite) — tidak butuh backend/database, semua bank soal ter-bundle sebagai data statis.

## Fitur

- **4 menu Latihan** (Akuntansi, ALK, Audit Risk Based, Data Analytics & Decision Dashboard) — masing-masing 50 soal random, waktu 100 menit.
- **Try Out Real** — simulasi ujian resmi, 2 bagian berurutan (Bagian 1: 40 soal Accounting & Laporan Keuangan, Bagian 2: 40 soal Data Analytics & Audit setelah Bagian 1 selesai), total 80 soal, waktu 120 menit. Begitu Bagian 1 diselesaikan, soalnya terkunci dan tidak bisa diakses ulang.
- Soal & urutan opsi jawaban diacak setiap sesi dimulai.
- Dialog konfirmasi "Dah siap belom?" sebelum tiap sesi mulai.
- Timer countdown otomatis submit saat waktu habis.
- Navigator soal (lompat ke soal manapun, lihat status terjawab/belum).
- Dialog konfirmasi setiap kali keluar dari sesi yang sedang berjalan — lewat ikon Home, tombol back HP/browser (hardware back), maupun tutup/refresh tab.
- Skor akhir dengan pesan lulus/tidak lulus (passing grade default 75, bisa diubah di `src/data/categories.js`) + breakdown per materi. Khusus Try Out Real, kelulusan dievaluasi **per bagian** (KKM 75 di Bagian 1 DAN Bagian 2 masing-masing, bukan dari rata-rata gabungan 80 soal) — lolos hanya jika kedua bagian sama-sama mencapai KKM.
- Halaman pembahasan lengkap per soal (benar/salah/tidak dijawab) dengan filter.
- Tombol "Ulangi?" (sesi baru dengan soal random) dan "Home?" di akhir halaman pembahasan.
- **Riwayat sesi** — mencatat skor & materi tiap sesi yang diselesaikan selama tab masih terbuka (pakai `sessionStorage`, tanpa database — otomatis hilang saat tab ditutup).
- **Bank Soal terkunci** — menu berisi seluruh soal + kunci jawaban + pembahasan, dibuka dengan password (`kelasbea3x`, dicek langsung di kode klien, tidak disimpan di database manapun).
- Mobile-first, responsive, tema merah cerah & putih, tanpa dependency backend.

### Catatan soal Riwayat & Bank Soal

- **Riwayat** disimpan di `sessionStorage` browser (bukan localStorage/database) — artinya riwayat hanya bertahan selama tab itu terbuka dan hilang begitu tab ditutup, sesuai permintaan "tanpa database".
- **Bank Soal** dilindungi password di sisi klien saja. Karena ini aplikasi statis tanpa backend, ini hanyalah kunci ringan (soft-lock) untuk mencegah akses tidak sengaja — bukan keamanan sesungguhnya, karena kode sumbernya (termasuk password) tetap bisa dibaca siapa pun yang membuka source aplikasi. Kalau butuh proteksi yang lebih serius, perlu backend/auth sungguhan.

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
    ├── App.jsx               # state machine layar (home/preflight/quiz/result/review/history/banksoal)
    ├── data/
    │   ├── questionBank.json # 503 soal (Akuntansi 215+, ALK 124+, Audit 114, Data Analytics 33)
    │   └── categories.js     # metadata 4 materi + Try Out Real + PASSING_GRADE
    ├── utils/
    │   ├── quizEngine.js     # sampling soal, acak opsi, scoring
    │   └── history.js        # riwayat sesi via sessionStorage (tanpa database)
    ├── components/
    │   ├── Timer.jsx
    │   ├── ConfirmDialog.jsx
    │   └── PasswordDialog.jsx # gate password untuk menu Bank Soal
    ├── pages/
    │   ├── Home.jsx / Home.css
    │   ├── Preflight.jsx / Preflight.css
    │   ├── Quiz.jsx / Quiz.css
    │   ├── Result.jsx / Result.css
    │   ├── Review.jsx / Review.css
    │   ├── History.jsx / History.css
    │   └── BankSoal.jsx / BankSoal.css
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
- Bank soal Data Analytics diambil dari modul latihan Data Analytics OJK (33 soal, Modul 1–10).
- Karena bank soal Data Analytics lebih sedikit dari yang lain, soal dapat berulang dalam satu sesi 50 soal (sesuai preferensi yang dipilih saat pengembangan).
