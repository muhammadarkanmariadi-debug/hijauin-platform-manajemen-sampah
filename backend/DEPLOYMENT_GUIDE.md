# 🚀 Hijauin Backend - Deployment Guide

## Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL 8.0 or PostgreSQL
- Node.js & npm (for frontend)

## 📦 Installation Steps

### 1. Clone & Install Dependencies

```bash
cd d:/Project/backend
composer install
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Update the following environment variables:

```env
APP_NAME=Hijauin
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hijauin
DB_USERNAME=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=
JWT_TTL=60
JWT_REFRESH_TTL=20160
JWT_ALGO=HS256

# File Storage
FILESYSTEM_DISK=public
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Generate JWT Secret

```bash
php artisan jwt:secret
```

This will automatically add `JWT_SECRET` to your `.env` file.

### 5. Database Setup

Create the database:

```sql
CREATE DATABASE hijauin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations:

```bash
php artisan migrate
```

### 6. Seed Sample Data

```bash
php artisan db:seed
```

This will create:
- 1 Admin user
- 4 Customer users
- 5 Petugas (worker) users
- 2 Partner users
- 4 Waste types (Organik, Anorganik, E-Waste, Sampah Besar)
- 6 Sample addresses

### 7. Create Storage Symlink

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public` for file uploads.

### 8. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## 🔐 Default User Credentials

All users have password: `password123`

### Admin
- Email: `admin@hijauin.com`
- Role: admin

### Customers
- `budi@example.com` - Jakarta Selatan (150 points)
- `siti@example.com` - Jakarta Utara (280 points)
- `ahmad@example.com` - Jakarta Pusat (95 points)
- `dewi@example.com` - Jakarta Barat (420 points)

### Petugas (Workers)
- `joko@hijauin.com` - Jakarta Selatan
- `bambang@hijauin.com` - Jakarta Utara
- `suryadi@hijauin.com` - Jakarta Pusat
- `wahyudi@hijauin.com` - Jakarta Barat
- `rudi@hijauin.com` - Jakarta Timur

### Partners
- `bersama@partner.com` - Bank Sampah Bersama
- `recycling@partner.com` - Recycling Center Jakarta

## 🧪 Testing API

### 1. Register New User

```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567890",
  "role": "customer"
}
```

### 2. Login

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "budi@example.com",
  "password": "password123"
}
```

Response will include JWT token:

```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 3. Access Protected Routes

Use the token in Authorization header:

```bash
GET http://localhost:8000/api/customer/profile
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## 📁 Folder Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php         # Authentication
│   │       ├── OrderController.php        # Order management
│   │       ├── AddressController.php      # Address CRUD
│   │       ├── SubscriptionController.php # Subscription management
│   │       ├── ReportController.php       # Waste pile reports
│   │       ├── ReviewController.php       # Service reviews
│   │       ├── EducationalContentController.php # Educational content
│   │       ├── PetugasController.php      # Worker task management
│   │       └── AdminController.php        # Admin dashboard
│   ├── Middleware/
│   │   └── RoleMiddleware.php             # Role-based authorization
│   └── Kernel.php
├── Models/
│   ├── User.php
│   ├── Address.php
│   ├── WasteType.php
│   ├── Order.php
│   ├── Subscription.php
│   ├── Report.php
│   ├── Review.php
│   ├── EducationalContent.php
│   ├── PaymentTransaction.php
│   ├── HijauPoint.php
│   └── Notification.php
└── Services/
    └── OrderAssignmentService.php         # Auto-assignment algorithm

database/
├── migrations/                            # 11 migration files
└── seeders/
    ├── WasteTypeSeeder.php                # Waste types
    ├── UserSeeder.php                     # Users (admin, customers, petugas, partners)
    ├── AddressSeeder.php                  # Sample addresses
    └── DatabaseSeeder.php                 # Main seeder

routes/
└── api.php                                # 50+ API endpoints

storage/
└── app/
    └── public/
        ├── order_photos/                  # Order before photos
        ├── collection_photos/             # Collection proof photos
        ├── report_photos/                 # Waste pile report photos
        └── resolution_photos/             # Report resolution photos
```

## 🔄 Development Workflow

### Running Migrations

```bash
# Run all migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Rollback all & re-run
php artisan migrate:fresh

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

### Clearing Cache

```bash
# Clear application cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear all caches
php artisan optimize:clear
```

### View Routes

```bash
# List all routes
php artisan route:list

# Filter by API routes
php artisan route:list --path=api

# Filter by method
php artisan route:list --method=POST
```

## 🐛 Troubleshooting

### JWT Token Issues

If JWT authentication fails:

```bash
# Regenerate JWT secret
php artisan jwt:secret --force

# Clear config cache
php artisan config:clear
```

### Storage Permission Issues

```bash
# Windows
icacls storage /grant Users:(OI)(CI)F /T
icacls bootstrap/cache /grant Users:(OI)(CI)F /T

# Linux/Mac
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Database Connection Issues

Check your `.env` file:
- Verify `DB_HOST`, `DB_PORT`, `DB_DATABASE`
- Ensure MySQL service is running
- Test connection: `php artisan tinker` → `DB::connection()->getPdo();`

### File Upload Issues

1. Ensure storage link exists:
   ```bash
   php artisan storage:link
   ```

2. Check `config/filesystems.php`:
   ```php
   'default' => env('FILESYSTEM_DISK', 'public'),
   ```

3. Verify storage permissions (see above)

## 📊 Database Schema

### Core Tables
- `users` - Multi-role users (customer, petugas, admin, partner)
- `addresses` - Customer delivery addresses
- `waste_types` - Waste categories with pricing
- `orders` - Pickup requests
- `subscriptions` - Recurring pickups
- `reports` - Waste pile complaints
- `reviews` - Service ratings
- `educational_contents` - Articles/videos
- `payment_transactions` - Payment records
- `hijau_points` - Point transactions
- `notifications` - User notifications

## 🎯 Next Steps

1. **Frontend Integration**: Connect mobile/web frontend to API
2. **Payment Gateway**: Integrate Midtrans/Xendit for payments
3. **Push Notifications**: Implement FCM for real-time alerts
4. **Google Maps API**: For route optimization and tracking
5. **Cloud Storage**: Use S3/GCS for production file uploads
6. **Rate Limiting**: Configure API throttling in production
7. **Monitoring**: Add Laravel Telescope for debugging
8. **Testing**: Write feature tests with PHPUnit

## 📚 API Documentation

See `QUICK_START.md` for complete API endpoint documentation.

## 🔒 Security Notes

- Change all default passwords in production
- Set `APP_DEBUG=false` in production
- Use HTTPS for all API communications
- Implement rate limiting for auth endpoints
- Rotate JWT secrets regularly
- Enable CORS only for trusted origins
- Validate all file uploads (type, size, malware)

## 🤝 Support

For issues or questions:
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- Review Laravel documentation: https://laravel.com/docs
- JWT Auth documentation: https://jwt-auth.readthedocs.io

---

**Hijauin** - Making waste management easier and more rewarding! 🌱♻️
