# 🍳 ResepKu - Aplikasi Katalog Resep Modern

**ResepKu** adalah sebuah aplikasi web responsif dan modern yang dirancang untuk memudahkan Anda menemukan, menyimpan, dan membagikan resep masakan favorit Anda. Aplikasi ini dibangun dengan antarmuka yang elegan serta dilengkapi fitur *Light Mode* dan *Dark Mode* untuk kenyamanan mata pengguna.

## ✨ Fitur Utama
- **Dark/Light Mode**: Sesuaikan tema aplikasi dengan preferensi Anda (terang atau gelap).
- **Katalog & Filter**: Cari resep berdasarkan nama atau filter berdasarkan kategori (Makanan Utama, Pembuka, Penutup, dll).
- **Sistem Autentikasi**: Fitur Login dan Register sederhana agar setiap pengguna memiliki pengalaman yang dipersonalisasi.
- **Koleksi Favorit**: Simpan resep-resep yang Anda sukai ke dalam daftar Favorit untuk diakses kembali dengan cepat.
- **CRUD Resep**: Pengguna (atau Admin) dapat menambahkan resep baru, mengubah detail resep, dan menghapus resep (Create, Read, Update, Delete).

## 🛠️ Teknologi yang Digunakan
- **Frontend**: React.js, Tailwind CSS, React Router DOM
- **Backend / Database**: JSON Server (sebagai Mock REST API)

---

## 🚀 Panduan Memulai (Mulai dari Awal hingga Dijalankan)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi ini di komputer lokal Anda:

### 1. Prasyarat (Persiapan)
Pastikan Anda sudah menginstal **Node.js** di komputer Anda. Jika belum, silakan unduh dan instal dari [nodejs.org](https://nodejs.org/).

### 2. Clone Repositori (Unduh Kode)
Buka terminal (Command Prompt, PowerShell, atau Git Bash), lalu jalankan perintah ini untuk menyalin kode ke komputer Anda:
```bash
git clone <masukkan-url-repository-github-disini>
```
*(Catatan: Jika Anda sudah mengunduh file ZIP-nya, cukup ekstrak filenya saja).*

### 3. Masuk ke Folder Proyek
Pindah ke direktori tempat proyek berada:
```bash
cd resep-akhir-main
```
*(Ganti nama folder jika nama folder ekstrak Anda berbeda).*

### 4. Instal Dependensi
Instal semua modul yang dibutuhkan oleh aplikasi ini dengan menjalankan perintah:
```bash
npm install
```
Tunggu hingga proses instalasi selesai (biasanya memakan waktu 1-3 menit).

### 5. Jalankan Aplikasi
Karena aplikasi ini menggunakan `json-server` dan React, Anda bisa menjalankan keduanya secara bersamaan hanya dengan satu perintah:

```bash
npm run dev
```

Aplikasi akan otomatis menyalakan database di *background* dan membuka aplikasi React di browser Anda pada alamat:
`http://localhost:3000`

---
Selamat memasak dan mengeksplorasi resep! 🍽️
