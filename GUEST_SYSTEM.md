# 📋 Sistem Manajemen Tamu Undangan

Sistem digital untuk mengelola tamu pernikahan dengan link undangan personal untuk setiap tamu.

## ✨ Fitur Utama

### 1. **Admin Dashboard** (`/admin`)
- 📊 Statistik real-time (total tamu, RSVP, dll)
- 🔍 Search & filter tamu berdasarkan kategori
- 📋 Tabel lengkap dengan aksi cepat
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
- 📁 Imported workbook storage (`_generated-guests.json`) via `/api/guests`
- 🏷️ Unique slug per tamu
- 📊 Tracking status RSVP
- 🏷️ Tipe undangan (fisik/digital) dan kategori tamu

## 🚀 Cara Memulai

### Setup
```bash
npm install
npm run dev
```

Buka browser ke `http://localhost:3000`

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
├── home/
│   └── page.tsx          # Home page (informasi)
├── globals.css
└── layout.tsx

lib/
├── types.ts              # TypeScript types
├── guests.ts             # Guest utilities & API
└── guest-utils.ts        # Template & helper functions

_generated-guests.json    # Database hasil import workbook
public/
└── guests.json           # Data fallback/template lama

```

## 📝 Menggunakan Sistem

### 1. Kelola Daftar Tamu

Edit `_generated-guests.json` untuk menambah/mengubah tamu:

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

### 5. Export Data

Klik **Export CSV** untuk download daftar tamu.

## 🎨 Kustomisasi

### Edit Data Tamu
Edit `_generated-guests.json` langsung di text editor atau IDE. Nomor telepon boleh dikosongkan; tombol WhatsApp akan membuka pemilih kontak.

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
Tidak perlu environment variables untuk setup dasar.

## 🔐 Keamanan

⚠️ **Important**: Sistem ini menggunakan static JSON untuk Vercel.
- Data tamu tidak terenkripsi
- Untuk production dengan data sensitif, gunakan database + authentication
- Pertimbangkan menggunakan Firebase atau Supabase untuk keamanan lebih baik

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
- [ ] Guest counter di tamu list

## 🐛 Troubleshooting

### Link tidak berfungsi
- Pastikan `slug` di JSON sudah benar (lowercase, no spaces)
- Refresh page dan clear cache

### Admin dashboard kosong
- Pastikan `public/guests.json` sudah ada dan valid JSON
- Check browser console untuk error

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
