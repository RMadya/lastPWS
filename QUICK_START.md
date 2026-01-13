# ✅ BeanByte - Quick Start Guide

## Status Saat Ini:
✅ **Backend server sudah jalan** di http://localhost:5000
❌ **Database belum dibuat** (perlu setup manual)

---

## 🚀 Langkah Selanjutnya:

### 1️⃣ Setup Database (WAJIB)

**Buka MySQL Workbench atau phpMyAdmin:**

```sql
-- Jalankan query ini:
CREATE DATABASE beanbyte_db;
USE beanbyte_db;

-- Lalu import file: c:\lastPWS\backend\migrations\init.sql
-- Atau copy-paste isi file tersebut dan execute
```

**Setelah database dibuat, restart backend:**
- Tekan `Ctrl+C` di terminal backend
- Jalankan lagi: `npm run dev`

---

### 2️⃣ Jalankan Frontend

Buka terminal baru:

```bash
cd c:\lastPWS\frontend
npm run dev
```

Frontend akan jalan di: **http://localhost:5173**

---

### 3️⃣ Login & Test

**Buka browser:** http://localhost:5173

**Login dengan:**
- Email: `admin@beanbyte.com`
- Password: `admin123`

**Atau buat akun baru** di halaman Register

---

## 📚 Dokumentasi API

- **Swagger Docs:** http://localhost:5000/api/docs
- **API Docs (Frontend):** http://localhost:5173/api-docs

---

## 🔑 Fitur Utama:

1. **Browse Kopi** - Lihat katalog kopi dengan filter kategori
2. **Order Kopi** - Pesan kopi dengan pilihan ukuran
3. **Riwayat Order** - Lihat history pesanan
4. **API Keys** - Generate API key untuk integrasi
5. **Admin Dashboard** - Kelola kopi, order, dan user (khusus admin)

---

## ❓ Troubleshooting:

**Error "Database connection failed":**
- Pastikan database `beanbyte_db` sudah dibuat
- Cek MySQL service sudah jalan di port 3309

**Error "Port 5000 already in use":**
- Jalankan: `taskkill /F /IM node.exe`
- Lalu start ulang: `npm run dev`

**Frontend tidak bisa connect ke backend:**
- Pastikan backend sudah jalan di port 5000
- Cek di browser: http://localhost:5000

---

## 📞 Need Help?

Lihat file lengkap:
- `DATABASE_SETUP.md` - Panduan setup database detail
- `README.md` - Dokumentasi lengkap proyek
- `walkthrough.md` - Penjelasan arsitektur sistem
