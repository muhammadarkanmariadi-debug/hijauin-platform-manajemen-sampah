# Hijauin Backend - Quick Start Guide 🚀

## 📋 Yang Sudah Dibuat

### ✅ Database Structure (10 Migrations)
1. `update_users_table_add_role_and_fields` - Multi-role user system
2. `create_addresses_table` - Customer addresses
3. `create_waste_types_table` - Jenis sampah (organik, anorganik, etc)
4. `create_orders_table` - Order pickup
5. `create_reports_table` - Laporan sampah liar
6. `create_subscriptions_table` - Paket berlangganan
7. `create_payment_transactions_table` - Transaksi pembayaran
8. `create_reviews_table` - Rating & ulasan
9. `create_educational_contents_table` - Konten edukasi
10. `create_hijau_points_table` - Sistem poin reward
11. `create_notifications_table` - Notifikasi

### ✅ Models (9 Models)
- User (with multi-role & HijauPoint methods)
- Address
- WasteType
- Order
- Report
- Subscription
- PaymentTransaction
- Review
- EducationalContent
- HijauPoint

### ✅ Controllers
- AuthController (register, login, logout)
- OrderController (CRUD orders)
- PetugasController (task management)
- RoleMiddleware (role-based access)

### ✅ Services
- OrderAssignmentService (auto-assign petugas)

### ✅ API Routes
- Authentication routes
- Customer routes (orders, addresses, subscriptions, reports)
- Petugas routes (tasks, status updates)
- Admin routes (dashboard, management)

## 🚀 Cara Menjalankan

### Step 1: Run Migrations
```bash
cd d:\Project\backend
php artisan migrate
```

### Step 2: Seed Waste Types (Manual via Tinker)
```bash
php artisan tinker
```

```php
use App\Models\WasteType;

WasteType::create([
    'name' => 'Organik',
    'slug' => 'organik',
    'description' => 'Sampah organik seperti sisa makanan, daun, dll',
    'base_price_per_kg' => 2000,
    'points_per_kg' => 10,
    'is_active' => true
]);

WasteType::create([
    'name' => 'Anorganik',
    'slug' => 'anorganik',
    'description' => 'Sampah plastik, kertas, botol, dll',
    'base_price_per_kg' => 3000,
    'points_per_kg' => 15,
    'is_active' => true
]);

WasteType::create([
    'name' => 'E-Waste',
    'slug' => 'e-waste',
    'description' => 'Sampah elektronik',
    'base_price_per_kg' => 5000,
    'points_per_kg' => 25,
    'is_active' => true
]);

WasteType::create([
    'name' => 'Sampah Besar',
    'slug' => 'sampah-besar',
    'description' => 'Furniture, kasur, dll',
    'base_price_per_kg' => 1500,
    'points_per_kg' => 20,
    'is_active' => true
]);

exit
```

### Step 3: Start Server
```bash
php artisan serve
```

Server akan berjalan di: `http://localhost:8000`

## 🧪 Testing Flow

### 1. Register Customer
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "Budi Customer",
  "email": "budi@customer.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer",
  "phone": "081234567890"
}
```

### 2. Register Petugas
```http
POST http://localhost:8000/api/auth/register

{
  "name": "Joko Petugas",
  "email": "joko@petugas.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "petugas",
  "phone": "081234567891",
  "zone": "Jakarta Selatan"
}
```

### 3. Register Admin
```http
POST http://localhost:8000/api/auth/register

{
  "name": "Admin Hijauin",
  "email": "admin@hijauin.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "admin",
  "phone": "081234567892"
}
```

> **Note**: Untuk production, role 'admin' harus dibatasi dan tidak bisa register via API public.

### 4. Login
```http
POST http://localhost:8000/api/auth/login

{
  "email": "budi@customer.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Budi Customer",
    "email": "budi@customer.com",
    "role": "customer",
    "hijau_points": 0
  }
}
```

**Simpan token** dan gunakan di header untuk request selanjutnya:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 5. Create Address (sebagai Customer)
```http
POST http://localhost:8000/api/customer/addresses
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

### 6. Create Order (sebagai Customer)
```http
POST http://localhost:8000/api/customer/orders
Authorization: Bearer {customer-token}

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

### 7. Assign Order (Manual via Tinker or Admin Panel)
```bash
php artisan tinker
```

```php
use App\Models\Order;
use App\Services\OrderAssignmentService;

$order = Order::find(1);
$service = new OrderAssignmentService();
$service->autoAssignOrder($order);
// atau manual assign
// $service->manualAssignOrder($order, 2); // 2 = petugas_id

exit
```

### 8. Petugas Dashboard
```http
GET http://localhost:8000/api/petugas/dashboard
Authorization: Bearer {petugas-token}
```

### 9. Petugas Get Today's Tasks
```http
GET http://localhost:8000/api/petugas/tasks/today
Authorization: Bearer {petugas-token}
```

### 10. Petugas Start Task
```http
POST http://localhost:8000/api/petugas/tasks/1/start
Authorization: Bearer {petugas-token}
```

### 11. Petugas Complete Task
```http
POST http://localhost:8000/api/petugas/tasks/1/collect
Authorization: Bearer {petugas-token}
Content-Type: multipart/form-data

{
  "actual_weight_kg": 6.0,
  "photo": [upload file]
}
```

```http
POST http://localhost:8000/api/petugas/tasks/1/complete
Authorization: Bearer {petugas-token}
```

### 12. Check Customer Points
```http
GET http://localhost:8000/api/auth/me
Authorization: Bearer {customer-token}
```

User akan menerima HijauPoints setelah order completed!

## 📊 Database Diagram

```
users (multi-role)
  ├── addresses (customer)
  ├── orders (customer)
  │   ├── assigned_petugas (petugas)
  │   ├── waste_type
  │   ├── address
  │   ├── subscription
  │   ├── payment_transactions
  │   ├── review
  │   └── hijau_points
  ├── subscriptions (customer)
  ├── reports (reporter)
  ├── reviews (customer → petugas)
  └── hijau_points
```

## 🔧 Troubleshooting

### Error: JWT Secret not set
```bash
php artisan jwt:secret
```

### Error: Storage link
```bash
php artisan storage:link
```

### Error: Migration fails
```bash
php artisan migrate:fresh
```

### Check routes
```bash
php artisan route:list
```

### Clear cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## 📝 Next Steps

### Implementasi Lanjutan:

1. **Complete Remaining Controllers**
   - AddressController (full CRUD)
   - ReportController (full CRUD)
   - SubscriptionController (full CRUD)
   - AdminController (dashboard, statistics, exports)
   - EducationalContentController
   - ReviewController

2. **Notification System**
   - Email notifications
   - SMS notifications (Twilio/Vonage)
   - Push notifications

3. **Payment Integration**
   - Midtrans/Xendit integration
   - Payment webhooks
   - Refund handling

4. **File Upload**
   - Photo validation
   - Image compression
   - Cloud storage (AWS S3/Cloudinary)

5. **Scheduler**
   - Auto-generate subscription orders
   - Point expiration
   - Reminder notifications

6. **Testing**
   - Unit tests
   - Feature tests
   - API tests

7. **Performance**
   - Query optimization
   - Caching (Redis)
   - Rate limiting
   - API documentation (Swagger)

## 🎯 Current Status

✅ **DONE:**
- Database schema (100%)
- Models & relationships (100%)
- Authentication system (100%)
- Order flow (80%)
- Petugas workflow (80%)
- Auto-assignment logic (100%)
- HijauPoint system (100%)
- API routes structure (100%)

🔄 **IN PROGRESS:**
- Controller implementations (60%)
- File upload handling (0%)
- Notification system (0%)

📋 **TODO:**
- Payment gateway (0%)
- Admin dashboard complete (30%)
- Scheduler jobs (0%)
- Testing (0%)

## 💡 Tips

1. Gunakan Postman/Insomnia untuk testing API
2. Install extension database viewer (TablePlus/DBeaver) untuk melihat data
3. Gunakan `php artisan tinker` untuk testing logic
4. Baca file `HIJAUIN_API_DOCS.md` untuk dokumentasi lengkap
5. Check logs di `storage/logs/laravel.log` jika ada error

## 🤝 Contributing

Untuk development lebih lanjut:
1. Buat branch baru untuk setiap feature
2. Follow Laravel best practices
3. Buat migration untuk setiap perubahan database
4. Dokumentasikan setiap API endpoint
5. Test sebelum commit

---

**Happy Coding! 🚀**  
Hijauin Backend v1.0.0
