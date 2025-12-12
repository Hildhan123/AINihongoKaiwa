# AI Nihongo Kaiwa - Aplikasi Latihan Berbicara Bahasa Jepang

Aplikasi web untuk berlatih percakapan bahasa Jepang menggunakan AI dan Web Speech API. Aplikasi ini memungkinkan pengguna berbicara dalam bahasa Indonesia dan mendapatkan respons dalam bahasa Jepang.

## Fitur

- 🎤 **Speech-to-Text**: Mengubah suara pengguna menjadi teks
- 🤖 **AI Chatbot**: Berdialog dengan AI dalam bahasa Jepang
- 🔊 **Text-to-Speech**: Mendengarkan respons AI dalam suara bahasa Jepang
- 📱 **Responsif**: Bisa digunakan di berbagai perangkat
- 💸 **Gratis**: Semua komponen menggunakan teknologi gratis

## Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript dengan type checking
- **Express** - Framework web minimalis
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Struktur halaman
- **CSS3** - Styling dan animasi
- **JavaScript (ES6+)** - Logika aplikasi
- **Web Speech API** - Speech-to-Text dan Text-to-Speech

## Instalasi

1. **Clone repository ini**
   ```bash
   git clone <repository-url>
   cd AI-nihongo-kaiwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi**
   ```bash
   # Mode development
   npm run dev

   # Atau build dulu lalu jalankan
   npm run build
   npm start
   ```

4. **Buka browser**
   Buka http://localhost:3000 di browser Anda

## Struktur Proyek

```
AI-nihongo-kaiwa/
├── src/                 # Source code TypeScript
│   └── index.ts        # Server utama
├── public/             # File statis frontend
│   └── index.html      # Halaman utama
├── node_modules/       # Dependencies
├── package.json        # Konfigurasi proyek
├── tsconfig.json       # Konfigurasi TypeScript
├── nodemon.json        # Konfigurasi Nodemon
└── README.md          # Dokumentasi
```

## Cara Penggunaan

1. **Buka aplikasi** di browser modern (Chrome/Edge disarankan)
2. **Klik tombol rekam** untuk mulai berbicara
3. **Berbicara dalam bahasa Indonesia** tentang topik apa saja
4. **Dengarkan respons AI** dalam bahasa Jepang
5. **Lanjutkan percakapan** sesuai keinginan

## Browser yang Didukung

- ✅ **Google Chrome** (Direkomendasikan)
- ✅ **Microsoft Edge**
- ⚠️ **Firefox** (Sebagian fitur)
- ❌ **Safari** (Tidak mendukung Web Speech API)

## Catatan Penting

- Aplikasi ini menggunakan Web Speech API yang **gratis dan offline**
- Untuk pengalaman terbaik, gunakan browser Chrome atau Edge
- Microphone dan speaker diperlukan untuk fitur suara
- Aplikasi ini masih dalam pengembangan

## Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detailnya.

## Kontak

Untuk pertanyaan atau saran, silakan hubungi:
- Email: [your-email@example.com]
- GitHub: [@username](https://github.com/username)

---

**Selamat belajar bahasa Jepang!** 🎌