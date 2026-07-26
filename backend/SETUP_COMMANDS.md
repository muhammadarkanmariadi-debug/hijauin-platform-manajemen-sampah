# 🎯 Hijauin Backend - Setup Commands

> Quick reference for setting up the Hijauin backend API

## 📦 Initial Setup

```bash
# Navigate to project directory
cd d:/Project/backend

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret
```

## 🗄️ Database Configuration

Edit `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hijauin
DB_USERNAME=root
DB_PASSWORD=
```

Create database (run in MySQL):

```sql
CREATE DATABASE hijauin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🚀 Run Migrations and Seeders

```bash
# Run all migrations
php artisan migrate

# Seed sample data
php artisan db:seed

# OR do both in one command
php artisan migrate:fresh --seed
```

## 📁 Storage Setup

```bash
# Create storage symlink for file uploads
php artisan storage:link
```

## ▶️ Start Development Server

```bash
php artisan serve
```

API available at: `http://localhost:8000`

## 🧪 Test the API

### Using cURL

```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"budi@example.com\",\"password\":\"password123\"}"

# Test protected endpoint (replace TOKEN with actual JWT token)
curl -X GET http://localhost:8000/api/customer/profile ^
  -H "Authorization: Bearer TOKEN"
```

### Using PowerShell

```powershell
# Test login
$body = @{
    email = "budi@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

# Test protected endpoint
$token = "your-jwt-token-here"
Invoke-RestMethod -Uri "http://localhost:8000/api/customer/profile" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }
```

## 📊 View Routes

```bash
# List all API routes
php artisan route:list --path=api

# List specific route group
php artisan route:list --path=api/customer

# Show route details
php artisan route:list --name=orders.store
```

## 🔧 Useful Commands

### Cache Management

```bash
# Clear all caches
php artisan optimize:clear

# Clear specific caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Database Commands

```bash
# Check database connection
php artisan db:show

# List all tables
php artisan db:table --database=mysql

# Fresh migration (drops all tables)
php artisan migrate:fresh

# Rollback last migration
php artisan migrate:rollback

# Reset database and seed
php artisan migrate:fresh --seed
```

### Testing Commands

```bash
# Open tinker (Laravel REPL)
php artisan tinker

# Test in tinker
>>> $user = User::first();
>>> $user->name

# Test database connection
>>> DB::connection()->getPdo();
```

## 🔐 Default Test Accounts

All accounts use password: `password123`

### Admin
```
Email: admin@hijauin.com
Role: admin
```

### Customers
```
budi@example.com    - Jakarta Selatan (150 points)
siti@example.com    - Jakarta Utara (280 points)
ahmad@example.com   - Jakarta Pusat (95 points)
dewi@example.com    - Jakarta Barat (420 points)
```

### Workers (Petugas)
```
joko@hijauin.com    - Jakarta Selatan
bambang@hijauin.com - Jakarta Utara
suryadi@hijauin.com - Jakarta Pusat
wahyudi@hijauin.com - Jakarta Barat
rudi@hijauin.com    - Jakarta Timur
```

### Partners
```
bersama@partner.com   - Bank Sampah Bersama
recycling@partner.com - Recycling Center Jakarta
```

## 📋 Quick API Test Flow

### 1. Register new customer

```bash
POST http://localhost:8000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567890",
  "role": "customer"
}
```

### 2. Login and get token

```bash
POST http://localhost:8000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# Save the returned token
```

### 3. Get profile

```bash
GET http://localhost:8000/api/customer/profile
Authorization: Bearer <your-token>
```

### 4. Create order

```bash
POST http://localhost:8000/api/customer/orders
Authorization: Bearer <your-token>
{
  "waste_type_id": 1,
  "address_id": 1,
  "estimated_weight": 5.5,
  "notes": "Test order",
  "scheduled_at": "2025-11-06 10:00:00"
}
```

### 5. View orders

```bash
GET http://localhost:8000/api/customer/orders
Authorization: Bearer <your-token>
```

## 🐛 Troubleshooting

### Error: "Please provide a valid cache path"

```bash
# Create cache directories
mkdir storage\framework\cache
mkdir storage\framework\sessions
mkdir storage\framework\views
```

### Error: "Class 'Tymon\JWTAuth\Providers\LaravelServiceProvider' not found"

```bash
# Reinstall JWT package
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"

- Check MySQL is running
- Verify database credentials in `.env`
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

### Error: "Storage link already exists"

```bash
# Remove existing link and recreate
rmdir public\storage
php artisan storage:link
```

### Permission Issues (Windows)

```bash
# Grant full permissions to storage and cache
icacls storage /grant Users:(OI)(CI)F /T
icacls bootstrap/cache /grant Users:(OI)(CI)F /T
```

## 📚 Documentation

- **API Reference**: [QUICK_START.md](QUICK_START.md)
- **Technical Details**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Project Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md)

## 🎉 Success Indicators

✅ Server starts without errors  
✅ Database migrations run successfully  
✅ Seeders populate test data  
✅ Login returns JWT token  
✅ Protected routes work with token  
✅ File uploads work (storage link created)  

## 🚀 Next Steps

1. ✅ Setup complete
2. 📱 Connect frontend application
3. 🧪 Run integration tests
4. 🚀 Deploy to staging environment
5. 🎯 Production deployment

---

**Status**: ✅ MVP Complete  
**Ready for**: Development environment deployment  
**Last Updated**: 2025-11-05
