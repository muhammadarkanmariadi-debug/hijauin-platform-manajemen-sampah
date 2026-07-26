# Hijauin API Testing Guide

## 📦 Postman Collection

File yang tersedia:
- `Hijauin_API_Collection.postman_collection.json` - Complete API collection
- `Hijauin_Local.postman_environment.json` - Local environment variables

## 🚀 Quick Start

### 1. Import to Postman

1. Open Postman
2. Click **Import** button
3. Select both files:
   - `Hijauin_API_Collection.postman_collection.json`
   - `Hijauin_Local.postman_environment.json`
4. Click **Import**

### 2. Select Environment

- Click environment dropdown (top right)
- Select **"Hijauin - Local Environment"**

### 3. Start Backend Server

```bash
cd backend
php artisan serve
```

Server should be running at: `http://localhost:8000`

## 🧪 Testing Flow

### Test Scenario 1: Customer Journey

#### Step 1: Register as Customer
```
POST {{base_url}}/auth/register

Body:
{
  "name": "John Customer",
  "email": "john@customer.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer",
  "phone": "081234567890"
}

✅ Token will be automatically saved to environment variable
```

#### Step 2: Create Address
```
POST {{base_url}}/customer/addresses

Headers:
Authorization: Bearer {{token}}

Body:
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

✅ Note the address_id from response
```

#### Step 3: Get Waste Types
```
GET {{base_url}}/waste-types

✅ Note the waste_type_id you want to use
```

#### Step 4: Create Order
```
POST {{base_url}}/customer/orders

Headers:
Authorization: Bearer {{token}}

Body:
{
  "address_id": 1,
  "waste_type_id": 1,
  "estimated_weight_kg": 5.5,
  "estimated_volume": 2,
  "scheduled_time": "2025-11-17 09:00:00",
  "payment_method": "cod",
  "customer_notes": "Sampah di depan pagar"
}

✅ Order created successfully
```

#### Step 5: View Orders
```
GET {{base_url}}/customer/orders

✅ See all your orders
```

#### Step 6: Create Subscription
```
POST {{base_url}}/customer/subscriptions

Body:
{
  "address_id": 1,
  "waste_type_id": 1,
  "plan_type": "weekly_2x",
  "pickups_per_week": 2,
  "pickup_days": [1, 4],
  "preferred_time": "09:00",
  "estimated_weight_per_pickup": 5.0,
  "payment_method": "monthly_invoice",
  "start_date": "2025-11-18"
}

✅ Subscription created
```

#### Step 7: Create Report
```
POST {{base_url}}/customer/reports

Headers:
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body (form-data):
- title: "Sampah menumpuk di pinggir jalan"
- description: "Sudah 3 hari tidak diangkut"
- photo: [select file]
- location_address: "Jl. Gatot Subroto"
- kelurahan: "Kuningan"
- city: "Jakarta Selatan"
- latitude: -6.2297
- longitude: 106.8281
- priority: high

✅ Report submitted
```

### Test Scenario 2: Petugas Journey

#### Step 1: Register as Petugas
```
POST {{base_url}}/auth/register

Body:
{
  "name": "Budi Petugas",
  "email": "budi@petugas.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "petugas",
  "phone": "081234567891",
  "zone": "Jakarta Selatan"
}

✅ Token saved automatically
```

#### Step 2: Get Dashboard Stats
```
GET {{base_url}}/petugas/dashboard

✅ View statistics
```

#### Step 3: Get Today's Tasks
```
GET {{base_url}}/petugas/tasks/today

✅ See assigned tasks
```

#### Step 4: Accept Task
```
POST {{base_url}}/petugas/tasks/1/accept

✅ Task accepted
```

#### Step 5: Start Pickup
```
POST {{base_url}}/petugas/tasks/1/start

✅ Pickup started
```

#### Step 6: Collect Waste
```
POST {{base_url}}/petugas/tasks/1/collect

Body (form-data):
- actual_weight_kg: 6.2
- photo: [select file]

✅ Waste collected
```

#### Step 7: Complete Task
```
POST {{base_url}}/petugas/tasks/1/complete

✅ Task completed
```

### Test Scenario 3: Admin Journey

#### Step 1: Create Admin User
Use tinker or seeder to create admin:
```bash
php artisan tinker

$admin = new App\Models\User();
$admin->name = 'Admin Hijauin';
$admin->email = 'admin@hijauin.com';
$admin->password = bcrypt('password123');
$admin->role = 'admin';
$admin->phone = '081234567892';
$admin->status = 'active';
$admin->save();
```

#### Step 2: Login as Admin
```
POST {{base_url}}/auth/login

Body:
{
  "email": "admin@hijauin.com",
  "password": "password123"
}

✅ Token saved
```

#### Step 3: Get Dashboard Statistics
```
GET {{base_url}}/admin/dashboard

✅ View all statistics
```

#### Step 4: Get All Users
```
GET {{base_url}}/admin/users

✅ View all users
```

#### Step 5: Get Users by Role
```
GET {{base_url}}/admin/users?role=petugas&status=active

✅ View filtered users
```

#### Step 6: Get All Orders
```
GET {{base_url}}/admin/orders

✅ View all orders
```

#### Step 7: Assign Order to Petugas
```
POST {{base_url}}/admin/orders/1/assign

Body:
{
  "petugas_id": 2
}

✅ Order assigned
```

#### Step 8: Get All Reports
```
GET {{base_url}}/admin/reports

✅ View all reports
```

#### Step 9: Assign Report
```
POST {{base_url}}/admin/reports/1/assign

Body:
{
  "assigned_to": 2
}

✅ Report assigned
```

## 📋 Collection Structure

### 1. Authentication (5 endpoints)
- Register Customer
- Register Petugas
- Login (auto-saves token)
- Get Profile
- Logout

### 2. Customer - Addresses (6 endpoints)
- Get All Addresses
- Create Address
- Get Address by ID
- Update Address
- Set Default Address
- Delete Address

### 3. Customer - Orders (8 endpoints)
- Get All Orders
- Get Orders by Status
- Get Upcoming Orders
- Get Order History
- Create Order
- Get Order by ID
- Cancel Order
- Submit Review

### 4. Customer - Subscriptions (8 endpoints)
- Get All Subscriptions
- Create Subscription
- Get Subscription by ID
- Update Subscription
- Pause Subscription
- Resume Subscription
- Cancel Subscription
- Delete Subscription

### 5. Customer - Reports (5 endpoints)
- Get All Reports
- Create Report (with file upload)
- Get Report by ID
- Update Report
- Delete Report

### 6. Customer - HijauPoints (2 endpoints)
- Get HijauPoints History
- Get Points Balance

### 7. Petugas - Dashboard (1 endpoint)
- Get Dashboard Stats

### 8. Petugas - Tasks (9 endpoints)
- Get Today's Tasks
- Get Upcoming Tasks
- Get Task History
- Get Task by ID
- Accept Task
- Start Pickup
- Collect Waste (with file upload)
- Complete Task
- Fail Task

### 9. Admin - Dashboard (1 endpoint)
- Get Dashboard Statistics

### 10. Admin - Users (6 endpoints)
- Get All Users
- Get Users by Role
- Get User by ID
- Update User
- Update User Status
- Delete User

### 11. Admin - Orders (4 endpoints)
- Get All Orders
- Get Order by ID
- Assign Order to Petugas
- Reassign Order

### 12. Admin - Reports (4 endpoints)
- Get All Reports
- Get Report by ID
- Assign Report
- Update Report Status

### 13. Public - Waste Types (2 endpoints)
- Get All Waste Types
- Get Waste Type by ID

### 14. Public - Educational Content (2 endpoints)
- Get All Content
- Get Content by ID

**Total: 70+ API endpoints**

## 🔐 Authentication

### Token Management
- Login and Register endpoints automatically save token to environment variable
- All protected endpoints use: `Authorization: Bearer {{token}}`
- Token is valid for 24 hours (configurable in backend)

### Manual Token Update
If needed, you can manually set token:
1. Copy token from login response
2. Go to Environments
3. Paste into `token` variable

## 📝 Common Variables

Environment variables available:
- `{{base_url}}` - API base URL (http://localhost:8000/api)
- `{{token}}` - JWT authentication token
- `{{customer_email}}` - john@customer.com
- `{{petugas_email}}` - budi@petugas.com
- `{{admin_email}}` - admin@hijauin.com
- `{{password}}` - password123

## 🎯 Tips for Testing

### 1. Test Order Flow
1. Register → Login → Create Address → Create Order
2. Switch to Admin → Assign Order to Petugas
3. Switch to Petugas → Accept → Start → Collect → Complete
4. Switch to Customer → Submit Review

### 2. Test Subscription Flow
1. Create Subscription
2. View Subscription Details
3. Pause Subscription
4. Resume Subscription
5. Cancel Subscription

### 3. Test Report Flow
1. Customer creates report with photo
2. Admin views all reports
3. Admin assigns to petugas
4. Admin updates status to resolved

### 4. Use Filters
Many endpoints support query parameters:
- `?status=pending`
- `?role=petugas`
- `?per_page=20`

### 5. File Uploads
For endpoints with file upload:
- Select `form-data` in Body tab
- Add file field with type "File"
- Select your image file

## 🐛 Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Re-login to get new token
- Check if Authorization header is set

### 404 Not Found
- Check if backend server is running
- Verify base_url in environment
- Check if route exists in backend

### 422 Validation Error
- Check request body format
- Verify required fields
- Check data types

### 500 Server Error
- Check backend logs: `backend/storage/logs/laravel.log`
- Verify database connection
- Check if migrations are run

## 📊 Sample Response Structures

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "total": 50,
    "per_page": 15
  }
}
```

## 🚀 Next Steps

1. Import collection and environment to Postman
2. Start backend server
3. Run migrations if needed
4. Test authentication endpoints first
5. Follow test scenarios above
6. Explore all endpoints

## 📞 Support

If you encounter issues:
1. Check backend logs
2. Verify database connection
3. Check API documentation: `backend/HIJAUIN_API_DOCS.md`
4. Review route definitions: `backend/routes/api.php`

---

**Happy Testing! 🧪**

Collection created with ❤️ for Hijauin Platform 🌱
