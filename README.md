# ADYNET FSM — Field Service Management System

Aplikasi web operasional internal ISP untuk mengelola teknisi lapangan, keluhan, pemasangan, pekerjaan lapangan, absensi, reward, dokumentasi foto, dan laporan WhatsApp.

**Stack:** Next.js 15 · TypeScript · Tailwind · (Shadcn-ready) · Backend Google Apps Script · DB Google Spreadsheet · Storage Google Drive · Deploy Vercel.

> Arsitektur lengkap (ERD, flowchart, sitemap, wireframe, struktur API/GAS/GitHub) ada di **`docs/00-BLUEPRINT.md`**.

---

## Status kelengkapan (jujur)

| Bagian | Status |
|--------|--------|
| Backend Apps Script (`apps-script/Code.gs`) | ✅ **Lengkap** — semua modul, auth, reward otomatis, upload Drive |
| Auth, API client, layout/shell, dashboard | ✅ Lengkap & berjalan |
| Modul **Keluhan** (list + create) | ✅ Lengkap — **pola referensi** |
| Modul Pemasangan, Lapangan, Absensi, Reward, Pencairan, WA Center, Users | 🟡 Backend siap; halaman frontend tinggal menyalin pola Keluhan (helper `wa.ts` untuk WA Center sudah ada) |
| Shadcn UI | 🟡 Komponen pakai Tailwind langsung; jalankan `npx shadcn@latest init` bila ingin set komponen resmi |

Untuk melanjutkan modul mana pun: salin `src/app/(app)/keluhan/page.tsx`, ganti `keluhan.*` → action modul terkait, sesuaikan field. Backend-nya sudah tersedia.

---

## Arsitektur singkat

```
Browser (Next.js / Vercel)
   │  POST JSON { action, token, payload }  (Content-Type: text/plain → no preflight)
   ▼
Google Apps Script Web App  ──►  Google Spreadsheet (11 sheet)
   │                          └►  Google Drive (foto, URL balik ke sheet)
   ▼
Response { ok, data }
```

---

## A. Panduan Instalasi (langkah 15)

### 1. Siapkan backend (Google Apps Script)
1. Buka spreadsheet database, menu **Extensions → Apps Script**.
2. Hapus isi `Code.gs`, **paste seluruh** `apps-script/Code.gs`.
3. Pastikan `CONFIG.SPREADSHEET_ID` & `CONFIG.DRIVE_FOLDER_ID` sudah benar (sudah terisi sesuai link Anda).
4. Jalankan fungsi **`setup()`** sekali (pilih `setup` di dropdown → Run). Beri izin saat diminta. Ini akan:
   - membuat semua sheet + header,
   - membuat `TOKEN_SECRET` acak di Script Properties,
   - membuat user default **`admin` / `admin123`** (role `ADMIN_UTAMA`) — **segera ganti password lewat User Management**.
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Salin **Web App URL** (diakhiri `/exec`).

> Setiap kali mengubah `Code.gs`, buat **deployment baru** atau **Manage deployments → Edit → New version**, agar perubahan aktif.

### 2. Siapkan frontend (lokal)
```bash
git clone <repo-anda> adynet-fsm && cd adynet-fsm
npm install
cp .env.local.example .env.local
# isi NEXT_PUBLIC_GAS_URL dengan Web App URL di atas
npm run dev          # http://localhost:3000
```
Login dengan `admin` / `admin123`.

### 3. Tambah teknisi
User Management → buat user role `TEKNISI` (isi `GajiHarian`). Baris di sheet `TEKNISI` dibuat otomatis. Teknisi lalu bisa absen; reward harian otomatis dibuat saat absen keluar.

---

## B. Panduan Deploy GitHub + Vercel (langkah 16)

### Push ke GitHub
```bash
git init && git add . && git commit -m "feat: initial ADYNET FSM"
git branch -M main
git remote add origin https://github.com/<user>/adynet-fsm.git
git push -u origin main
```
`.env.local` tidak ikut (sudah di `.gitignore`). Jangan commit secret.

### Deploy Vercel
1. vercel.com → **Add New → Project** → import repo `adynet-fsm`.
2. Framework otomatis terdeteksi **Next.js**.
3. **Environment Variables** → tambah `NEXT_PUBLIC_GAS_URL` = Web App URL.
4. **Deploy**. Setiap push ke `main` → auto-deploy.

### CORS / domain
GAS Web App "Anyone" mengizinkan request dari domain Vercel. Karena memakai `Content-Type: text/plain`, tidak ada preflight yang gagal. Jika nanti menambah header kustom, akan muncul preflight — hindari itu.

---

## Keamanan & catatan operasional
- Password di-hash SHA-256 + salt unik per user (bukan plaintext).
- Token sesi ditandatangani HMAC (`TOKEN_SECRET`), berlaku 7 hari.
- Backend selalu mengecek role per-action; jangan andalkan UI saja.
- Foto Drive di-set "anyone with link (view)" agar bisa tampil di web — pastikan ini sesuai kebijakan privasi Anda; untuk lebih ketat, gunakan thumbnail proxy.
- Skala 700–800 pelanggan aman untuk Sheets, tetapi `readSheet` membaca seluruh sheet tiap panggilan. Bila data tahunan membesar, tambahkan arsip per tahun atau pindah ke database sungguhan (Postgres/Supabase) tanpa mengubah kontrak API.

## Struktur project
Lihat `docs/00-BLUEPRINT.md` bagian 9.
