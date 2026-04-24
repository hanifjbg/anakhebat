# 🌟 Anak Hebat

[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)

> "Aplikasi edukasi interaktif untuk anak, difokuskan pada pengenalan huruf, suku kata, dan membaca dasar melalui metode gamifikasi yang menyenangkan."

**Anak Hebat** adalah platform pembelajaran berbasis web yang dirancang khusus untuk memandu anak-anak belajar membaca dengan cara yang interaktif, visual, dan menyenangkan. Dengan pendekatan _gamifikasi_, anak-anak akan merasa seperti sedang bermain sambil belajar!

---

## 🚀 Fitur Utama

- 🔤 **Modul Pengenalan Huruf** - Belajar huruf A-Z dengan visualisasi yang menarik dan interaktif.
- 🗣️ **Modul Huruf Vokal & Suku Kata** - Memahami penggabungan huruf menjadi suku kata dasar.
- 📖 **Modul Membaca Kalimat** - Melatih anak membaca kalimat sederhana dan bermakna.
- 🎮 **Sesi Kuis Ceria** - Menguji kemampuan membaca anak dengan interaksi kuis berhadiah skor dan animasi konfeti.
- 🏆 **Gamifikasi (Achievements)** - Anak-anak dapat mengumpulkan lencana pencapaian seiring berjalannya progres belajar.
- 🏅 **Papan Peringkat (Leaderboard)** - Memotivasi belajar menggunakan fitur papan skor harian dan mingguan.
- 📈 **Riwayat & Profil Pengguna** - Membantu pendidik / orangtua melacak _learning progress_ anak.
- 🎨 **Desain Ramah Edukasi** - UI/UX yang mulus dan interaktif dengan kombinasi *Motion* animations demi memfokuskan atensi belajar anak.

## 🛠️ Teknologi yang Digunakan

Aplikasi **Anak Hebat** dibangun di atas ekosistem *JavaScript/TypeScript* yang modern untuk menjamin kecepatan, keamanan, dan keandalan:

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool / Bundler:** Vite
- **Styling:** Tailwind CSS & DaisyUI
- **State Management:** Zustand & React Context
- **Routing:** React Router v7
- **Animasi & Efek UI:** Motion (`motion`) & Canvas Confetti (`canvas-confetti`)
- **Iconography:** Lucide React

## ⚙️ Panduan Instalasi & Pengembangan Lokal

Gunakan panduan berikut untuk menjalankan source code *Anak Hebat* di komputer Anda. Pastikan Anda telah menginstal `Node.js` terbaru.

**1. Clone Repository**
```bash
git clone https://github.com/hanifjbg/anakhebat.git
cd anakhebat
```

**2. Install Dependencies**
```bash
npm install
```

**3. Konfigurasi Environment Variables**
Aplikasi membutuhkan beberapa *environment variables* (jika ingin deploy/fitur eksternal, kamu dapat melihat template di `.env.example`).
```bash
cp .env.example .env
```

**4. Jalankan Development Server**
```bash
npm run dev
```
Buka browser dan akses `http://localhost:3000` untuk melihat aplikasi berjalan. Server mendukung _Hot Reload_ untuk mempermudah perancangan lanjutan.

## 📦 Build untuk Production

Untuk melakukan kompilasi proyek dan mengekspor aset statis guna ditaruh pada web server / layanan hosting (seperti Vercel, Netlify, atau Nginx).

```bash
npm run build
```
File akan ter-generate di dalam folder `dist/`. Anda dapat mempratinjau versi hasil rilisnya di _local machine_ dengan menjalankan:
```bash
npm run preview
```

## 🌐 Panduan Cloud Deployment

Aplikasi *Anak Hebat* telah teroptimalisasi menggunakan Vite.

1. **Vercel** _(Direkomendasikan)_:
   - Buat projek baru di **Vercel**.
   - Import repository GitHub ini.
   - Vercel secara otomatis akan mendeteksi `Vite` dan mengatur *Build Command* `npm run build` dan *Output Directory* `dist`.
   - Klik **Deploy**.
2. **GitHub Pages**:
   - Jika Anda lebih nyaman menggunakan fitur GitHub Actions lama, Anda bisa memanfaatkan actions official `actions/deploy-pages`, pastikan mengkonfigurasi script `.github/workflows/deploy.yml` dan merevisi rujukan base path pada `vite.config.ts`.
   - Set repository GitHub Pages source environment melalui setting GitHub.

## 📄 Lisensi

Berada di bawah lisensi Apache License 2.0. Silahkan lihat file `LICENSE` (jika tersedia) atau pengenal (_Identifier_) file di folder `src`.
