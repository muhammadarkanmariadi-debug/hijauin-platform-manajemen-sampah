# 📦 Hijauin Postman Collection

## Files Included

1. **Hijauin_API_Collection.postman_collection.json** - Complete API collection with 70+ endpoints
2. **Hijauin_Local.postman_environment.json** - Local environment configuration
3. **API_TESTING_GUIDE.md** - Comprehensive testing guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Import to Postman

1. Open Postman
2. Click **Import** button (top left)
3. Drag & drop both JSON files or click "Upload Files"
4. Click **Import**

### Step 2: Select Environment

- Click environment dropdown (top right corner)
- Select **"Hijauin - Local Environment"**
- Verify `base_url` is set to `http://localhost:8000/api`

### Step 3: Start Testing

1. Make sure backend server is running:
   ```bash
   cd backend
   php artisan serve
   ```

2. Start with Authentication > Login or Register
3. Token will be automatically saved
4. Test other endpoints!

## 📚 Collection Overview

### Total Endpoints: 70+

#### Authentication (5)
- Register Customer
- Register Petugas  
- Login (auto-saves token ✨)
- Get Profile
- Logout

#### Customer Endpoints (29)
- **Addresses**: CRUD operations, set default
- **Orders**: Create, list, filter, cancel, review
- **Subscriptions**: Create, pause, resume, cancel
- **Reports**: Create with photo upload, list, manage
- **HijauPoints**: View history and balance

#### Petugas Endpoints (10)
- **Dashboard**: Stats and overview
- **Tasks**: Today, upcoming, history
- **Actions**: Accept, start, collect (with photo), complete, fail

#### Admin Endpoints (15)
- **Dashboard**: Statistics
- **Users**: Full CRUD, filter by role/status
- **Orders**: View all, assign/reassign petugas
- **Reports**: View all, assign, update status

#### Public Endpoints (4)
- Waste Types
- Educational Content

## 🎯 Quick Test Flows

### Test Customer Journey (5 minutes)
```
1. Authentication > Register Customer
2. Customer - Addresses > Create Address
3. Public > Get All Waste Types
4. Customer - Orders > Create Order
5. Customer - Orders > Get All Orders
```

### Test Petugas Journey (3 minutes)
```
1. Authentication > Register Petugas
2. Petugas > Get Dashboard Stats
3. Petugas > Get Today's Tasks
4. Petugas > Accept Task
5. Petugas > Complete Task
```

### Test Admin Journey (3 minutes)
```
1. Create admin via tinker (see guide)
2. Authentication > Login (with admin credentials)
3. Admin - Dashboard > Get Dashboard Statistics
4. Admin - Users > Get All Users
5. Admin - Orders > Assign Order to Petugas
```

## 🔐 Auto-Authentication

**Magic Feature**: Login and Register automatically save JWT token!

When you:
- Login successfully
- Register successfully

The token is **automatically saved** to `{{token}}` variable and used for all authenticated requests.

No manual copy-paste needed! ✨

## 📝 Environment Variables

Pre-configured variables:
- `base_url`: http://localhost:8000/api
- `token`: (auto-populated on login/register)
- `customer_email`: john@customer.com
- `petugas_email`: budi@petugas.com
- `admin_email`: admin@hijauin.com
- `password`: password123

## 💡 Tips

### Tip 1: File Uploads
For endpoints with file upload (Create Report, Collect Waste):
1. Select request
2. Body tab > form-data
3. Key with type "File"
4. Click "Select Files"

### Tip 2: Query Parameters
Many endpoints support filters:
```
GET /customer/orders?status=pending
GET /admin/users?role=petugas&status=active
```

### Tip 3: Testing Different Roles
1. Login with different user (customer/petugas/admin)
2. Token updates automatically
3. Test role-specific endpoints

### Tip 4: Check Response
- Green status = Success (200, 201)
- Yellow status = Client error (401, 404, 422)
- Red status = Server error (500)

## 🐛 Common Issues

### Issue: 401 Unauthorized
**Solution**: 
- Login again to refresh token
- Check if "Hijauin - Local Environment" is selected

### Issue: 404 Not Found
**Solution**:
- Verify backend server is running (`php artisan serve`)
- Check base_url in environment

### Issue: 422 Validation Error
**Solution**:
- Check request body format
- Verify all required fields are present
- Check data types match API requirements

### Issue: File upload fails
**Solution**:
- Use form-data (not raw JSON)
- Select file type for file fields
- Check file size and format

## 📖 Full Documentation

For detailed testing scenarios and API documentation:
- Read **API_TESTING_GUIDE.md**
- Check **backend/HIJAUIN_API_DOCS.md**

## 🎓 Learning Path

### Beginner
1. Import collection
2. Test Authentication endpoints
3. Test Customer - Addresses
4. Test Customer - Orders

### Intermediate
5. Test Subscriptions
6. Test Reports with file upload
7. Test Petugas tasks

### Advanced
8. Test Admin endpoints
9. Test complex flows (Order lifecycle)
10. Test error scenarios

## 🔄 Updates

To update collection:
1. Make changes in Postman
2. Export collection
3. Replace JSON file
4. Commit to repository

## 📊 API Coverage

✅ All authentication endpoints  
✅ All customer features  
✅ All petugas features  
✅ All admin features  
✅ All public endpoints  
✅ File uploads supported  
✅ Auto-token management  
✅ Query filters included  

**Coverage: 100%** 🎉

## 🤝 Collaboration

To share with team:
1. Share JSON files
2. Team imports to their Postman
3. Everyone uses same collection
4. Update base_url if needed

## 🌟 Features

- ✅ **70+ endpoints** organized by module
- ✅ **Auto-token management** on login/register
- ✅ **Pre-filled examples** for all requests
- ✅ **File upload support** for photos
- ✅ **Environment variables** for easy switching
- ✅ **Query parameters** for filtering
- ✅ **Complete documentation** included

## 📞 Need Help?

1. Read API_TESTING_GUIDE.md for detailed scenarios
2. Check backend/HIJAUIN_API_DOCS.md for API details
3. Review backend/routes/api.php for route definitions
4. Check backend logs: storage/logs/laravel.log

---

**Ready to test!** 🚀  
Import the collection and start exploring the API.

**Hijauin API Collection v1.0.0**  
Built with 💚 for efficient API testing 🧪
