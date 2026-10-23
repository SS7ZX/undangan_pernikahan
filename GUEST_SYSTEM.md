# 📋 Sistem Manajemen Tamu Undangan

Sistem digital untuk mengelola tamu pernikahan dengan link undangan personal untuk setiap tamu.

## ✨ Fitur Utama

### 1. **Admin Dashboard** (`/admin`)
- 🔐 Login admin untuk melindungi data tamu
- 📊 Statistik RSVP dan pembaruan otomatis
- 🔍 Search & filter tamu berdasarkan kategori
- 📋 Tabel lengkap dengan aksi cepat
- 💌 Daftar ucapan beserta status kehadiran
- 📥 Export ke CSV
- 🔗 Copy link undangan
- 💬 Kirim via WhatsApp

### 2. **Guest Invitation Page** (`/guest/[slug]`)
- 🎨 Halaman undangan personal untuk setiap tamu
- ✨ Animasi smooth & premium design
- 📱 Mobile-responsive
- 🔗 Copy & share link
- 💌 Call-to-action untuk RSVP

### 3. **Data Management**
- ☁️ Supabase untuk menyimpan data tamu, RSVP, dan ucapan secara online
- 🏷️ Unique slug per tamu
- 📊 Tracking status RSVP
- 💌 Ucapan disimpan per undangan personal
- 🏷️ Tipe undangan (fisik/digital) dan kategori tamu

## 🚀 Cara Memulai

### Setup
```bash
npm install
```

### Supabase dan login admin

1. Buat project Supabase, lalu jalankan isi `supabase/schema.sql` di **SQL Editor**.
2. Buat file `.env.local` di root project:

   ```env
   SUPABASE_URL=https://PROJECT-REF.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSWORD=choose-a-unique-password-at-least-12-characters
   ADMIN_SESSION_SECRET=generate-a-random-secret-at-least-32-characters
   ```

   Buat secret acak dengan `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   Jangan gunakan prefix `NEXT_PUBLIC_` atau membagikan `SUPABASE_SERVICE_ROLE_KEY`; key ini hanya boleh tersedia di server.
3. Impor daftar awal dari `_generated-guests.json` dengan `npm run import:guests`. Import aman dijalankan ulang dan tidak menimpa tamu yang sudah ada.
4. Untuk hosting seperti Vercel, tambahkan keempat environment variable yang sama di pengaturan project, lalu deploy ulang.
5. Buka `/admin` dan login dengan `ADMIN_PASSWORD`. Dashboard memperbarui data setiap 30 detik; gunakan tombol **Muat ulang** untuk memperbarui langsung.

Bagikan tautan personal `/guest/[slug]` dari admin agar RSVP tercatat atas nama tamu. Ucapan dari link personal terkait ke tamu; ucapan dari halaman utama `/` juga disimpan dan muncul di dashboard sebagai **Undangan Umum**.

Jalankan server lokal dengan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

### Struktur File

```
app/
├── admin/
│   ├── page.tsx          # Admin dashboard
│   └── layout.tsx
├── guest/
│   ├── [slug]/
│   │   └── page.tsx      # Guest invitation page
│   └── layout.tsx
├── page.tsx              # Main invitation component shared by every guest
├── globals.css
└── layout.tsx

lib/
├── types.ts              # TypeScript types
├── guests.ts             # Guest utilities & API
├── supabase-server.ts    # Supabase server-side data access
└── guest-utils.ts        # Template & helper functions

supabase/schema.sql       # Schema database
_generated-guests.json   # Sumber daftar tamu untuk impor awal
```

## 📝 Menggunakan Sistem

### 1. Kelola Daftar Tamu

Daftar awal diimpor dari `_generated-guests.json`. Setelah impor, tambah tamu lewat dashboard agar perubahan tersimpan di Supabase:

```json
[
  {
    "id": 1,
    "name": "Nama Lengkap",
    "slug": "nama-lengkap",           // URL-friendly (auto-generate)
    "relation": "Hubungan",
    "category": "guest",              // guest|family|friend|colleague|neighbor|groom|bride
    "email": "email@example.com",
    "phone": "62895369942679",        // Format: 62XXX...
    "attendance": null,               // yes|no|maybe|null
    "notes": "Catatan tambahan"
  }
]
```

**Kategori tersedia:**
- `groom` - Pengantin pria
- `bride` - Pengantin wanita
- `family` - Keluarga besar
- `friend` - Sahabat
- `colleague` - Teman kerja
- `neighbor` - Tetangga
- `guest` - Tamu undangan umum

### 2. Copy Link Undangan

Di admin dashboard, klik **Copy** untuk copy link undangan:
```
https://your-domain.com/guest/nama-lengkap
```

### 3. Bagikan via WhatsApp

Klik **Share** untuk membuka WhatsApp dan kirim link + pesan personal ke tamu.

### 4. Monitor RSVP

Lihat statistik di dashboard:
- Total tamu
- Sudah RSVP (Hadir/Tidak Hadir)
- Menunggu konfirmasi
- Breakdown per kategori

Dashboard menampilkan setiap ucapan beserta nama pengirim, undangan yang dituju, waktu kirim, dan status RSVP (hadir/tidak hadir/menunggu).

### 5. Export Data

Klik **Export CSV** untuk download daftar tamu.

## 🎨 Kustomisasi

### Edit Data Tamu
Daftar tamu yang digunakan aplikasi disimpan di Supabase. Tambahkan tamu dari dashboard; `_generated-guests.json` digunakan sebagai sumber impor awal. Nomor telepon boleh dikosongkan; tombol WhatsApp akan membuka pemilih kontak.

### Edit Teks Undangan
Edit `app/guest/[slug]/page.tsx` untuk mengubah teks dan data pernikahan:

```typescript
const C = {
  groom: "Rian",
  bride: "Windi",
  date: "Sabtu, 07 November 2026",
  // ... config lainnya
}
```

### Edit Styling
Gunakan Tailwind CSS classes di file component. Edit `app/globals.css` untuk custom CSS global.

## 📱 Deploy ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Add guest management system"
git push origin main
```

### 2. Deploy ke Vercel
```bash
npm install -g vercel
vercel
```

Atau langsung di https://vercel.com/new

### 3. Environment Variables
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` wajib tersedia di environment server lokal maupun hosting.

## 🔐 Keamanan

⚠️ `SUPABASE_SERVICE_ROLE_KEY` memberi akses penuh ke database. Simpan hanya di environment server, jangan pernah mengirimkannya ke browser atau meng-commit-nya.

Dashboard dan API daftar tamu memerlukan login admin. Tautan personal dapat digunakan untuk menyimpan RSVP dan ucapan, jadi bagikan tautan tersebut hanya kepada penerima undangan.

## 📊 Struktur Data Guest

```typescript
interface Guest {
  id: number;              // Unique ID
  name: string;            // Nama lengkap
  slug: string;            // URL slug (auto-generate dari nama)
  relation: string;        // Hubungan dengan mempelai
  category: string;        // Kategori tamu
  email: string;           // Email
  phone: string;           // Nomor telepon (format 62...)
  attendance: string|null; // Status RSVP
  notes: string;           // Catatan tambahan
}
```

## 🎯 Fitur Lanjutan (Roadmap)

- [ ] QR Code generator untuk setiap tamu
- [ ] Email automation untuk send link
- [ ] SMS integration
- [ ] Attendance tracking saat hari-H
- [ ] Seating arrangement
- [ ] Gift registry
- [ ] Photo gallery
- [x] RSVP personal tersimpan berdasarkan slug tamu
- [x] Ucapan tersimpan dan terlihat di dashboard admin

## 🐛 Troubleshooting

### Link tidak berfungsi
- Pastikan tamu sudah diimpor ke Supabase dan slug tautan sesuai dengan data tamu
- Refresh page dan clear cache

### Admin dashboard kosong
- Pastikan schema di `supabase/schema.sql` sudah dijalankan.
- Pastikan environment variables Supabase dan admin sudah diatur.
- Jika daftar tamu belum diimpor, jalankan `npm run import:guests`.
- Check browser console dan terminal untuk error.

### WhatsApp link tidak kebuka
- Pastikan nomor telepon format: `62895369942679`
- Desktop: WhatsApp Web harus sudah terbuka
- Mobile: Install WhatsApp app

## 📞 Support

Untuk masalah lebih lanjut, check:
1. Browser console (F12)
2. Terminal output saat `npm run dev`
3. Network tab untuk error response

## 📄 License

Private project untuk pernikahan Rian & Windi 🎉

---

**Created with ❤️ using Next.js, TypeScript & Tailwind CSS**
