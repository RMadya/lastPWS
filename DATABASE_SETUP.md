# 🗄️ Setup Database BeanByte

## Status Saat Ini:
- ✅ Backend server sudah jalan di http://localhost:5000
- ❌ Database belum dibuat

## Cara Setup Database:

### **Opsi 1: Menggunakan MySQL Workbench (RECOMMENDED)**

1. **Buka MySQL Workbench**

2. **Buat Koneksi Baru:**
   - Host: `localhost`
   - Port: `3309`
   - Username: `root`
   - Password: `Ragehaste90!`

3. **Klik "Test Connection"** untuk memastikan bisa connect

4. **Setelah connect, buka SQL Editor dan jalankan:**

```sql
-- Buat database
CREATE DATABASE beanbyte_db;

-- Gunakan database
USE beanbyte_db;
```

5. **Import file SQL:**
   - Klik menu: **File → Open SQL Script**
   - Pilih file: `c:\lastPWS\backend\migrations\init.sql`
   - Klik tombol **Execute** (icon petir ⚡)

6. **Refresh dan cek:**
   - Klik **Refresh** di panel kiri
   - Anda akan lihat database `beanbyte_db` dengan 5 tabel:
     - users
     - coffees
     - orders
     - api_keys
     - api_usage_logs

---

### **Opsi 2: Menggunakan phpMyAdmin**

1. Buka phpMyAdmin di browser
2. Login dengan username `root` dan password `Ragehaste90!`
3. Klik tab **SQL**
4. Copy-paste isi file `c:\lastPWS\backend\migrations\init.sql`
5. Klik **Go**

---

### **Opsi 3: Command Line (jika MySQL ada di PATH)**

Buka **Command Prompt** (CMD, bukan PowerShell):

```cmd
cd c:\lastPWS\backend\migrations

mysql -u root -p --port=3309 < init.sql
```

Masukkan password: `Ragehaste90!`

---

## ✅ Setelah Database Dibuat:

1. **Restart backend server** (tekan Ctrl+C di terminal backend, lalu jalankan lagi):
   ```bash
   npm run dev
   ```

2. **Cek apakah database terkoneksi:**
   - Buka browser: http://localhost:5000
   - Seharusnya muncul: `✅ Database connected successfully`

3. **Test API:**
   - Buka: http://localhost:5000/api/docs
   - Coba endpoint: `GET /api/coffees`
   - Seharusnya return 10 data kopi

4. **Jalankan Frontend:**
   ```bash
   cd c:\lastPWS\frontend
   npm run dev
   ```

5. **Buka aplikasi:**
   - Frontend: http://localhost:5173
   - Login dengan:
     - Email: `admin@beanbyte.com`
     - Password: `admin123`

---

## 🔍 Troubleshooting:

**Jika error "Database connection failed":**
- Pastikan MySQL service sudah jalan
- Cek port 3309 sudah benar
- Cek password `Ragehaste90!` sudah benar

**Jika error "Table doesn't exist":**
- Pastikan file `init.sql` sudah di-execute
- Cek di MySQL Workbench apakah tabel sudah ada

---

## 📞 Butuh Bantuan?

Kalau ada error, screenshot error message-nya dan saya akan bantu fix!
