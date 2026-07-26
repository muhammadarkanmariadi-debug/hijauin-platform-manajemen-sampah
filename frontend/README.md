# Hijauin Frontend

Frontend application untuk platform Hijauin - Solusi Pintar Pengelolaan Sampah Ramah Lingkungan.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

## 🛠 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
copy .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Features

### ✅ Completed
- Landing page with hero & statistics
- User authentication (Login & Register)
- Multi-role support (Customer, Petugas, Admin)
- Customer dashboard
- Create order functionality
- API service layer
- Auth context

### 🔄 In Progress
- Order management (list, detail, cancel)
- Address management
- Report waste issues
- Subscription management
- HijauPoints system
- Petugas dashboard
- Admin panel

## 📁 Project Structure

```
app/
├── auth/                    # Authentication pages
├── dashboard/
│   ├── customer/           # Customer features
│   ├── petugas/            # Staff features
│   └── admin/              # Admin panel
├── components/             # Reusable components
├── contexts/               # React contexts (Auth, etc)
├── services/               # API services
└── page.tsx                # Landing page
```

## 🔐 Authentication

JWT-based authentication with role-based access:
- **Customer** → `/dashboard/customer`
- **Petugas** → `/dashboard/petugas`
- **Admin** → `/dashboard/admin`

## 📡 API Integration

All API calls through `app/services/api.service.ts`:

```typescript
import apiService from '@/app/services/api.service'

// Example
const response = await apiService.getCustomerOrders()
```

## 📚 Documentation

- **API Docs**: `backend/HIJAUIN_API_DOCS.md`
- **Pages Structure**: `PAGES_STRUCTURE.md`
- **Backend Setup**: `backend/README.md`

## 🧪 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint
npm run lint
```

## 📝 Next Steps

See `PAGES_STRUCTURE.md` for complete implementation roadmap.

---

**Hijauin Frontend v1.0.0**  
Built with 💚 for a greener future 🌱
