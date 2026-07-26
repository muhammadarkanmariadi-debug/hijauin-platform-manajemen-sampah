# Hijauin Frontend - Page Structure & Implementation Guide

## Overview
Frontend untuk platform Hijauin menggunakan Next.js 14+ dengan App Router, TypeScript, dan Tailwind CSS.

## 📁 File Structure

```
frontend/
├── app/
│   ├── (public)/                    # Public pages (no auth required)
│   │   ├── page.tsx                 # Landing page (existing Header component)
│   │   ├── tentang/page.tsx         # About page
│   │   ├── layanan/page.tsx         # Services page
│   │   ├── edukasi/
│   │   │   ├── page.tsx            # Educational content list
│   │   │   └── [id]/page.tsx       # Educational content detail
│   │   └── kontak/page.tsx         # Contact page
│   │
│   ├── auth/                        # Authentication pages
│   │   ├── login/page.tsx          # ✅ CREATED - Login page
│   │   ├── register/page.tsx       # ✅ CREATED - Register page
│   │   └── forgot-password/page.tsx # TODO - Forgot password page
│   │
│   ├── dashboard/                   # Protected dashboard pages
│   │   ├── customer/               # Customer dashboard
│   │   │   ├── page.tsx           # ✅ CREATED - Customer main dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx       # TODO - Orders list
│   │   │   │   ├── create/page.tsx # ✅ CREATED - Create order
│   │   │   │   └── [id]/page.tsx  # TODO - Order detail
│   │   │   ├── subscriptions/
│   │   │   │   ├── page.tsx       # TODO - Subscriptions list
│   │   │   │   ├── create/page.tsx # TODO - Create subscription
│   │   │   │   └── [id]/page.tsx  # TODO - Subscription detail
│   │   │   ├── addresses/
│   │   │   │   ├── page.tsx       # TODO - Addresses list
│   │   │   │   ├── create/page.tsx # TODO - Create address
│   │   │   │   └── [id]/edit/page.tsx # TODO - Edit address
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx       # TODO - Reports list
│   │   │   │   ├── create/page.tsx # TODO - Create report
│   │   │   │   └── [id]/page.tsx  # TODO - Report detail
│   │   │   ├── hijau-points/page.tsx # TODO - HijauPoints history
│   │   │   └── profile/page.tsx   # TODO - Customer profile
│   │   │
│   │   ├── petugas/               # Petugas (Staff) dashboard
│   │   │   ├── page.tsx           # TODO - Petugas main dashboard
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx       # TODO - Tasks list (today, upcoming, history)
│   │   │   │   └── [id]/page.tsx  # TODO - Task detail & actions
│   │   │   ├── schedule/page.tsx  # TODO - Weekly schedule calendar
│   │   │   ├── earnings/page.tsx  # TODO - Earnings & statistics
│   │   │   └── profile/page.tsx   # TODO - Petugas profile
│   │   │
│   │   └── admin/                 # Admin dashboard
│   │       ├── page.tsx           # TODO - Admin main dashboard
│   │       ├── users/
│   │       │   ├── page.tsx       # TODO - Users list
│   │       │   ├── [id]/page.tsx  # TODO - User detail
│   │       │   └── create/page.tsx # TODO - Create user
│   │       ├── orders/
│   │       │   ├── page.tsx       # TODO - Orders management
│   │       │   └── [id]/page.tsx  # TODO - Order detail & assignment
│   │       ├── reports/
│   │       │   ├── page.tsx       # TODO - Reports management
│   │       │   └── [id]/page.tsx  # TODO - Report detail & assignment
│   │       ├── petugas/
│   │       │   ├── page.tsx       # TODO - Petugas management
│   │       │   └── [id]/page.tsx  # TODO - Petugas detail & performance
│   │       ├── waste-types/page.tsx # TODO - Waste types management
│   │       ├── content/
│   │       │   ├── page.tsx       # TODO - Educational content CMS
│   │       │   ├── create/page.tsx # TODO - Create content
│   │       │   └── [id]/edit/page.tsx # TODO - Edit content
│   │       └── analytics/page.tsx # TODO - Analytics & reports
│   │
│   ├── components/                # Reusable components
│   │   ├── Header.tsx            # ✅ EXISTS - Landing page header
│   │   ├── Navbar.tsx            # TODO - Main navigation
│   │   ├── Footer.tsx            # TODO - Footer
│   │   ├── Sidebar.tsx           # TODO - Dashboard sidebar
│   │   ├── OrderCard.tsx         # TODO - Order display card
│   │   ├── TaskCard.tsx          # TODO - Task display card
│   │   ├── StatusBadge.tsx       # TODO - Status badge component
│   │   ├── Modal.tsx             # TODO - Modal wrapper
│   │   ├── Loading.tsx           # TODO - Loading spinner
│   │   └── ProtectedRoute.tsx    # TODO - Auth guard component
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx       # ✅ CREATED - Authentication context
│   │   └── ThemeContext.tsx      # TODO - Theme context (optional)
│   │
│   ├── services/
│   │   └── api.service.ts        # ✅ CREATED - API service layer
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts           # TODO - Auth hook
│   │   ├── useOrders.ts         # TODO - Orders hook
│   │   └── useTasks.ts          # TODO - Tasks hook
│   │
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts        # TODO - Date, currency formatters
│   │   ├── validators.ts        # TODO - Form validators
│   │   └── constants.ts         # TODO - App constants
│   │
│   └── types/                    # TypeScript types
│       ├── user.types.ts        # TODO - User types
│       ├── order.types.ts       # TODO - Order types
│       └── api.types.ts         # TODO - API response types
│
├── public/
│   └── assets/
│       └── images/
│           └── header.png       # ✅ EXISTS - Header background
│
└── package.json
```

## 🎨 Design System

### Colors
```typescript
// Primary Colors
green-50  to green-900  // Main brand color (Hijauin = green)
blue-50   to blue-900   // Secondary (info, links)
yellow-50 to yellow-900 // Warnings, pending states
red-50    to red-900    // Errors, cancelled
purple-50 to purple-900 // Premium features, subscriptions
gray-50   to gray-900   // Neutral colors
```

### Status Colors
```typescript
pending       → yellow  // Menunggu
assigned      → blue    // Dijadwalkan
on_the_way    → purple  // Dalam Perjalanan
collected     → indigo  // Terkumpul
completed     → green   // Selesai
cancelled     → red     // Dibatalkan
failed        → red     // Gagal
```

## 📋 Page Implementation Details

### 1. Customer Pages

#### Orders List (`/dashboard/customer/orders/page.tsx`)
**Features:**
- Filter by status (all, pending, completed, cancelled)
- Search by order ID
- Pagination
- Order cards with status badges
- Quick actions: View detail, Cancel, Review

**API Endpoints:**
- `GET /api/customer/orders`
- `GET /api/customer/orders?status=pending`

#### Order Detail (`/dashboard/customer/orders/[id]/page.tsx`)
**Features:**
- Order information (waste type, weight, address, schedule)
- Status timeline
- Petugas information (if assigned)
- Real-time tracking (optional)
- Cancel order button (if pending)
- Review button (if completed)

**API Endpoints:**
- `GET /api/customer/orders/{id}`
- `POST /api/customer/orders/{id}/cancel`
- `POST /api/customer/orders/{id}/review`

#### Subscriptions List (`/dashboard/customer/subscriptions/page.tsx`)
**Features:**
- Active subscriptions display
- Subscription details (plan, frequency, next pickup)
- Actions: Pause, Resume, Cancel
- Create new subscription button

**API Endpoints:**
- `GET /api/customer/subscriptions`
- `POST /api/customer/subscriptions/{id}/pause`
- `POST /api/customer/subscriptions/{id}/resume`
- `POST /api/customer/subscriptions/{id}/cancel`

#### Create Subscription (`/dashboard/customer/subscriptions/create/page.tsx`)
**Features:**
- Select address
- Choose waste type
- Select plan (daily, 2x/week, 3x/week, weekly)
- Choose pickup days
- Set preferred time
- Payment method

**API Endpoints:**
- `POST /api/customer/subscriptions`

#### Addresses Management (`/dashboard/customer/addresses/page.tsx`)
**Features:**
- List all addresses
- Set default address
- Edit/Delete actions
- Add new address button

**API Endpoints:**
- `GET /api/customer/addresses`
- `PUT /api/customer/addresses/{id}/set-default`
- `DELETE /api/customer/addresses/{id}`

#### Create/Edit Address (`/dashboard/customer/addresses/create/page.tsx`)
**Features:**
- Label (Rumah, Kantor, etc.)
- Full address with autocomplete (optional)
- Kelurahan, Kecamatan, City, Province
- Postal code
- Map picker for coordinates (optional)
- Set as default checkbox

**API Endpoints:**
- `POST /api/customer/addresses`
- `PUT /api/customer/addresses/{id}`

#### Reports List (`/dashboard/customer/reports/page.tsx`)
**Features:**
- List of reported waste issues
- Status badges (pending, assigned, resolved)
- Location information
- Photos thumbnails

**API Endpoints:**
- `GET /api/customer/reports`

#### Create Report (`/dashboard/customer/reports/create/page.tsx`)
**Features:**
- Title and description
- Photo upload (drag & drop)
- Location (manual or GPS)
- Address details
- Priority level
- Submit button

**API Endpoints:**
- `POST /api/customer/reports` (multipart/form-data)

#### HijauPoints History (`/dashboard/customer/hijau-points/page.tsx`)
**Features:**
- Current balance display
- Points history (earned, spent)
- Transaction details
- Redeem rewards section (future)

**API Endpoints:**
- `GET /api/customer/hijau-points`

### 2. Petugas Pages

#### Petugas Dashboard (`/dashboard/petugas/page.tsx`)
**Features:**
- Today's statistics (tasks, completed, earnings)
- Task list (today, upcoming)
- Quick actions (start next task)
- Rating overview
- Monthly performance chart

**API Endpoints:**
- `GET /api/petugas/dashboard`
- `GET /api/petugas/tasks/today`

#### Tasks List (`/dashboard/petugas/tasks/page.tsx`)
**Features:**
- Tabs: Today, Upcoming, History
- Task cards with customer info, location, schedule
- Filter by status
- Actions: Accept, Start, Complete, Fail

**API Endpoints:**
- `GET /api/petugas/tasks/today`
- `GET /api/petugas/tasks/upcoming`
- `GET /api/petugas/tasks/history`

#### Task Detail (`/dashboard/petugas/tasks/[id]/page.tsx`)
**Features:**
- Customer information
- Pickup location with map
- Waste type and estimated weight
- Schedule time
- Customer notes
- Action buttons based on status:
  - Accept task
  - Start pickup
  - Collect waste (upload photo, actual weight)
  - Complete
  - Mark as failed (with reason)

**API Endpoints:**
- `GET /api/petugas/tasks/{id}`
- `POST /api/petugas/tasks/{id}/accept`
- `POST /api/petugas/tasks/{id}/start`
- `POST /api/petugas/tasks/{id}/collect`
- `POST /api/petugas/tasks/{id}/complete`
- `POST /api/petugas/tasks/{id}/fail`

### 3. Admin Pages

#### Admin Dashboard (`/dashboard/admin/page.tsx`)
**Features:**
- Key statistics (orders, users, revenue, waste collected)
- Charts (daily orders, monthly revenue, waste by type)
- Recent activities
- Pending items (orders, reports)
- Quick actions

**API Endpoints:**
- `GET /api/admin/dashboard`

#### Users Management (`/dashboard/admin/users/page.tsx`)
**Features:**
- Users table with filters (role, status)
- Search by name/email
- Pagination
- Actions: View, Edit, Activate/Deactivate, Delete
- Create new user button

**API Endpoints:**
- `GET /api/admin/users?role={role}&status={status}`
- `PUT /api/admin/users/{id}/status`
- `DELETE /api/admin/users/{id}`

#### Orders Management (`/dashboard/admin/orders/page.tsx`)
**Features:**
- Orders table with filters
- Assign/Reassign petugas
- View order details
- Order statistics

**API Endpoints:**
- `GET /api/admin/orders`
- `POST /api/admin/orders/{id}/assign`
- `POST /api/admin/orders/{id}/reassign`

#### Petugas Management (`/dashboard/admin/petugas/page.tsx`)
**Features:**
- Petugas list with zones
- Performance metrics
- Current workload
- Ratings
- Zone assignment

**API Endpoints:**
- `GET /api/admin/users?role=petugas`
- `GET /api/admin/petugas/{id}/performance`

#### Educational Content CMS (`/dashboard/admin/content/page.tsx`)
**Features:**
- Content list (articles, guides)
- Create/Edit/Delete
- Rich text editor
- Category management
- Publish/Unpublish

**API Endpoints:**
- `GET /api/admin/educational-content`
- `POST /api/admin/educational-content`
- `PUT /api/admin/educational-content/{id}`
- `DELETE /api/admin/educational-content/{id}`

### 4. Public Pages

#### Educational Content (`/edukasi/page.tsx`)
**Features:**
- Articles grid with categories
- Search functionality
- Featured content
- Pagination

**API Endpoints:**
- `GET /api/educational-content`

#### Educational Content Detail (`/edukasi/[id]/page.tsx`)
**Features:**
- Article content with rich media
- Related articles
- Share buttons
- Comments (optional)

**API Endpoints:**
- `GET /api/educational-content/{id}`

## 🔐 Authentication Flow

### Protected Routes
```typescript
// Use middleware or ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    redirect('/auth/login')
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect('/unauthorized')
  }
  
  return children
}
```

### Usage Example
```typescript
// In layout.tsx or page.tsx
<ProtectedRoute allowedRoles={['customer']}>
  <CustomerDashboard />
</ProtectedRoute>
```

## 🎯 Key Components to Build

### 1. Navbar Component
```typescript
// Features:
- Logo
- Navigation links based on role
- User menu with dropdown
- Notifications icon (with badge)
- Logout button
```

### 2. Sidebar Component
```typescript
// Features:
- Navigation menu for dashboard
- Active route highlighting
- Collapsible on mobile
- Role-based menu items
```

### 3. OrderCard Component
```typescript
// Props:
- order: Order
- showActions: boolean
- onViewDetail: () => void
- onCancel?: () => void
- onReview?: () => void
```

### 4. TaskCard Component (Petugas)
```typescript
// Props:
- task: Task
- onAccept?: () => void
- onStart?: () => void
- onViewDetail: () => void
```

### 5. StatusBadge Component
```typescript
// Props:
- status: OrderStatus
- size: 'sm' | 'md' | 'lg'
```

### 6. Modal Component
```typescript
// Features:
- Reusable modal wrapper
- Close on overlay click
- Close button
- Custom content
```

## 🛠 Development Workflow

### Phase 1: Core Setup ✅
- [x] Authentication pages (login, register)
- [x] API service layer
- [x] Auth context
- [x] Customer dashboard

### Phase 2: Customer Features 🔄
- [x] Create order page
- [ ] Orders list & detail
- [ ] Addresses management
- [ ] Reports (create & list)
- [ ] Subscriptions
- [ ] HijauPoints history

### Phase 3: Petugas Features
- [ ] Petugas dashboard
- [ ] Tasks list & detail
- [ ] Task actions (accept, start, complete)
- [ ] Schedule calendar
- [ ] Earnings page

### Phase 4: Admin Features
- [ ] Admin dashboard
- [ ] Users management
- [ ] Orders management
- [ ] Petugas management
- [ ] Content CMS
- [ ] Analytics

### Phase 5: Public Pages
- [ ] Educational content
- [ ] About page
- [ ] Services page
- [ ] Contact page

### Phase 6: Enhancements
- [ ] Real-time notifications
- [ ] Map integration
- [ ] File upload optimization
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] PWA features

## 📱 Responsive Design

All pages should be responsive with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🧪 Testing Checklist

For each page:
- [ ] Layout renders correctly
- [ ] Forms validation works
- [ ] API calls handle errors
- [ ] Loading states display
- [ ] Success/error messages show
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] Accessible (ARIA labels)

## 📚 Additional Resources

### Icons
- Using `lucide-react` for icons
- Common icons: Package, MapPin, Calendar, User, TrendingUp, AlertCircle, CheckCircle, Clock

### Date Formatting
```typescript
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

format(new Date(), 'dd MMMM yyyy', { locale: id })
// Output: 16 November 2025
```

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
// formatCurrency(50000) → Rp50.000
```

## 🚀 Next Steps

1. Complete authentication pages (forgot password, email verification)
2. Build core dashboard layouts (Navbar, Sidebar)
3. Implement Customer pages one by one
4. Build Petugas dashboard and task management
5. Create Admin panel
6. Add public pages
7. Implement notifications system
8. Add real-time features
9. Optimize and test
10. Deploy!

---

**Status:** In Progress 🔄  
**Last Updated:** November 16, 2025  
**Developer:** Hijauin Team 🌱
