# 🗄️ Setup Database KopiSusu

## Cara Setup (Pilih Salah Satu):

### **Opsi 1: MySQL Workbench (Recommended)**

1. **Buka MySQL Workbench**
2. **Buat koneksi:**
   - Host: `localhost`
   - Port: `3309`
   - Username: `root`
   - Password: `Ragehaste90!`
3. **Test Connection** → OK
4. **Double-click koneksi**
5. **Di SQL Editor, jalankan:**
   ```sql
   CREATE DATABASE kopisusu;
   USE kopisusu;
   ```
6. **Import file:**
   - Menu: **File → Open SQL Script**
   - Pilih: `c:\lastPWS\backend\migrations\init.sql`
   - Klik **Execute (⚡)**
7. **Refresh** → Lihat database `kopisusu` dengan 5 tabel ✅

---

### **Opsi 2: phpMyAdmin**

1. Buka phpMyAdmin
2. Login (root / Ragehaste90!)
3. Tab **SQL**
4. Copy isi file `c:\lastPWS\backend\migrations\init.sql`
5. Paste → **Go**

---

### **Opsi 3: Command Line**

```bash
mysql -u root -p --port=3309

# Masukkan password: Ragehaste90!
# Lalu jalankan:

CREATE DATABASE kopisusu;
USE kopisusu;
SOURCE c:/lastPWS/backend/migrations/init.sql;
EXIT;
```

---

## ✅ Setelah Database Dibuat:

1. **Restart backend** (Ctrl+C di terminal, lalu `npm run dev`)
2. **Lihat di terminal:** `✅ Database connected successfully`
3. **Jalankan frontend:**
   ```bash
   cd c:\lastPWS\frontend
   npm run dev
   ```
4. **Buka browser:** http://localhost:5173
5. **Login:** `admin@beanbyte.com` / `admin123`

---

## 📊 Database akan berisi:

- ✅ 10 menu kopi
- ✅ 2 user (admin & test user)
- ✅ 3 sample orders
- ✅ 5 tabel (users, coffees, orders, api_keys, api_usage_logs)
