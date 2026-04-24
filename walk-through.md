# 🚀 Project Blueprint & Roadmap: Anak Hebat

## 📝 App Description
**Anak Hebat** adalah aplikasi edukasi interaktif berbasis PWA untuk anak usia dini, difokuskan pada pengenalan huruf, suku kata, dan membaca dasar. Menggabungkan metode gamifikasi, sistem reward, dan arsitektur modul *plug-and-play* untuk pengalaman belajar yang menyenangkan sekaligus aman dipantau oleh orang tua (Parenting Dashboard & PIN).

---

## 🏗️ Arsitektur & Teknologi
- **Tech Stack**: React + Vite, Tailwind CSS, Lucide Icons, Google Fonts, Firebase (Auth, Firestore, Cloud Storage).
- **Architecture**:
  - **Modular Monolith**: Core engine memisahkan logika UI dan pengolahan konten materi. Modul-modul belajar bersifat independen, dapat ditambah kapan saja.
  - **Domain-Driven Design (DDD) & Separation of Concerns (SoC)**: Pemisahan state management, layanan backend (Firebase), komponen spesifik-fitur, dan core system.
  - **Data-Driven UI**: Konten modul dirender otomatis berdasarkan definisi objek (struktur data) atau JSON dari *engine* agar pembuatan modul selanjutnya sangat mudah.
- **Konsep Mobile-First & PWA**: Dioptimasi untuk diakses pada resolusi *mobile* menyerupai layout native app, mendukung instalasi, serta dilengkapi *Light/Dark mode defaults*.
- **Aksesibilitas Spesifik Konten (Toolbar)**: Toggle kapitalisasi, resize font adaptif (flex styling), perubahan *font-family* (Comic/Latin), dan implementasi *Native Browser TTS (Text-to-Speech)* terintegrasi.

---

## 📂 Struktur Direktori (Draft)

```text
/
├── public/                 # Aset statis (manifest PWA, PWA Icons, audio BGM/SFX)
├── src/
│   ├── assets/             # Assets gambar lokal, ilustrasi SVG
│   ├── components/         # Komponen Atomic UI (Global Reusables)
│   │   ├── atoms/          # Button, Input, Icon, Typography, Toast, Keypad
│   │   ├── molecules/      # Modal Dialog, Toolbar Aksesibilitas, Card Modul
│   │   └── organisms/      # Header Seamless, Navigation Bottom Bar, Layout Wrapper
│   ├── core/               # Konfigurasi System (Routing, Theming, PWA)
│   │   ├── engine/         # "Modul Engine" pengolah struktur relasional data ke Component
│   │   └── audio/          # Global Manager untuk BGM & SFX (transisi, klik, feedback)
│   ├── domains/            # Implementasi Domain Logic Spesifik
│   │   ├── auth/           # Login Google OAuth, sistem PIN Parent, Auth Context
│   │   ├── dashboard/      # View daftar game dan navigasi utama
│   │   ├── learning/       # Core screen materi, kalkulasi kuis, TTS helper
│   │   ├── profile/        # Biodata anak, Rapor Elektronik
│   │   └── rewards/        # Logic XP, Poin penyelesaian modul, Badge sistem
│   ├── modules/            # Kumpulan Konfigurasi Materi & Soal (Murni Data/Logic Relasional)
│   │   ├── mengenal_abjad/ # Modul Pengenalan Huruf
│   │   ├── huruf_vokal/    # Modul Vokal dan Ba-bi-bu
│   │   └── rakit_kalimat/  # Modul pembentukan kata dari keypad kalimat
│   ├── services/           # Layanan Firebase (Auth, Firestore DB, Cloud Storage Data)
│   ├── styles/             # Global Tailwind styles (.css)
│   ├── types/              # Definisi interface TypeScript global (.d.ts)
│   ├── utils/              # Helper murni (format string, randomizer kuis, dll)
│   ├── App.tsx             # Root Provider & Router Boundary
│   └── main.tsx            # React Bootstrap Entry
└── package.json
```

---

## 🗺️ Roadmap & Milestones

### Phase 1: Fondasi & Sistem Dasar (Base Setup)
- [ ] Inisialisasi Firebase Auth (Login Google) & Firebase Firestore (via Tools Agent).
- [ ] Menyiapkan Global CSS Tailwind & konfigurasi Dark/Light mode, import Google Fonts.
- [ ] Membuat implementasi base Atomic UI (Buttons, Card, Modal, Keypad, dll).
- [ ] Membuat Global Layouts (Seamless Top Bar, Fixed Bottom Navigation ICON).

### Phase 2: Autentikasi & Dashboard 
- [ ] Layar Splash Screen / Welcome Wizard interaktif.
- [ ] Integrasi Parent Google Login (OAuth).
- [ ] Setup PIN keamanan Parent & Halaman pembuatan Profil Anak.
- [ ] Setup Dashboard: Menampilkan *Playlist* atau Grid modul, level, dan kondisi lock/unlock modul.

### Phase 3: Core Module Engine & UX Aksesibilitas
- [ ] Pengembangan Core *Plugin Engine*: Menampilkan layout Materi atau Kuis berdasarkan suplai struktur materi.
- [ ] Panel Aksesibilitas Toolbar (Sizing teks responsif, ganti *font*, mode KAPITAL/kecil, TTS Native Button).
- [ ] Engine *Randomizer* soal kuis, logika jawaban, dan kalkulasi point Kuis.

### Phase 4: Prototipe 3 Modul Utama
- [ ] **Modul 1: Mengenal Abjad**: Menampilkan grid kotak-kotak (A-Z). Kuis 1 huruf dengan 4 tombol jawaban.
- [ ] **Modul 2: Huruf Vokal**: Navigasi slide per halaman untuk BA BI BU BE BO. Kuis rakit dari 4 pilihan acak.
- [ ] **Modul 3: Membaca Kalimat**: Membaca deret vokal, soal menggunakan keypad modular rakit kata.

### Phase 5: Evaluasi & Sistem Reward (Gamifikasi)
- [ ] Flow selebrasi kuis selesai (Menampilkan Bintang, Skor, Badge, dan progress XP).
- [ ] Halaman Peta Reward anak (Buku Koleksi Stiker/Badge).
- [ ] Rapor digital untuk orang tua di Profil.
- [ ] Integrasi elemen Audio SFX (saat dapat bintang, saat klik benar/salah).
- [ ] *[Opsional/Saran]* Modul Mini Game "Canvas Bebas Coretan" jika anak mencapai level/poin tertentu.

---

## 💡 Ide Tambahan untuk Didiskusikan:
1. **Audio Feedback (SFX + BGM)**: Feedback suara sangat krusial bagi balita. Rencananya kita akan mengatur transisi suara: 'Ting' (Benar), 'Boing' (Salah), dan 'Tadaa/Clapping' saat layar reward.
2. **Koleksi Stiker**: Selain poin numerik yang mungkin sulit dimengerti balita, sistem reward dapat berupa mendapatkan animasi "Stiker" yang masuk ke Halaman Profil/Stiker Anak.
3. **TTS Override System (Voice Acting Tambahan)**: Karena *Native Browser TTS* terkadang terdengar robotik/kaku, struktur kita sebaiknya mendukung `audioUrl` di dalam data JSON soal. Jika *file mp3* sulih suara (voice over) orang betulan disediakan via *Cloud Storage*, sistem memutar audio mp3 tersebut. Jika kosong, sistem otomatis fallback ke *Native TTS*.
4. **Daily Streak**: Anak yang belajar tiap hari berturut-turut dapat animasi atau elemen dekorasi tambahan untuk meningkatkan retensi.
