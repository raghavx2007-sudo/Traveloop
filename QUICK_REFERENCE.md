# 🚀 Traveloop - Quick Reference Guide

## 📋 Quick Commands

### Start Development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** localhost:3306

---

## 🎯 Current Features (Phase 1 & 2)

### Authentication
- ✅ User registration
- ✅ User login
- ✅ JWT tokens
- ✅ Protected routes
- ✅ Auto logout

### Trip Management
- ✅ Create trips
- ✅ Upload cover images
- ✅ Edit trips
- ✅ Delete trips
- ✅ Search trips
- ✅ Sort trips

### Destinations
- ✅ Add destinations
- ✅ Remove destinations
- ✅ View timeline
- ✅ Date ranges

### Dashboard
- ✅ Total trips
- ✅ Countries visited
- ✅ Total budget
- ✅ Upcoming trips
- ✅ Recent trips
- ✅ Popular destinations

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Trips
```
POST   /api/trips                    - Create trip
GET    /api/trips                    - Get all trips
GET    /api/trips/:id                - Get single trip
PUT    /api/trips/:id                - Update trip
DELETE /api/trips/:id                - Delete trip
GET    /api/trips/stats/dashboard    - Dashboard stats
```

### Destinations
```
POST   /api/trips/:tripId/stops         - Add destination
PUT    /api/trips/:tripId/stops/:id     - Update destination
DELETE /api/trips/:tripId/stops/:id     - Delete destination
PUT    /api/trips/:tripId/stops/reorder - Reorder destinations
```

---

## 🗂️ Project Structure

```
traveloop/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Login, Register, Dashboard, MyTrips, TripDetail
│   │   ├── layouts/    # MainLayout
│   │   ├── context/    # AuthContext
│   │   └── services/   # API services
│   └── package.json
│
├── server/              # Express backend
│   ├── controllers/    # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Auth, upload, validation
│   └── uploads/        # Uploaded images
│
└── database/
    └── schema.sql      # Database schema
```

---

## 🎨 Pages

### Public Pages
- `/login` - Login page
- `/register` - Registration page

### Protected Pages
- `/dashboard` - Dashboard with stats
- `/my-trips` - Trip listing
- `/trips/:id` - Trip detail page

---

## 🔧 Common Tasks

### Create a Trip
1. Go to "My Trips"
2. Click "Create New Trip"
3. Fill in details
4. Upload image (optional)
5. Click "Create Trip"

### Add Destination
1. Open trip detail page
2. Go to "Itinerary" tab
3. Click "Add Destination"
4. Enter city and country
5. Add dates (optional)
6. Click "Add Destination"

### Edit Trip
1. Open trip detail page
2. Click "Edit Trip"
3. Modify details
4. Save changes

### Delete Trip
1. Go to "My Trips"
2. Click "Delete" on trip card
3. Confirm deletion

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check MySQL is running
mysql -u root -p

# Check .env file exists
ls server/.env

# Reinstall dependencies
cd server
rm -rf node_modules
npm install
```

### Frontend Won't Start
```bash
# Reinstall dependencies
cd client
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force
```

### Images Not Showing
```bash
# Check uploads directory
ls server/uploads/

# Verify static serving in server.js
# Should have: app.use('/uploads', express.static(...))
```

### Database Errors
```sql
-- Check database exists
SHOW DATABASES;

-- Check tables exist
USE traveloop;
SHOW TABLES;

-- Reset database
DROP DATABASE traveloop;
CREATE DATABASE traveloop;
source database/schema.sql;
```

---

## 📚 Documentation

- **START_HERE.md** - Quick start guide
- **SETUP_GUIDE.md** - Detailed setup
- **API_REFERENCE.md** - API documentation
- **PHASE_1_SUMMARY.md** - Phase 1 features
- **PHASE_2_COMPLETE.md** - Phase 2 features
- **DEVELOPER_CHECKLIST.md** - Testing checklist

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=traveloop
JWT_SECRET=your_secret_key
```

---

## 📊 Database Tables

1. **users** - User accounts
2. **trips** - Trip information
3. **trip_stops** - Destinations
4. **activities** - Activity catalog
5. **trip_activities** - Trip activities
6. **checklist_items** - Packing lists
7. **notes** - Travel notes
8. **budget_items** - Budget tracking

---

## 🎯 Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Access protected pages
- [ ] Logout

### Trips
- [ ] Create trip
- [ ] Upload cover image
- [ ] View trip list
- [ ] Search trips
- [ ] Sort trips
- [ ] Edit trip
- [ ] Delete trip

### Destinations
- [ ] Add destination
- [ ] View destination timeline
- [ ] Remove destination

### Dashboard
- [ ] View statistics
- [ ] See recent trips
- [ ] Check popular destinations

---

## 💡 Pro Tips

1. **Keep both terminals open** - Backend and frontend
2. **Check browser console** - For frontend errors
3. **Check terminal** - For backend errors
4. **Use React DevTools** - For debugging
5. **Test API with Postman** - Before frontend integration

---

## 🚀 Next Phase

### Phase 3 Features
- Activity management
- Budget tracking
- Packing checklist
- Travel notes

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Can't login | Check credentials, verify user exists |
| Images not loading | Check uploads directory, verify path |
| Stats showing 0 | Create some trips first |
| API errors | Check backend logs, verify token |
| Database errors | Check MySQL running, verify credentials |

---

## 🎉 Current Status

**Phase 1:** ✅ Complete (Authentication)
**Phase 2:** ✅ Complete (Trip Management)
**Phase 3:** 🚧 Next (Activities & Features)

**Overall Progress:** 50%

---

*Last Updated: Phase 2 Complete*
*Quick Reference Version: 2.0.0*
