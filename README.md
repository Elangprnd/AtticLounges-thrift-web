# Attic Lounges - Thrift Store Website

Website thrift store dengan sistem **owner-only product management**. Hanya owner yang bisa menambah, mengedit, dan menghapus produk, sementara user biasa hanya bisa melihat dan membeli.

## 🚀 Quick Start

### Cara Termudah (Windows):
1. **Double-click** file `start.bat`
2. **Tunggu** semua service berjalan
3. **Website otomatis terbuka** di browser
4. **Klik "OWNER"** untuk buat akun owner pertama

### Cara Manual:
```bash
# 1. Install dependencies
npm run install-all

# 2. Start service di terminal terpisah:
# Terminal 1: npm run start:user
# Terminal 2: npm run start:product  
# Terminal 3: npm run start:order

# 3. Buka index.html di browser
```

## 🚀 Fitur

- **Frontend**: HTML, CSS, JavaScript vanilla
- **Backend**: 3 microservices (User, Product, Order)
- **Database**: MongoDB
- **Authentication**: JWT
- **Responsive Design**: Mobile-friendly

### Halaman
- **Homepage**: Menampilkan produk terbaru, kategori, dan pencarian
- **Product**: Daftar semua produk dengan filter dan sorting
- **Detail**: Detail produk dengan review dan add to cart
- **Cart**: Keranjang belanja
- **Checkout**: Proses pembayaran
- **Orders**: Riwayat pesanan
- **Profile**: Profil pengguna
- **Chat**: Chatbot customer service
- **Admin Panel**: Kelola produk (owner only)
- **Owner Login**: Login khusus owner

## 👑 Owner System

### Login sebagai Admin:
1. Klik tombol **"LOGIN"** di header
2. Pilih tab **"Admin"**
3. Masukkan kredensial admin:
   - Email: `admin@atticlounges.com`
   - Password: `admin123`
4. Setelah login, tombol **"MANAGE PRODUCTS"** akan muncul

### Fitur Owner:
- ✅ **Tambah produk** baru
- ✅ **Edit produk** yang sudah ada  
- ✅ **Hapus produk**
- ✅ **Lihat statistik** toko
- ✅ **Kelola semua aspek** produk

### Fitur User Biasa:
- ✅ **Lihat produk**
- ✅ **Beli produk** (add to cart)
- ✅ **Cari produk**
- ❌ **TIDAK BISA** menambah produk
- ❌ **TIDAK BISA** mengedit produk
- ❌ **TIDAK BISA** menghapus produk

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local atau cloud)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd atticlounges
```

### 2. Install Dependencies
```bash
# Install dependencies untuk semua service
cd services/user-service && npm install
cd ../product-service && npm install  
cd ../order-service && npm install
```

### 3. Setup Database
Pastikan MongoDB berjalan di `localhost:27017` atau update connection string di setiap service.

### 4. Start Services

**Terminal 1 - User Service (Port 4001)**
```bash
cd services/user-service
npm run dev
```

**Terminal 2 - Product Service (Port 4002)**
```bash
cd services/product-service
npm run dev
```

**Terminal 3 - Order Service (Port 4003)**
```bash
cd services/order-service
npm run dev
```

### 5. Start Frontend
Buka `index.html` di browser atau gunakan Live Server extension di VS Code.

## 📁 Struktur Project

```
atticlounges/
├── index.html                 # Homepage
├── pages/                     # Halaman lainnya
│   ├── product.html
│   ├── detail.html
│   ├── cart.html
│   ├── payment.html
│   ├── orders.html
│   ├── profile.html
│   └── chat.html
├── src/
│   ├── css/                   # Styles
│   │   ├── style.css
│   │   └── output.css
│   ├── js/                    # JavaScript files
│   │   ├── app.js            # Core app logic
│   │   ├── product.js        # Product page logic
│   │   ├── detail.js         # Product detail logic
│   │   ├── cart.js           # Cart functionality
│   │   ├── checkout.js       # Checkout process
│   │   ├── orders.js         # Orders page
│   │   ├── profile.js        # Profile page
│   │   └── review.js         # Review system
│   └── img/                   # Images
└── services/                  # Backend microservices
    ├── user-service/          # Authentication & user management
    ├── product-service/       # Product CRUD
    └── order-service/         # Orders & cart management
```

## 🔧 API Endpoints

### User Service (Port 4001)
- `POST /api/auth/register` - Register user biasa
- `POST /api/auth/login` - Login user
- `POST /api/auth/create-owner` - **Buat owner pertama**
- `GET /api/users/me` - Get current user profile

### Product Service (Port 4002)
- `GET /api/products` - Get all products (semua user)
- `GET /api/products/:id` - Get product by ID (semua user)
- `POST /api/products` - **Create product (owner only)**
- `PUT /api/products/:id` - **Update product (owner only)**
- `DELETE /api/products/:id` - **Delete product (owner only)**

### Order Service (Port 4003)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

## 🎯 Cara Penggunaan

1. **Buka Website**: Buka `index.html` di browser
2. **Login/Register**: Klik tombol LOGIN atau SIGN UP
3. **Browse Products**: Lihat produk di homepage atau halaman Product
4. **Add to Cart**: Klik tombol "Add to Cart" pada produk
5. **Checkout**: Pergi ke Cart → Checkout untuk menyelesaikan pembelian
6. **View Orders**: Lihat riwayat pesanan di halaman Orders
7. **Profile**: Kelola profil di halaman Profile

## 🔍 Troubleshooting

### Produk Kosong di Homepage
- Pastikan Product Service berjalan di port 4002
- Check console browser untuk error
- Pastikan MongoDB terhubung

### Login Tidak Berfungsi
- Pastikan User Service berjalan di port 4001
- Check network tab di browser developer tools

### Order Tidak Tersimpan
- Pastikan Order Service berjalan di port 4003
- Data akan tersimpan di localStorage sebagai backup

## 🔒 Keamanan

- **Hanya 1 akun owner** yang bisa dibuat
- **User biasa tidak bisa** mengakses admin panel
- **Semua operasi CRUD** produk memerlukan autentikasi owner
- **Token JWT** digunakan untuk keamanan
- **Role-based access control** di semua endpoint

## 📚 Dokumentasi Lengkap

- `CARA_JALANKAN.md` - Panduan lengkap menjalankan aplikasi
- `OWNER_SETUP.md` - Panduan setup sistem owner

## 📝 Notes

- Website menggunakan fallback ke localStorage jika backend tidak tersedia
- Semua service menggunakan CORS untuk cross-origin requests
- JWT token disimpan di localStorage untuk authentication
- Data produk di-seed otomatis saat Product Service pertama kali dijalankan

## 🚀 Development

Untuk development, pastikan semua service berjalan dan MongoDB terhubung. Website akan berfungsi penuh dengan semua fitur backend.

Untuk production, deploy semua service ke server dan update API URLs di frontend.
