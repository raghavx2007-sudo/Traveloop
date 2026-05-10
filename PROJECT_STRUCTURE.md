# Traveloop - Project Structure & Architecture

## 📂 Complete File Structure

```
traveloop/
│
├── 📁 client/                          # Frontend React Application
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable UI components
│   │   │   └── (Phase 2+)
│   │   │
│   │   ├── 📁 pages/                   # Page components
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── Register.jsx            # Registration page
│   │   │   ├── Dashboard.jsx           # Main dashboard
│   │   │   └── MyTrips.jsx             # Trips listing page
│   │   │
│   │   ├── 📁 layouts/                 # Layout wrappers
│   │   │   └── MainLayout.jsx          # Main app layout with sidebar
│   │   │
│   │   ├── 📁 context/                 # React Context API
│   │   │   └── AuthContext.jsx         # Authentication state management
│   │   │
│   │   ├── 📁 services/                # API integration
│   │   │   └── api.js                  # Axios instance & interceptors
│   │   │
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   │   └── (Phase 2+)
│   │   │
│   │   ├── 📁 utils/                   # Utility functions
│   │   │   └── (Phase 2+)
│   │   │
│   │   ├── App.jsx                     # Main app component with routing
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Global styles & Tailwind
│   │
│   ├── index.html                      # HTML template
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── postcss.config.js               # PostCSS configuration
│   └── README.md                       # Frontend documentation
│
├── 📁 server/                          # Backend Express Application
│   ├── 📁 config/
│   │   └── database.js                 # MySQL connection pool
│   │
│   ├── 📁 controllers/                 # Business logic
│   │   └── authController.js           # Authentication logic
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                     # JWT authentication middleware
│   │   ├── errorHandler.js             # Global error handling
│   │   └── upload.js                   # Multer file upload config
│   │
│   ├── 📁 routes/                      # API route definitions
│   │   └── authRoutes.js               # Authentication routes
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   └── validation.js               # Input validation rules
│   │
│   ├── 📁 uploads/                     # File upload directory
│   │   └── .gitkeep
│   │
│   ├── server.js                       # Express app entry point
│   ├── package.json                    # Backend dependencies
│   ├── .env.example                    # Environment variables template
│   ├── .env                            # Environment variables (create this)
│   ├── .gitignore                      # Git ignore rules
│   └── README.md                       # Backend documentation
│
├── 📁 database/
│   └── schema.sql                      # MySQL database schema
│
├── README.md                           # Project overview
├── SETUP_GUIDE.md                      # Detailed setup instructions
├── PROJECT_STRUCTURE.md                # This file
└── .gitignore                          # Global git ignore
```

## 🏗️ Architecture Overview

### Frontend Architecture (React + Vite)

```
┌─────────────────────────────────────────┐
│           Browser (Port 3000)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │         React Router DOM          │ │
│  │  (Public & Protected Routes)      │ │
│  └───────────────────────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │       Auth Context Provider       │ │
│  │   (Global Authentication State)   │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │          Page Components          │ │
│  │  Login │ Register │ Dashboard     │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │       Reusable Components         │ │
│  │   Cards │ Modals │ Forms          │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │         API Service Layer         │ │
│  │    (Axios with Interceptors)      │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────┬───────────────────────┘
                  │ HTTP Requests
                  ▼
         Backend API (Port 5000)
```

### Backend Architecture (Express + MySQL)

```
┌─────────────────────────────────────────┐
│      Express Server (Port 5000)         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │         Middleware Stack          │ │
│  │  CORS │ JSON Parser │ Static      │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │          Route Handlers           │ │
│  │   /api/auth │ /api/trips          │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │      Authentication Middleware    │ │
│  │        (JWT Verification)         │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │           Controllers             │ │
│  │      (Business Logic Layer)       │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │       Database Connection         │ │
│  │      (MySQL Connection Pool)      │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│  ┌───────────────┴───────────────────┐ │
│  │       Error Handler Middleware    │ │
│  │     (Global Error Handling)       │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────┬───────────────────────┘
                  │ SQL Queries
                  ▼
         MySQL Database (Port 3306)
```

### Database Schema (MySQL)

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ name         │
│ email        │
│ password     │
│ profile_img  │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────┴───────┐
│    trips     │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ trip_name    │
│ start_date   │
│ end_date     │
│ cover_image  │
└──────┬───────┘
       │ 1
       ├─────────────────┬─────────────────┬──────────────┐
       │ N               │ N               │ N            │ N
┌──────┴────────┐ ┌──────┴────────┐ ┌─────┴──────┐ ┌────┴─────┐
│  trip_stops   │ │checklist_items│ │   notes    │ │budget_itm│
├───────────────┤ ├───────────────┤ ├────────────┤ ├──────────┤
│ id (PK)       │ │ id (PK)       │ │ id (PK)    │ │ id (PK)  │
│ trip_id (FK)  │ │ trip_id (FK)  │ │trip_id(FK) │ │trip_id   │
│ city_name     │ │ item_name     │ │ note       │ │ category │
│ country       │ │ category      │ │ note_date  │ │ amount   │
│ arrival_date  │ │ is_packed     │ └────────────┘ └──────────┘
└───────┬───────┘ └───────────────┘
        │ 1
        │
        │ N
┌───────┴──────────┐
│ trip_activities  │
├──────────────────┤
│ id (PK)          │
│ trip_stop_id(FK) │
│ activity_id (FK) │
│ selected_date    │
│ custom_cost      │
└───────┬──────────┘
        │ N
        │
        │ 1
┌───────┴──────┐
│  activities  │
├──────────────┤
│ id (PK)      │
│ name         │
│ category     │
│ avg_cost     │
│ duration     │
└──────────────┘
```

## 🔄 Data Flow

### Authentication Flow

```
1. User Registration/Login
   ↓
2. Frontend sends credentials to /api/auth/register or /api/auth/login
   ↓
3. Backend validates input
   ↓
4. Backend hashes password (bcrypt)
   ↓
5. Backend stores user in database
   ↓
6. Backend generates JWT token
   ↓
7. Frontend receives token + user data
   ↓
8. Frontend stores token in localStorage
   ↓
9. Frontend sets token in axios headers
   ↓
10. Frontend updates Auth Context
   ↓
11. User redirected to Dashboard
```

### Protected Route Access

```
1. User navigates to protected route
   ↓
2. ProtectedRoute component checks Auth Context
   ↓
3. If no user → Redirect to /login
   ↓
4. If user exists → Render requested page
   ↓
5. Page makes API request
   ↓
6. Axios interceptor adds token to headers
   ↓
7. Backend auth middleware verifies token
   ↓
8. If valid → Process request
   ↓
9. If invalid → Return 401 error
   ↓
10. Frontend interceptor catches 401 → Logout user
```

## 📦 Module Responsibilities

### Frontend Modules

| Module | Responsibility |
|--------|---------------|
| **App.jsx** | Main routing configuration, route protection |
| **AuthContext** | Global auth state, login/logout functions |
| **api.js** | Axios configuration, request/response interceptors |
| **MainLayout** | Sidebar navigation, user profile display |
| **Pages** | Page-level components, data fetching |
| **Components** | Reusable UI elements (Phase 2+) |

### Backend Modules

| Module | Responsibility |
|--------|---------------|
| **server.js** | Express app setup, middleware registration |
| **database.js** | MySQL connection pool, connection testing |
| **authController** | User registration, login, profile logic |
| **auth.js** | JWT token verification middleware |
| **validation.js** | Input validation rules using express-validator |
| **errorHandler** | Global error catching and formatting |
| **upload.js** | File upload configuration with multer |

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│   Frontend Security                 │
├─────────────────────────────────────┤
│ • Protected Routes                  │
│ • Token Storage (localStorage)      │
│ • Auto-logout on 401               │
│ • Input Validation                  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Network Security                  │
├─────────────────────────────────────┤
│ • HTTPS (Production)                │
│ • CORS Configuration                │
│ • JWT Token in Headers              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Backend Security                  │
├─────────────────────────────────────┤
│ • JWT Verification                  │
│ • Password Hashing (bcrypt)         │
│ • Input Validation                  │
│ • SQL Injection Prevention          │
│ • Error Message Sanitization        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Database Security                 │
├─────────────────────────────────────┤
│ • Foreign Key Constraints           │
│ • Indexed Queries                   │
│ • Connection Pooling                │
│ • Prepared Statements               │
└─────────────────────────────────────┘
```

## 🎨 UI Component Hierarchy

```
App
├── Router
│   ├── PublicRoute
│   │   ├── Login
│   │   └── Register
│   │
│   └── ProtectedRoute
│       └── MainLayout
│           ├── Sidebar
│           │   ├── Logo
│           │   ├── Navigation Links
│           │   └── User Profile
│           │
│           └── Outlet (Page Content)
│               ├── Dashboard
│               │   ├── Welcome Banner
│               │   ├── Stats Grid
│               │   ├── Recent Trips
│               │   └── Popular Destinations
│               │
│               └── MyTrips
│                   ├── Header
│                   ├── Trips Grid
│                   └── Create Trip Modal
```

## 📊 State Management

### Global State (Context API)

```javascript
AuthContext
├── user (object | null)
├── loading (boolean)
├── token (string | null)
├── register(name, email, password)
├── login(email, password)
└── logout()
```

### Local State (Component Level)

```javascript
// Login/Register Pages
├── formData (object)
├── loading (boolean)
└── error (string)

// Dashboard
├── stats (array)
├── recentTrips (array)
└── popularDestinations (array)

// MyTrips
├── trips (array)
├── showCreateModal (boolean)
└── selectedTrip (object | null)
```

## 🚀 Development Workflow

```
1. Start MySQL Database
   ↓
2. Start Backend Server (npm run dev)
   ↓
3. Start Frontend Server (npm run dev)
   ↓
4. Make Changes
   ↓
5. Hot Reload (Automatic)
   ↓
6. Test in Browser
   ↓
7. Check Console/Terminal for Errors
   ↓
8. Commit Changes
```

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Config**: camelCase (e.g., `database.js`)
- **Routes**: camelCase (e.g., `authRoutes.js`)

### Variables
- **React Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Database Tables**: snake_case

### API Endpoints
- **Pattern**: `/api/resource/action`
- **Example**: `/api/trips/create`

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite bundler configuration, proxy setup |
| `tailwind.config.js` | Tailwind CSS theme customization |
| `postcss.config.js` | PostCSS plugins configuration |
| `.env` | Environment variables (backend) |
| `package.json` | Dependencies and scripts |

---

This structure is designed to be:
- ✅ **Modular** - Easy to add new features
- ✅ **Scalable** - Can grow with the application
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Beginner-friendly** - Well-organized and documented
