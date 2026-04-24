# 🚀 Roadmap & Walkthrough Pengembangan "Anak Hebat"

Dokumen ini berisi daftar fitur dan perbaikan UI yang akan dieksekusi selanjutnya.

## 🎨 1. UI Tweaks & Penyempurnaan (TBD)
- [ ] **Score Card (Halaman Hasil):** Mempercantik popup/halaman hasil akhir setelah kuis selesai. Tambahkan bintang (1-3) animasi konfeti, dan tombol "Main Lagi" atau "Lanjut".
- [ ] **Transisi Antar Soal:** Memperhalus animasi masuk/keluar saat soal berganti agar tidak kaku.
- [ ] **Konsistensi Tema:** Memastikan semua warna, border-radius, dan shadow seragam di seluruh modul.

## 👤 2. Profile & Dashboard
- [ ] **Halaman Profil (Profile Page):** Menampilkan nama anak, avatar/karakter, dan level saat ini.
- [ ] **Progress & Rapor (Report Card):** Grafik atau visualisasi sederhana yang menunjukkan modul mana yang sudah dikuasai (misal: Abjad 80%, Vokal 100%).
- [ ] **History:** Menyimpan riwayat permainan per hari.

## 🎁 3. Sistem Gamifikasi (Rewards & Engagement)
- [ ] **Koin / Bintang:** Setiap menyelesaikan modul tingkat medium/hard, anak mendapat "Bintang".
- [ ] **Kolektor Lencana (Badge Collector):** Sistem achievement. Contoh: "Lencana Pembaca Pemula" (Menyelesaikan Abjad + Vokal), "Pakar Suku Kata", dll.
- [ ] **Toko Virtual (Opsional):** Tempat menukarkan bintang dengan Avatar atau tema warna baru.

## 🎮 4. Minigames (Penyegaran)
- [ ] **Mini Game Break:** Game sederhana (misal: pecahkan balon huruf terbang, puzzle gambar sederhana) yang terbuka setelah anak belajar selama 15 menit berturut-turut. Tujuannya agar tidak bosan.

## 🌍 5. Alur Pengguna & Sistem Akun (Baru Ditambahkan)
Berdasarkan rencana pengembangan terbaru, alur (*flow*) pengguna akan diekspansi menjadi seperti berikut:
- [ ] **Splash Screen Wizard (Onboarding):** Layar sambutan awal untuk pertama kali kunjungan, menjelaskan aplikasi kepada orang tua.
- [ ] **Login Akun Orang Tua (Google OAuth):** Sistem autentikasi utama. Data anak nantinya akan disimpan dan terikat pada akun *parent* ini untuk mencegah kehilangan progres.
- [ ] **Keamanan PIN (Parental Gate):** Orang tua dapat mengatur PIN sehingga anak tidak dapat mengubah pengaturan/profil tanpa izin.
- [ ] **Manajemen Profil Anak:** Setelah login orang tua, dilanjutkan dengan menginput nama anak. (Infrastruktur disiapkan agar 1 *Parent* bisa memiliki banyak profil Anak untuk pengembangan selanjutnya).
- [ ] **Avatar & Kamera Selfie (Sistem Raport):** Saat membuat/mengatur profil, selain bisa mengacak avatar (Random Dice), akan ada opsi *Take a Picture*. Sistem tidak menggunakan *inline canvas/webcam API* demi menjaga privasi, melainkan akan membuka aplikasi kamera bawaan perangkat secara *native* (`<input type="file" accept="image/*" capture="user">`). Setelah dijepret dan dicentang (konfirmasi OS), foto akan di-*upload*. Foto ini krusial untuk dimasukkan ke dalam **Sistem Raport**.
- [ ] **Global Leaderboard:** Menampilkan papan skor peringkat untuk semua siswa secara global untuk menambah elemen kompetitif dan motivasi.

## 🛠️ 6. Super Admin & Platform CMS (Future Scope)
- [ ] **Super Admin Dashboard:** Panel kontrol khusus *developer/admin*.
- [ ] **Manajemen Konfigurasi:** Mengatur *global settings*, meracik sistem poin (*reward system*).
- [ ] **Bank Data Soal Dinamis:** Menambah dan mengelola bank data soal secara *(over-the-air)* tanpa harus melakukan *deploy* ulang source code; harus terpikirkan dari segi desain *database* (Firestore/BaaS).

---
*Catatan: Fokus utama adalah menyiapkan infrastruktur yang mendasari sistem Profil, Progress, dan Reward, lalu menyiapkan BaaS (seperti Firebase) untuk OAuth, Database (profil & soal), serta Cloud Storage untuk foto selfie profil anak.*
