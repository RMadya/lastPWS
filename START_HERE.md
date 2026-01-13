# ✅ BACKEND SUDAH JALAN!

## Status:
✅ **Backend Server:** RUNNING di http://localhost:5000
❌ **Database:** Belum dibuat (perlu setup manual)

---

## 🎯 LANGKAH TERAKHIR (Hanya 2 Langkah!):

### 1. Buat Database (5 menit)

**Buka MySQL Workbench atau phpMyAdmin**, lalu jalankan:

```sql
CREATE DATABASE beanbyte_db;
USE beanbyte_db;
```

**Lalu import file SQL:**
- File location: `c:\lastPWS\backend\migrations\init.sql`
- Di MySQL Workbench: File → Open SQL Script → Execute
- Di phpMyAdmin: Copy-paste isi file → Go

---

### 2. Jalankan Frontend

**Buka terminal BARU** (jangan tutup terminal backend!), lalu:

```bash
cd c:\lastPWS\frontend
npm run dev
```

---

## 🚀 Akses Aplikasi:

**Frontend:** http://localhost:5173

**Login:**
- Email: `admin@beanbyte.com`
- Password: `admin123`

**API Docs:** http://localhost:5000/api/docs

---

## ⚠️ PENTING:

**JANGAN tutup terminal backend!** Biarkan tetap jalan.

**Jika muncul error "port already in use" lagi:**
1. Tutup SEMUA terminal
2. Jalankan: `taskkill /F /IM node.exe`
3. Buka terminal baru, jalankan `npm run dev` di folder backend
4. Buka terminal baru lagi, jalankan `npm run dev` di folder frontend

---

## 📞 Butuh Bantuan?

Jika ada error, screenshot dan tanyakan ke saya!
