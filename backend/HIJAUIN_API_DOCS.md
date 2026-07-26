# Hijauin Backend - API Documentation

## Deskripsi
Backend API untuk platform Hijauin - Solusi Pintar Pengelolaan Sampah Ramah Lingkungan.

## Tech Stack
- **Framework**: Laravel 11.x
- **Database**: MySQL/SQLite
- **Authentication**: JWT (tymon/jwt-auth)
- **PHP Version**: 8.2+

## Fitur Utama

### 1. Multi-Role Authentication System
- **Customer**: Memesan pickup sampah, berlangganan, lapor sampah
- **Petugas (fastCOPICK)**: Manajemen tugas pickup harian
- **Admin**: Dashboard, user management, statistics
- **Partner**: Pengepul/daur ulang (future development)

### 2. Core Features
- ✅ Order Management (one-time & subscription)
- ✅ Waste Reporting System
- ✅ HijauPoint Rewards System
- ✅ Auto-Assignment petugas berdasarkan zona
- ✅ Multi-payment methods
- ✅ Reviews & Ratings
- ✅ Educational Content
- ✅ Real-time Notifications (ready)

## Database Schema

### Users Table
- Multi-role: customer, petugas, admin, partner
- Fields: role, phone, hijau_points, status, zone (for petugas)

### Core Tables
1. **addresses** - Customer delivery addresses
2. **waste_types** - Jenis sampah (organik, anorganik, e-waste, besar)
3. **orders** - One-time pickup orders
4. **subscriptions** - Recurring pickup schedules
5. **reports** - Laporan sampah liar
6. **payment_transactions** - Payment records
7. **reviews** - Service ratings
8. **hijau_points** - Point transactions
9. **educational_contents** - Articles & guides
10. **notifications** - User notifications

## Installation

### 1. Clone & Setup
```bash
cd d:\Project\backend
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Database Configuration
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hijauin
DB_USERNAME=root
DB_PASSWORD=
```

### 3. JWT Configuration
```bash
php artisan jwt:secret
```

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. Seed Data (Optional)
Create seeder for waste types:
```bash
php artisan make:seeder WasteTypeSeeder
php artisan db:seed --class=WasteTypeSeeder
```

### 6. Run Server
```bash
php artisan serve
```

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer",
  "phone": "081234567890",
  "zone": "Jakarta Selatan" // required if role is petugas
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1...",
  "user": { ... }
}
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer {token}
```

### Customer Endpoints

#### Create Order
```http
POST /customer/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "address_id": 1,
  "waste_type_id": 1,
  "estimated_weight_kg": 5.5,
  "estimated_volume": 2,
  "scheduled_time": "2025-11-06 09:00:00",
  "payment_method": "cod",
  "customer_notes": "Sampah di depan pagar"
}
```

#### Get My Orders
```http
GET /customer/orders
Authorization: Bearer {token}

# Filters
GET /customer/orders?status=pending
GET /customer/orders/upcoming
GET /customer/orders/history
```

#### Create Address
```http
POST /customer/addresses
Authorization: Bearer {token}

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

#### Create Subscription
```http
POST /customer/subscriptions

{
  "address_id": 1,
  "waste_type_id": 1,
  "plan_type": "weekly_2x",
  "pickups_per_week": 2,
  "pickup_days": [1, 4], // Monday & Thursday
  "preferred_time": "09:00:00",
  "estimated_weight_per_pickup": 5.0,
  "payment_method": "monthly_invoice"
}
```

#### Report Waste
```http
POST /customer/reports
Content-Type: multipart/form-data

{
  "title": "Sampah menumpuk di pinggir jalan",
  "description": "Sudah 3 hari tidak diangkut",
  "photo": [file],
  "location_address": "Jl. Gatot Subroto",
  "kelurahan": "Kuningan",
  "city": "Jakarta Selatan",
  "latitude": -6.2297,
  "longitude": 106.8281,
  "priority": "high"
}
```

#### Submit Review
```http
POST /customer/orders/{orderId}/review

{
  "petugas_id": 5,
  "rating": 5,
  "comment": "Petugas sangat ramah dan tepat waktu",
  "service_aspect": "overall"
}
```

### Petugas Endpoints

#### Dashboard
```http
GET /petugas/dashboard
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "today_tasks": 5,
    "completed_this_month": 45,
    "average_rating": 4.8,
    "status": "active",
    "zone": "Jakarta Selatan"
  }
}
```

#### Get Today's Tasks
```http
GET /petugas/tasks/today
Authorization: Bearer {token}
```

#### Accept Task
```http
POST /petugas/tasks/{id}/accept
Authorization: Bearer {token}
```

#### Start Pickup
```http
POST /petugas/tasks/{id}/start
Authorization: Bearer {token}
```

#### Collect Waste
```http
POST /petugas/tasks/{id}/collect
Content-Type: multipart/form-data

{
  "actual_weight_kg": 6.2,
  "photo": [file]
}
```

#### Complete Task
```http
POST /petugas/tasks/{id}/complete
Authorization: Bearer {token}
```

#### Fail Task
```http
POST /petugas/tasks/{id}/fail

{
  "reason": "Customer tidak ada di lokasi setelah menunggu 15 menit"
}
```

### Admin Endpoints

#### Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_orders": 1250,
    "active_users": 450,
    "total_petugas": 25,
    "total_waste_collected_kg": 15500,
    "revenue_this_month": 45000000,
    "pending_orders": 15
  }
}
```

#### User Management
```http
GET /admin/users?role=petugas&status=active
GET /admin/users/{id}
PUT /admin/users/{id}
PUT /admin/users/{id}/status
DELETE /admin/users/{id}
```

#### Order Management
```http
GET /admin/orders
POST /admin/orders/{id}/assign
{
  "petugas_id": 5
}

POST /admin/orders/{id}/reassign
{
  "petugas_id": 7,
  "reason": "Petugas sebelumnya tidak tersedia"
}
```

## Business Logic

### 1. Order Flow
```
Customer creates order (pending)
  → Auto-assign or Admin manual assign
    → Petugas accepts (assigned)
      → Petugas starts pickup (on_the_way)
        → Petugas collects waste (collected)
          → Petugas completes (completed)
            → Customer earns HijauPoints
              → Customer can leave review
```

### 2. Auto-Assignment Algorithm
```php
// OrderAssignmentService
1. Find petugas in same zone/city as customer address
2. If not found, find any available petugas
3. Calculate workload for each petugas on scheduled date
4. Assign to petugas with minimum workload
5. Send notification to selected petugas
```

### 3. HijauPoint System
```php
// Points earned from:
- Completing orders (based on weight * waste_type.points_per_kg)
- Reporting waste issues (fixed bonus)
- Subscription loyalty (monthly bonus)

// Points can be used for:
- Discount on future orders
- Redeem rewards (marketplace feature - future)
```

### 4. Subscription System
```php
// Auto-generate orders based on schedule
- Calculate next_pickup_date based on pickup_days
- Create order automatically when next_pickup_date arrives
- Auto-assign petugas
- Handle pause/resume/cancel
```

## Models & Relationships

### User Model
```php
hasMany: addresses, orders, subscriptions, reports, hijauPoints
belongsTo: assignedOrders (as petugas)
methods: addPoints(), deductPoints(), isCustomer(), isPetugas()
```

### Order Model
```php
belongsTo: customer, assignedPetugas, address, wasteType, subscription
hasOne: review
morphMany: paymentTransactions, hijauPoints
methods: assignToPetugas(), markAsCompleted(), canBeReviewed()
```

### Subscription Model
```php
belongsTo: customer, address, wasteType
hasMany: orders
methods: pause(), resume(), cancel(), calculateNextPickupDate(), createOrderForPickup()
```

## Services

### OrderAssignmentService
```php
autoAssignOrder(Order $order): bool
reassignOrder(Order $order, $reason): bool
manualAssignOrder(Order $order, $petugasId): bool
```

### NotificationService (To be implemented)
```php
notifyOrderCreated(Order $order)
notifyPetugasNewTask(Order $order)
notifyOrderCompleted(Order $order)
notifyReportAssigned(Report $report)
```

## Middleware

### RoleMiddleware
```php
// Usage in routes
Route::middleware(['auth:api', 'role:customer'])->group(...);
Route::middleware(['auth:api', 'role:admin,petugas'])->group(...);
```

## Environment Variables
```env
# App
APP_NAME="Hijauin"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# JWT
JWT_SECRET=your_secret_key
JWT_TTL=1440 # 24 hours

# File Storage
FILESYSTEM_DISK=public

# Payment Gateway (future)
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
```

## Testing

### Run Migrations
```bash
php artisan migrate:fresh
```

### Test with Postman/Insomnia
1. Import collection (create from endpoints above)
2. Register user with role "customer"
3. Login and get token
4. Add token to Authorization header
5. Test all endpoints

### Sample Test Flow
```bash
# 1. Register
POST /auth/register (role: customer)

# 2. Login
POST /auth/login

# 3. Create Address
POST /customer/addresses

# 4. Create Order
POST /customer/orders

# 5. Admin assigns petugas (manual or auto)
POST /admin/orders/{id}/assign

# 6. Petugas accepts
POST /petugas/tasks/{id}/accept

# 7. Petugas completes
POST /petugas/tasks/{id}/start
POST /petugas/tasks/{id}/collect
POST /petugas/tasks/{id}/complete

# 8. Customer reviews
POST /customer/orders/{orderId}/review
```

## Next Steps / TODO

### Phase 1 (Current) ✅
- [x] Database schema & migrations
- [x] Models with relationships
- [x] Authentication system
- [x] Basic CRUD for orders, addresses, reports
- [x] Role-based access control
- [x] Auto-assignment service

### Phase 2 🔄
- [ ] Complete all controller methods
- [ ] Notification system (email/SMS/push)
- [ ] File upload handling for photos
- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Data validation & error handling
- [ ] API rate limiting

### Phase 3 📋
- [ ] Educational content CMS
- [ ] Analytics & reporting dashboard
- [ ] Export data (CSV/Excel)
- [ ] Scheduler for subscription auto-orders
- [ ] Email verification
- [ ] Password reset functionality

### Phase 4 🚀
- [ ] Marketplace for recycled products
- [ ] Partner integration
- [ ] Real-time tracking (optional)
- [ ] Mobile app API optimization
- [ ] Performance optimization
- [ ] Unit & feature tests

## Support

For questions or issues:
- Email: support@hijauin.com
- Documentation: https://docs.hijauin.com

## License
MIT License

---
**Hijauin Backend v1.0.0**  
Built with ❤️ for a greener future 🌱
