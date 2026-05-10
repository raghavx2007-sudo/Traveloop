# 🚀 Traveloop - Quick Start Guide

Get up and running in 5 minutes!

## ⚡ Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js (should be v16+)
node --version

# Check npm
npm --version

# Check MySQL (should be v8+)
mysql --version
```

If any are missing, install them first:
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/

---

## 🎯 5-Minute Setup

### Step 1: Database Setup (2 minutes)

```bash
# Start MySQL
# Windows: Start from Services or MySQL Workbench
# Mac: mysql.server start
# Linux: sudo systemctl start mysql

# Login to MySQL
mysql -u root -p

# Run these commands in MySQL:
CREATE DATABASE traveloop;
USE traveloop;
source database/schema.sql;
exit;
```

### Step 2: Backend Setup (1 minute)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set your MySQL password
# Then start the server
npm run dev
```

**Expected output:**
```
✅ MySQL Database connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

### Step 3: Frontend Setup (2 minutes)

Open a **new terminal** (keep backend running):

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4: Open & Test

1. Open browser: http://localhost:3000
2. Click "Sign up"
3. Create an account
4. Explore the dashboard!

---

## 🎨 What You'll See

### Login Page
- Clean, modern design
- Email and password fields
- Link to registration

### Dashboard
- Welcome message with your name
- Stats cards (trips, countries, budget)
- Popular destinations
- Quick action cards

### My Trips
- Empty state with "Create Trip" button
- Modal to create new trips

---

## 🔧 Configuration

### Backend (.env file)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=traveloop
JWT_SECRET=change_this_to_random_string
```

**Important:** Change `DB_PASSWORD` to your MySQL password!

### Frontend (automatic)

Vite automatically proxies API requests from port 3000 to port 5000.

---

## ✅ Verify Everything Works

### Test Backend

Open browser: http://localhost:5000

Should see:
```json
{
  "success": true,
  "message": "Traveloop API is running",
  "version": "1.0.0"
}
```

### Test Frontend

Open browser: http://localhost:3000

Should see the login page.

### Test Database

```bash
mysql -u root -p
USE traveloop;
SHOW TABLES;
```

Should see 8 tables:
- users
- trips
- trip_stops
- activities
- trip_activities
- checklist_items
- notes
- budget_items

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot connect to database"**
```bash
# Check MySQL is running
mysql -u root -p

# Check credentials in .env file
# Make sure DB_PASSWORD matches your MySQL password
```

**Error: "Port 5000 already in use"**
```bash
# Change PORT in .env to 5001
# Or kill the process using port 5000
```

### Frontend won't start

**Error: "Cannot connect to API"**
```bash
# Make sure backend is running on port 5000
# Check terminal for backend errors
```

**Error: "Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors

**Error: "Access denied"**
```bash
# Reset MySQL password or update .env
# Grant privileges:
mysql -u root -p
GRANT ALL PRIVILEGES ON traveloop.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Error: "Unknown database"**
```bash
# Create database again
mysql -u root -p
CREATE DATABASE traveloop;
USE traveloop;
source database/schema.sql;
```

---

## 📱 Test the Application

### 1. Register a New User

- Click "Sign up"
- Enter:
  - Name: Test User
  - Email: test@example.com
  - Password: test123
- Click "Sign Up"

### 2. Explore Dashboard

- See welcome message
- View stats (all zeros for now)
- Check popular destinations

### 3. Try Creating a Trip

- Click "My Trips" in sidebar
- Click "Create New Trip"
- Fill in trip details
- (Note: Full functionality comes in Phase 2)

---

## 🎯 What's Working (Phase 1)

✅ User registration
✅ User login
✅ JWT authentication
✅ Protected routes
✅ Dashboard layout
✅ Sidebar navigation
✅ Toast notifications
✅ Responsive design

---

## 🚧 Coming Next (Phase 2)

- Create, edit, delete trips
- View trip details
- Add destinations to trips
- Budget tracking
- Activity management

---

## 📚 Useful Commands

### Backend
```bash
cd server
npm run dev      # Start with auto-reload
npm start        # Start production mode
```

### Frontend
```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
```

### Database
```bash
mysql -u root -p                    # Login to MySQL
USE traveloop;                      # Switch to database
SHOW TABLES;                        # List all tables
SELECT * FROM users;                # View users
DESCRIBE users;                     # View table structure
```

---

## 🔗 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api
- **MySQL:** localhost:3306

---

## 📖 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_STRUCTURE.md** - Architecture overview
- **API_REFERENCE.md** - Complete API documentation
- **README.md** - Project overview

---

## 💡 Pro Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Check browser console** - For frontend errors
3. **Check terminal** - For backend errors
4. **Use React DevTools** - Install browser extension for debugging
5. **Test API first** - Use Postman or cURL before frontend integration

---

## 🎉 Success!

If you can:
- ✅ Register a new user
- ✅ Login successfully
- ✅ See the dashboard
- ✅ Navigate between pages

**Congratulations! Your Traveloop setup is complete!** 🎊

---

## 🆘 Still Having Issues?

1. **Read error messages carefully** - They usually tell you what's wrong
2. **Check all prerequisites** - Node.js, MySQL, npm
3. **Verify .env file** - Especially database credentials
4. **Restart servers** - Sometimes a fresh start helps
5. **Check firewall** - Make sure ports 3000, 5000, 3306 are open

---

## 📞 Next Steps

1. Explore the codebase
2. Read the documentation
3. Try modifying the UI
4. Wait for Phase 2 features
5. Start building your own features!

---

**Happy Coding! 🚀**

Welcome to Traveloop - Your journey starts here!
