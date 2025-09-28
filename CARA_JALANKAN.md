# Cara Menjalankan Attic Lounges Website

## 📋 Prerequisites (Yang Diperlukan)

### 1. Install Node.js
- Download dan install Node.js dari [nodejs.org](https://nodejs.org/)
- Versi yang direkomendasikan: Node.js 16 atau lebih baru
- Pastikan npm juga terinstall

### 2. Install MongoDB
- Download dan install MongoDB dari [mongodb.com](https://www.mongodb.com/try/download/community)
- Atau gunakan MongoDB Atlas (cloud) untuk kemudahan
- Pastikan MongoDB service berjalan

## 🚀 Langkah-langkah Menjalankan

### 1. Buka Terminal/Command Prompt
- Buka terminal di folder project `atticlounges`

### 2. Install Dependencies untuk Semua Service
Jalankan perintah berikut di terminal:

```bash
# Install dependencies untuk user-service
cd services/user-service
npm install

# Install dependencies untuk product-service  
cd ../product-service
npm install

# Install dependencies untuk order-service
cd ../order-service
npm install

# Kembali ke root folder
cd ../..
```

### 3. Jalankan MongoDB
Pastikan MongoDB sudah berjalan:
- **Windows**: MongoDB biasanya berjalan otomatis sebagai service
- **Mac/Linux**: Jalankan `mongod` di terminal
- **MongoDB Atlas**: Tidak perlu setup lokal

### 4. Jalankan Backend Services
Buka **3 terminal terpisah** dan jalankan:

**Terminal 1 - User Service (Port 4001):**
```bash
cd services/user-service
npm start
```

**Terminal 2 - Product Service (Port 4002):**
```bash
cd services/product-service
npm start
```

**Terminal 3 - Order Service (Port 4003):**
```bash
cd services/order-service
npm start
```

### 5. Buka Website
- Buka browser dan akses: `http://localhost:3000` atau buka file `index.html` langsung
- Website akan berjalan tanpa perlu server frontend

## 🔧 Troubleshooting

### Jika Port Sudah Digunakan:
```bash
# Cek port yang digunakan
netstat -ano | findstr :4001
netstat -ano | findstr :4002
netstat -ano | findstr :4003

# Kill process jika perlu (Windows)
taskkill /PID <PID_NUMBER> /F
```

### Jika MongoDB Error:
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Atau jalankan manual
mongod --dbpath "C:\data\db"
```

### Jika Dependencies Error:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan reinstall
rm -rf node_modules
npm install
```

## 📱 Cara Menggunakan Website

### 1. Akses Website
- Buka `index.html` di browser
- Atau akses `http://localhost:3000` jika menggunakan live server

### 2. Login sebagai Admin
1. Klik tombol **"LOGIN"** di header
2. Pilih tab **"Admin"** di modal login
3. Masukkan kredensial admin:
   - Email: `admin@atticlounges.com`
   - Password: `admin123`
4. Klik "Masuk sebagai Admin"
5. Tombol **"MANAGE PRODUCTS"** akan muncul di header

### 3. Kelola Produk
- Di admin panel, Anda bisa:
  - **Tambah produk** dengan tombol "Tambah Produk"
  - **Edit produk** dengan tombol "Edit"
  - **Hapus produk** dengan tombol "Hapus"
  - **Lihat statistik** di dashboard

### 4. Test sebagai User Biasa
1. Logout dari admin panel
2. Klik "SIGN UP" untuk buat akun user biasa
3. User biasa hanya bisa melihat dan membeli produk

## 🌐 URL yang Tersedia

- **Homepage**: `index.html`
- **Products**: `pages/product.html`
- **Cart**: `pages/cart.html`
- **Admin Panel**: `pages/admin.html` (hanya owner)
- **Owner Login**: `pages/owner-login.html`

## 🔍 Cek Status Services

### Cek Health Endpoints:
- User Service: `http://localhost:4001/health`
- Product Service: `http://localhost:4002/health`
- Order Service: `http://localhost:4003/health`

### Cek API Products:
- `http://localhost:4002/api/products` - Lihat semua produk
- `http://localhost:4001/api/users/me` - Cek user yang login

## ⚡ Quick Start (Script Otomatis)

Buat file `start.bat` (Windows):

**start.bat (Windows):**
```batch
@echo off
echo Starting Attic Lounges Services...

start "User Service" cmd /k "cd services/user-service && npm start"
start "Product Service" cmd /k "cd services/product-service && npm start"  
start "Order Service" cmd /k "cd services/order-service && npm start"

echo All services started! Open index.html in browser.
pause
```


## 🎯 Tips

1. **Gunakan Live Server** untuk development yang lebih mudah
2. **Buka Developer Tools** (F12) untuk cek error di console
3. **Cek Network tab** untuk melihat API calls
4. **Gunakan MongoDB Compass** untuk melihat data di database
5. **Backup database** secara berkala

## 🆘 Jika Masih Error

1. Pastikan semua service berjalan di port yang benar
2. Cek console browser untuk error JavaScript
3. Pastikan MongoDB berjalan dan bisa diakses
4. Restart semua service jika perlu
5. Clear browser cache dan localStorage

---

**Selamat mencoba! 🎉**
