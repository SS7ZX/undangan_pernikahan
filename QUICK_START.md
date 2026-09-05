/**
 * Quick Start Guide
 */

# 🎉 QUICK START GUIDE — Guest Invitation System

## 5 Menit Setup

### Step 1: Run Development Server
```bash
npm run dev
```
Buka http://localhost:3000

### Step 2: Access Admin Panel
Klik tombol **Admin** di navbar, atau buka langsung:
```
http://localhost:3000/admin
```

### Step 3: View Guest List
Daftar tamu berada di `_generated-guests.json`. Lihat semuanya di admin dashboard.

### Step 4: Copy & Share Links
1. Di admin panel, klik **Copy** untuk copy link tamu
2. Atau klik **Share** untuk send via WhatsApp
3. Format link: `http://localhost:3000/guest/rian-pebriansyah`

### Step 5: Edit Guest Data
Edit `public/guests.json` untuk tambah/ubah tamu:
```json
{
  "id": 7,
  "name": "Nama Tamu Baru",
  "slug": "nama-tamu-baru",
  "relation": "Sahabat",
  "category": "friend",
  "email": "email@example.com",
  "phone": "62895369942679",
  "attendance": null,
  "notes": ""
}
```

## 🗂️ Struktur Folder

```
📦 undangan-online
├── 📁 app/
│   ├── admin/          ← Admin dashboard
│   ├── guest/          ← Guest invitation pages
│   ├── page.tsx        ← Undangan utama untuk semua tamu
│   └── api/            ← API routes
├── 📁 lib/
│   ├── types.ts        ← TypeScript types
│   ├── guests.ts       ← Guest functions
│   └── guest-utils.ts  ← Template helpers
├── 📁 public/
│   └── guests.json     ← 👈 EDIT THIS untuk tambah tamu
└── 📄 GUEST_SYSTEM.md  ← Full documentation
```

## 🔗 Routes

| Route | Deskripsi |
|-------|----------|
| `/` | Undangan utama |
| `/admin` | Admin dashboard (manage tamu + link) |
| `/guest/[slug]` | Individual invitation page |
| `/api/guests` | Get all guests (JSON) |
| `/api/guests/[slug]` | Get guest / save RSVP personal (JSON) |

## 📝 Editing Guest Data

### Format `_generated-guests.json`:
```json
[
  {
    "id": 1,
    "name": "Nama Lengkap",
    "slug": "nama-lengkap",              // Must be unique & lowercase
    "relation": "Hubungan",
    "category": "family",                 // family|friend|colleague|neighbor|groom|bride
    "email": "email@example.com",
    "phone": "62895369942679",           // Must start with 62
    "attendance": null,                   // yes|no|maybe|null
    "notes": "Optional catatan"
  }
]
```

### Categories:
- **groom** - Pengantin pria
- **bride** - Pengantin wanita  
- **family** - Keluarga
- **friend** - Sahabat
- **colleague** - Teman kerja
- **neighbor** - Tetangga

## 🚀 Admin Panel Features

### Dashboard Stats
- 📊 Total tamu
- ✅ Sudah RSVP
- ⏳ Menunggu
- ❌ Menolak
- 📈 Persentase kehadiran

### Actions per Tamu
- 🔗 **Copy Link** - Copy invitation link
- 💬 **Share** - Send via WhatsApp

### Bulk Actions
- 🔍 **Search** - Filter by name/relation
- 🏷️ **Filter** - Filter by category
- 📥 **Export CSV** - Download guest list

## 💡 Tips

### Adding Multiple Guests
Fastest way:
1. Open `public/guests.json` di editor
2. Paste new guest objects ke array
3. Save file
4. Refresh admin panel (F5)

Format template:
```json
{
  "id": 7,
  "name": "New Guest",
  "slug": "new-guest",
  "relation": "Friend",
  "category": "friend",
  "email": "new@example.com",
  "phone": "62895369942679",
  "attendance": null,
  "notes": ""
}
```

### Generating Slug
Slug harus:
- ✅ Lowercase
- ✅ No spaces (gunakan dash)
- ✅ Unique (tidak boleh sama)
- ✅ URL-friendly

Contoh:
- "Rian Pebriansyah" → `rian-pebriansyah`
- "Siti Nur Haliza" → `siti-nur-haliza`

### WhatsApp Integration
Link WhatsApp format:
```
https://wa.me/[PHONE]?text=[MESSAGE]
```

Nomor telepon harus format: `62895369942679` (no +, no 0)

### Customizing Invitation Text
Edit `app/guest/[slug]/page.tsx` baris ~50:
```typescript
const C = {
  groom:     "Rian",
  bride:     "Windi",
  date:      "Sabtu, 07 November 2026",
  // ...
}
```

## 🔐 Before Deploy

1. ✅ Update guest list di `public/guests.json`
2. ✅ Customize invitation text (groom/bride names, date, location)
3. ✅ Add real wedding details (maps URL, venues)
4. ✅ Test all links di /admin
5. ✅ Export CSV untuk backup

## 🚀 Deploy to Vercel

```bash
git add .
git commit -m "Add guest management system"
git push
```

Then at https://vercel.com:
1. Import your GitHub repo
2. Click Deploy
3. Done! ✨

Your live URL: `https://your-project.vercel.app`

## 📞 API Usage (for developers)

### Get All Guests
```javascript
fetch('/api/guests')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

### Get Single Guest
```javascript
fetch('/api/guests/rian-pebriansyah')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rian Pebriansyah",
    "slug": "rian-pebriansyah",
    ...
  }
}
```

---

**Siap memulai? Buka `/admin` sekarang! 🎉**
