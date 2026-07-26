# 🌱 Hijauin - Waste Management Platform API

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php)](https://php.net)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens)](https://jwt.io)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://mysql.com)
[![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)](PROJECT_STATUS.md)

> **Making waste management easier and more rewarding!** ♻️

Hijauin is a comprehensive waste management platform that connects customers with waste pickup services (fastCOPICK), enables community reporting of illegal waste dumps, and gamifies recycling through a reward points system (HijauPoint).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Customers 👥
- 🚚 **Order Waste Pickup** - Schedule waste collection with automatic pricing
- 📆 **Subscription Service** - Set up recurring pickups (weekly/bi-weekly/monthly)
- 📍 **Multiple Addresses** - Manage delivery locations with GPS coordinates
- 🚨 **Report Waste Piles** - Report illegal dumping with photo evidence
- ⭐ **Review Services** - Rate completed pickups
- 🎁 **Earn HijauPoints** - Get rewards for recycling
- 📚 **Learn** - Access educational content about waste management

### For Workers (Petugas) 🚛
- 📊 **Dashboard** - View daily tasks and statistics
- 📋 **Task Management** - Accept, track, and complete pickup orders
- 📷 **Photo Upload** - Submit collection proof photos
- 🗺️ **Report Resolution** - Handle waste pile cleanup tasks
- 📈 **Performance Tracking** - Monitor completion rates and ratings

### For Administrators 👔
- 🎛️ **Control Panel** - Comprehensive dashboard with KPIs
- 📊 **Analytics** - Time-based reports and trends
- 👥 **User Management** - Manage customers, workers, and partners
- 📦 **Order Management** - Assign, track, and manage all orders
- 🚨 **Report Management** - Handle community waste reports
- 🗑️ **Waste Type CRUD** - Configure waste categories and pricing
- 📝 **Content Management** - Publish educational articles and videos

### System Features 🔧
- 🔐 **Multi-role Authentication** - JWT-based auth for 4 user roles
- 🤖 **Auto-assignment** - Smart order assignment based on zone and workload
- 💰 **Dynamic Pricing** - Automatic price calculation based on waste type and weight
- 🎯 **Point System** - Gamified rewards for recycling behaviors
- 📸 **File Upload** - Support for order and collection photos
- 🔄 **Subscription Scheduling** - Automatic order generation for recurring pickups

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Laravel 11.x |
| **Language** | PHP 8.2+ |
| **Authentication** | JWT (tymon/jwt-auth) |
| **Database** | MySQL 8.0 / PostgreSQL |
| **ORM** | Eloquent |
| **API Style** | RESTful |
| **File Storage** | Local / S3 (configurable) |

---

## 🚀 Quick Start

### Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL 8.0 or PostgreSQL
- Git

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd backend

# 2. Install dependencies
composer install

# 3. Configure environment
copy .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Generate JWT secret
php artisan jwt:secret

# 6. Configure database in .env
# DB_DATABASE=hijauin
# DB_USERNAME=root
# DB_PASSWORD=

# 7. Run migrations
php artisan migrate

# 8. Seed sample data
php artisan db:seed

# 9. Create storage link
php artisan storage:link

# 10. Start development server
php artisan serve
```

The API will be available at `http://localhost:8000`

### Default Credentials

All users have password: `password123`

- **Admin**: `admin@hijauin.com`
- **Customer**: `budi@example.com`
- **Worker**: `joko@hijauin.com`
- **Partner**: `bersama@partner.com`

---

## 📖 API Documentation

### Authentication

```bash
# Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567890",
  "role": "customer"
}

# Login
POST /api/auth/login
{
  "email": "budi@example.com",
  "password": "password123"
}

# Response includes JWT token
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Protected Routes

Use Bearer token in Authorization header:

```bash
GET /api/customer/profile
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/customer/orders` | List customer orders |
| `POST` | `/api/customer/orders` | Create new order |
| `GET` | `/api/petugas/dashboard` | Worker dashboard |
| `POST` | `/api/petugas/tasks/{id}/accept` | Accept task |
| `GET` | `/api/admin/dashboard` | Admin statistics |
| `GET` | `/api/education` | List educational content |

**Full API Reference**: See [QUICK_START.md](QUICK_START.md) for complete endpoint list with examples.

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/     # 7 API controllers
│   │   ├── Middleware/          # RoleMiddleware
│   │   └── Kernel.php           # Middleware registration
│   ├── Models/                  # 10 Eloquent models
│   └── Services/                # Business logic services
├── database/
│   ├── migrations/              # 11 database migrations
│   └── seeders/                 # 4 data seeders
├── routes/
│   └── api.php                  # 50+ API routes
├── storage/
│   └── app/public/              # File uploads
├── QUICK_START.md               # API endpoint reference
├── IMPLEMENTATION_SUMMARY.md    # Technical architecture
├── DEPLOYMENT_GUIDE.md          # Setup instructions
├── PROJECT_STATUS.md            # Project completion status
└── README.md                    # This file
```

---

## 💻 Development

### Running Migrations

```bash
# Run all migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

### Viewing Routes

```bash
# List all routes
php artisan route:list

# Filter by API routes
php artisan route:list --path=api
```

### Clearing Cache

```bash
# Clear all caches
php artisan optimize:clear

# Clear specific cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## 🧪 Testing

### Manual Testing

Use tools like:
- **Postman** - Import collection from `QUICK_START.md`
- **Insomnia** - RESTful API client
- **cURL** - Command-line testing

### Automated Testing (Pending)

```bash
# Run PHPUnit tests (to be implemented)
php artisan test

# Run specific test
php artisan test --filter=OrderTest
```

---

## 🚀 Deployment

### Development

```bash
php artisan serve
```

### Production

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions including:
- Environment configuration
- Database optimization
- File storage setup
- Security hardening
- Performance tuning

**Production Requirements**:
- HTTPS/SSL certificate
- Cloud file storage (S3/GCS)
- Payment gateway integration
- Email service configuration
- Push notification service
- Error tracking (Sentry)
- Monitoring (Laravel Telescope)

---

## 📊 Database Schema

### Core Tables

- `users` - Multi-role users (customer, petugas, admin, partner)
- `addresses` - Customer delivery addresses with GPS
- `waste_types` - Waste categories with pricing/points
- `orders` - Pickup requests with status tracking
- `subscriptions` - Recurring pickup schedules
- `reports` - Community waste pile reports
- `reviews` - Service ratings and feedback
- `educational_contents` - Articles/videos
- `payment_transactions` - Payment history
- `hijau_points` - Point transaction log
- `notifications` - User notifications

**Entity-Relationship Diagram**: See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for detailed schema documentation.

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Follow Laravel conventions
- Use PSR-12 coding standards
- Add PHPDoc comments
- Write meaningful commit messages

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | API endpoint reference with examples |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Technical architecture and design decisions |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete setup and deployment guide |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Project completion status and roadmap |

---

## 🔒 Security

- JWT token authentication
- Password hashing (bcrypt)
- Role-based authorization
- Input validation on all endpoints
- SQL injection prevention (Eloquent ORM)
- CSRF protection

**Report vulnerabilities**: If you discover a security issue, please email [security@hijauin.com](mailto:security@hijauin.com)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Project Status

✅ **MVP Complete** - Ready for development environment deployment

**Implementation Progress**:
- Database: ✅ 100%
- Models: ✅ 100%
- Controllers: ✅ 100%
- API Routes: ✅ 100%
- Documentation: ✅ 100%

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed completion report.

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: Open a GitHub issue
- **Email**: support@hijauin.com

---

## 🙏 Acknowledgments

- **Laravel Team** - For the amazing framework
- **JWT Auth** - tymon/jwt-auth package
- **Community** - All contributors and testers

---

<p align="center">
  <b>Built with ❤️ for a greener planet 🌍♻️</b>
</p>

<p align="center">
  <i>Hijauin - Making waste management easier and more rewarding!</i>
</p>

