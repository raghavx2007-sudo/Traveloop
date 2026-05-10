# 📦 Traveloop - Installation Commands

Copy and paste these commands to set up Traveloop quickly.

---

## 🗄️ Database Setup

### Windows (Command Prompt)
```cmd
mysql -u root -p
```

### Mac/Linux (Terminal)
```bash
mysql -u root -p
```

### Inside MySQL
```sql
CREATE DATABASE traveloop;
USE traveloop;
source database/schema.sql;
SHOW TABLES;
exit;
```

---

## 🔧 Backend Setup

### Navigate to Server Directory
```bash
cd server
```

### Install Dependencies
```bash
npm install
```

### Create Environment File
```bash
# Windows (Command Prompt)
copy .env.example .env

# Mac/Linux (Terminal)
cp .env.example .env
```

### Edit .env File
Open `.env` in your editor and update:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=traveloop
JWT_SECRET=your_random_secret_key_here
```

### Start Development Server
```bash
npm run dev
```

### Expected Output
```
✅ MySQL Database connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

---

## 💻 Frontend Setup

### Open New Terminal
Keep the backend terminal running!

### Navigate to Client Directory
```bash
cd client
```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Expected Output
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## ✅ Verification Commands

### Check Backend is Running
```bash
# In browser or using curl
curl http://localhost:5000
```

Expected response:
```json
{
  "success": true,
  "message": "Traveloop API is running",
  "version": "1.0.0"
}
```

### Check Database Tables
```sql
mysql -u root -p
USE traveloop;
SHOW TABLES;
```

Expected output:
```
+--------------------+
| Tables_in_traveloop|
+--------------------+
| activities         |
| budget_items       |
| checklist_items    |
| notes              |
| trip_activities    |
| trip_stops         |
| trips              |
| users              |
+--------------------+
8 rows in set
```

### Check Sample Data
```sql
SELECT COUNT(*) FROM activities;
```

Expected: 10 rows

---

## 🧪 Test API with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Get Current User (replace YOUR_TOKEN)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 Restart Commands

### Restart Backend
```bash
# Stop: Ctrl+C
# Start:
cd server
npm run dev
```

### Restart Frontend
```bash
# Stop: Ctrl+C
# Start:
cd client
npm run dev
```

### Restart MySQL

**Windows:**
```cmd
# Services → MySQL → Restart
# Or in MySQL Workbench
```

**Mac:**
```bash
mysql.server restart
```

**Linux:**
```bash
sudo systemctl restart mysql
```

---

## 🧹 Clean Install Commands

### Backend Clean Install
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Frontend Clean Install
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Troubleshooting Commands

### Check Node Version
```bash
node --version
# Should be v16 or higher
```

### Check npm Version
```bash
npm --version
```

### Check MySQL Version
```bash
mysql --version
# Should be v8 or higher
```

### Check if Port is in Use

**Windows:**
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

**Mac/Linux:**
```bash
lsof -i :5000
lsof -i :3000
```

### Kill Process on Port

**Windows:**
```cmd
# Find PID from netstat command above
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:3000)
```

### Check MySQL is Running

**Windows:**
```cmd
# Check Services or Task Manager
```

**Mac:**
```bash
mysql.server status
```

**Linux:**
```bash
sudo systemctl status mysql
```

### View Backend Logs
```bash
cd server
npm run dev
# Watch terminal output
```

### View Frontend Logs
```bash
cd client
npm run dev
# Watch terminal output
# Also check browser console (F12)
```

---

## 📦 Production Build Commands

### Build Frontend
```bash
cd client
npm run build
```

Output will be in `client/dist/`

### Preview Production Build
```bash
cd client
npm run preview
```

### Start Backend in Production Mode
```bash
cd server
npm start
```

---

## 🗑️ Cleanup Commands

### Remove node_modules
```bash
# Backend
cd server
rm -rf node_modules

# Frontend
cd client
rm -rf node_modules
```

### Remove Build Files
```bash
cd client
rm -rf dist
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Drop Database (⚠️ Careful!)
```sql
mysql -u root -p
DROP DATABASE traveloop;
```

---

## 🔐 Security Commands

### Generate Random JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or online
# Visit: https://www.grc.com/passwords.htm
```

### Check for Vulnerabilities
```bash
# Backend
cd server
npm audit

# Frontend
cd client
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

---

## 📊 Database Management Commands

### Backup Database
```bash
mysqldump -u root -p traveloop > backup.sql
```

### Restore Database
```bash
mysql -u root -p traveloop < backup.sql
```

### Reset Database
```sql
mysql -u root -p
DROP DATABASE traveloop;
CREATE DATABASE traveloop;
USE traveloop;
source database/schema.sql;
exit;
```

### View All Users
```sql
mysql -u root -p
USE traveloop;
SELECT id, name, email, created_at FROM users;
```

### Delete All Users (⚠️ Careful!)
```sql
DELETE FROM users;
```

---

## 🚀 Quick Commands Reference

### Start Everything
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Stop Everything
```
Ctrl+C in both terminals
```

### Full Reset
```bash
# 1. Drop database
mysql -u root -p
DROP DATABASE traveloop;
CREATE DATABASE traveloop;
USE traveloop;
source database/schema.sql;
exit;

# 2. Clean install backend
cd server
rm -rf node_modules package-lock.json
npm install

# 3. Clean install frontend
cd client
rm -rf node_modules package-lock.json
npm install

# 4. Start servers
cd server && npm run dev
cd client && npm run dev
```

---

## 📝 Git Commands (Optional)

### Initialize Git
```bash
git init
```

### Add All Files
```bash
git add .
```

### Commit
```bash
git commit -m "Initial commit - Phase 1 complete"
```

### Create .gitignore
Already created! Includes:
- node_modules/
- .env
- uploads/*
- dist/

---

## 🎯 One-Line Install (Advanced)

### Backend
```bash
cd server && npm install && cp .env.example .env && echo "Edit .env file now!" && npm run dev
```

### Frontend
```bash
cd client && npm install && npm run dev
```

---

## 💡 Useful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
# Traveloop aliases
alias traveloop-backend="cd ~/traveloop/server && npm run dev"
alias traveloop-frontend="cd ~/traveloop/client && npm run dev"
alias traveloop-db="mysql -u root -p traveloop"
```

Then use:
```bash
traveloop-backend
traveloop-frontend
traveloop-db
```

---

## 🔍 Monitoring Commands

### Watch Backend Logs
```bash
cd server
npm run dev | tee backend.log
```

### Watch Frontend Logs
```bash
cd client
npm run dev | tee frontend.log
```

### Monitor Database Connections
```sql
SHOW PROCESSLIST;
```

### Check Database Size
```sql
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'traveloop'
GROUP BY table_schema;
```

---

## 📦 Package Management

### Update All Dependencies

**Backend:**
```bash
cd server
npm update
```

**Frontend:**
```bash
cd client
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

### Install Specific Version
```bash
npm install package-name@version
```

---

## 🎉 Success Checklist

Run these commands to verify everything works:

```bash
# 1. Check Node
node --version

# 2. Check npm
npm --version

# 3. Check MySQL
mysql --version

# 4. Check database
mysql -u root -p -e "USE traveloop; SHOW TABLES;"

# 5. Check backend
curl http://localhost:5000

# 6. Check frontend
# Open http://localhost:3000 in browser
```

If all commands succeed, you're ready to go! 🚀

---

**Quick Reference Card**

```
Start Backend:    cd server && npm run dev
Start Frontend:   cd client && npm run dev
Access App:       http://localhost:3000
Access API:       http://localhost:5000
Database:         mysql -u root -p traveloop
```

---

*Last Updated: Phase 1 Complete*
*Commands Version: 1.0.0*
