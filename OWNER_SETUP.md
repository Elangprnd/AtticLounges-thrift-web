# Setup Owner untuk Attic Lounges

## Cara Menggunakan Sistem Owner

### 1. Membuat Akun Owner Pertama
1. Buka website dan klik tombol **"OWNER"** di header
2. Di halaman owner login, isi form "Buat Akun Owner" dengan:
   - Nama lengkap
   - Email
   - Password
3. Klik "Buat Akun Owner"
4. Anda akan otomatis diarahkan ke admin panel

### 2. Login sebagai Owner
1. Klik tombol **"OWNER"** di header
2. Masukkan email dan password owner
3. Klik "Masuk sebagai Owner"
4. Anda akan diarahkan ke admin panel

### 3. Mengelola Produk di Admin Panel
- **Tambah Produk**: Klik tombol "Tambah Produk" dan isi form
- **Edit Produk**: Klik tombol "Edit" pada produk yang ingin diubah
- **Hapus Produk**: Klik tombol "Hapus" pada produk yang ingin dihapus
- **Refresh**: Klik tombol "Refresh" untuk memuat ulang data

### 4. Fitur yang Tersedia untuk Owner
- ✅ Menambah produk baru
- ✅ Mengedit produk yang sudah ada
- ✅ Menghapus produk
- ✅ Melihat statistik toko
- ✅ Mengelola semua aspek produk (nama, harga, kategori, dll)

### 5. Fitur yang Tersedia untuk User Biasa
- ✅ Melihat produk
- ✅ Membeli produk (add to cart)
- ✅ Mencari produk
- ❌ **TIDAK BISA** menambah produk
- ❌ **TIDAK BISA** mengedit produk
- ❌ **TIDAK BISA** menghapus produk

## Keamanan
- Hanya 1 akun owner yang bisa dibuat
- User biasa tidak bisa mengakses admin panel
- Semua operasi CRUD produk memerlukan autentikasi owner
- Token JWT digunakan untuk autentikasi

## API Endpoints yang Diproteksi
- `POST /api/products` - Hanya owner
- `PUT /api/products/:id` - Hanya owner  
- `DELETE /api/products/:id` - Hanya owner
- `GET /api/products` - Bisa diakses semua user
- `GET /api/products/:id` - Bisa diakses semua user

## File yang Dibuat/Dimodifikasi
- `pages/admin.html` - Halaman admin panel
- `pages/owner-login.html` - Halaman login owner
- `src/js/admin.js` - Logika admin panel
- `src/js/owner-login.js` - Logika login owner
- `services/user-service/src/index.js` - Ditambah role-based auth
- `services/product-service/src/index.js` - Ditambah proteksi CRUD
- `index.html` - Ditambah tombol OWNER
- `src/js/app.js` - Ditambah fungsi cek owner
