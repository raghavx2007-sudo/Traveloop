# Traveloop Frontend

React.js frontend for the Traveloop travel planning platform.

## Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
client/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── MyTrips.jsx
│   ├── layouts/         # Layout components
│   │   └── MainLayout.jsx
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features Implemented (Phase 1)

- ✅ Authentication (Login/Register)
- ✅ Protected Routes
- ✅ Dashboard Layout
- ✅ Responsive Sidebar Navigation
- ✅ Toast Notifications
- ✅ Modern UI with Tailwind CSS

## Environment

The Vite dev server proxies API requests to `http://localhost:5000`

Make sure the backend server is running before starting the frontend.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

## Next Steps

Phase 2 will add:
- Trip CRUD operations
- Trip detail pages
- Itinerary builder
- Activity management
