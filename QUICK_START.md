# Hijauin - Quick Start Guide

Panduan cepat untuk menjalankan aplikasi Hijauin (Frontend + Backend).

## 📋 Prerequisites

- **PHP**: 8.2+
- **Composer**: 2.x
- **Node.js**: 18+
- **npm** or **yarn**
- **MySQL** or **SQLite**
- **Git**

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup

```powershell
# Navigate to backend
cd d:\Project\pkkwu\backend

# Install PHP dependencies
composer install

# Create environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure database in .env
# For SQLite (easiest):
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Create SQLite database file
New-Item -Path database -Name database.sqlite -ItemType File

# Run migrations
php artisan migrate

# (Optional) Seed sample data
php artisan db:seed

# Start backend server
php artisan serve
```

Backend now running at: `http://localhost:8000` ✅

### 2. Frontend Setup

```powershell
# Open new terminal
# Navigate to frontend
cd d:\Project\pkkwu\frontend

# Install Node dependencies
npm install

# Create environment file
copy .env.example .env.local

# The default .env.local should work:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start frontend server
npm run dev
```

Frontend now running at: `http://localhost:3000` ✅

## 🧪 Test the Application

### 1. Access Landing Page
Open browser: `http://localhost:3000`

You should see:
- Hero section with "Selamat datang di Hijauin"
- Statistics cards (12.800 Ton Sampah, 20.000 Pengguna, etc.)

### 2. Register New User

1. Go to: `http://localhost:3000/auth/register`
2. Fill form:
   - Name: `John Customer`
   - Email: `john@customer.com`
   - Phone: `081234567890`
   - Role: `Pelanggan`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **Daftar**
4. You'll be redirected to Customer Dashboard

### 3. Test Customer Features

After login, you can:
- View dashboard at `/dashboard/customer`
- Create order at `/dashboard/customer/orders/create`
  - Note: You need to create an address first
- View orders list
- Manage addresses

### 4. Register Petugas (Staff)

1. Logout or open incognito window
2. Go to register page
3. Fill form:
   - Name: `Budi Petugas`
   - Email: `budi@petugas.com`
   - Phone: `081234567891`
   - Role: **Petugas (fastCOPICK)**
   - Zone: `Jakarta Selatan`
   - Password: `password123`
4. Login redirects to `/dashboard/petugas`

### 5. Create Admin User (Via Database)

For admin access, you need to create admin user manually:

**Option A: Using Tinker**
```bash
php artisan tinker
```

```php
$admin = new App\Models\User();
$admin->name = 'Admin Hijauin';
$admin->email = 'admin@hijauin.com';
$admin->password = bcrypt('password123');
$admin->role = 'admin';
$admin->phone = '081234567892';
$admin->status = 'active';
$admin->save();
```

**Option B: Using Seeder**
Create `database/seeders/AdminSeeder.php`:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin Hijauin',
            'email' => 'admin@hijauin.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '081234567892',
            'status' => 'active',
        ]);
    }
}
```

Then run:
```bash
php artisan db:seed --class=AdminSeeder
```

Login as admin:
- Email: `admin@hijauin.com`
- Password: `password123`

## 📱 Test API Endpoints

### Using Postman/Insomnia

**1. Register**
```
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer",
  "phone": "081234567890"
}
```

**2. Login**
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response will include `token`. Copy it!

**3. Get Profile**
```
GET http://localhost:8000/api/auth/me
Authorization: Bearer {your_token_here}
```

**4. Create Address**
```
POST http://localhost:8000/api/customer/addresses
Authorization: Bearer {your_token_here}
Content-Type: application/json

{
  "label": "Rumah",
  "full_address": "Jl. Sudirman No. 123",
  "kelurahan": "Kebayoran Baru",
  "kecamatan": "Kebayoran Baru",
  "city": "Jakarta Selatan",
  "province": "DKI Jakarta",
  "postal_code": "12180",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "is_default": true
}
```

**5. Create Order**
```
POST http://localhost:8000/api/customer/orders
Authorization: Bearer {your_token_here}
Content-Type: application/json

{
  "address_id": 1,
  "waste_type_id": 1,
  "estimated_weight_kg": 5.5,
  "estimated_volume": 2,
  "scheduled_time": "2025-11-17 09:00:00",
  "payment_method": "cod",
  "customer_notes": "Sampah di depan pagar"
}
```

## 🐛 Troubleshooting

### Backend Issues

**"Class 'Tymon\JWTAuth\...' not found"**
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

**Database connection error**
```bash
# Check .env file
# For SQLite, make sure file exists:
New-Item -Path database -Name database.sqlite -ItemType File

# Run migrations again
php artisan migrate:fresh
```

**CORS errors**
Make sure `config/cors.php` has:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

### Frontend Issues

**API connection failed**
- Check backend is running: `http://localhost:8000`
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

**"Cannot find module" errors**
```bash
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Port 3000 already in use**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

## 📊 Sample Data

### Test Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Customer | john@customer.com | password123 | `/dashboard/customer` |
| Petugas | budi@petugas.com | password123 | `/dashboard/petugas` |
| Admin | admin@hijauin.com | password123 | `/dashboard/admin` |

### Waste Types

Create sample waste types:

```sql
INSERT INTO waste_types (name, description, points_per_kg, price_per_kg) VALUES
('Sampah Organik', 'Sisa makanan, daun, dll', 10, 1000),
('Sampah Anorganik', 'Plastik, kertas, kaleng', 15, 2000),
('E-Waste', 'Barang elektronik bekas', 50, 10000),
('Sampah Besar', 'Furniture, kasur, dll', 20, 5000);
```

## 🎯 Next Steps

After setup:

1. ✅ Test authentication flow
2. ✅ Create sample addresses
3. ✅ Create sample orders
4. 🔄 Build remaining customer features
5. 🔄 Build petugas dashboard
6. 🔄 Build admin panel
7. 🔄 Add public pages

## 📚 Documentation

- **API Docs**: `backend/HIJAUIN_API_DOCS.md`
- **Frontend Pages**: `frontend/PAGES_STRUCTURE.md`
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

## 💡 Tips

1. Use browser DevTools to debug API calls
2. Check Laravel logs: `backend/storage/logs/laravel.log`
3. Use `php artisan tinker` for quick database queries
4. Clear Laravel cache: `php artisan cache:clear`
5. Clear Next.js cache: `Remove-Item -Recurse .next`

## 🆘 Need Help?

- Check documentation files
- Review API endpoints in `backend/HIJAUIN_API_DOCS.md`
- Look at existing code in `frontend/app/dashboard/customer/`
- Check browser console for frontend errors
- Check `backend/storage/logs/laravel.log` for backend errors

---

**Happy Coding! 🌱**

If everything works, you should see:
- ✅ Backend API responding
- ✅ Frontend loading
- ✅ User can register/login
- ✅ Customer dashboard accessible
- ✅ Orders can be created

**Status**: Ready for Development 🚀
