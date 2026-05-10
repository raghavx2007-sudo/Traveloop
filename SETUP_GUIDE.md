# Traveloop - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Quick Start Guide

### Step 1: Database Setup

1. **Start MySQL Server**
   - Windows: Start MySQL from Services or MySQL Workbench
   - Mac: `mysql.server start`
   - Linux: `sudo systemctl start mysql`

2. **Create Database and Tables**

   Open MySQL command line or MySQL Workbench and run:

   ```bash
   mysql -u root -p
   ```

   Then execute the schema file:

   ```sql
   source database/schema.sql
   ```

   Or manually copy and paste the contents of `database/schema.sql`

3. **Verify Database Creation**

   ```sql
   USE traveloop;
   SHOW TABLES;
   ```

   You should see 8 tables:
   - users
   - trips
   - trip_stops
   - activities
   - trip_activities
   - checklist_items
   - notes
   - budget_items

### Step 2: Backend Setup

1. **Navigate to server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `server` directory:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your settings:

   ```env
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=traveloop
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d

   # File Upload
   MAX_FILE_SIZE=5242880
   ```

   **Important:** Replace `your_mysql_password` with your actual MySQL password!

4. **Start the backend server**

   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

5. **Verify backend is running**

   Open browser and visit: `http://localhost:5000`

   You should see:
   ```json
   {
     "success": true,
     "message": "Traveloop API is running",
     "version": "1.0.0"
   }
   ```

### Step 3: Frontend Setup

1. **Open a new terminal** (keep backend running)

2. **Navigate to client directory**

   ```bash
   cd client
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**

   The app will automatically open at: `http://localhost:3000`

   If not, manually open your browser and visit that URL.

### Step 4: Test the Application

1. **Register a new account**
   - Click "Sign up" on the login page
   - Fill in your details
   - Click "Sign Up"

2. **Login**
   - Use your registered credentials
   - You'll be redirected to the dashboard

3. **Explore the features**
   - View the dashboard
   - Navigate to "My Trips"
   - Try creating a new trip

## 📁 Project Structure

```
traveloop/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── context/       # React Context (Auth)
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── uploads/          # File uploads
│   ├── server.js         # Entry point
│   └── package.json
│
├── database/
│   └── schema.sql        # Database schema
│
└── README.md
```

## 🔧 Troubleshooting

### Backend Issues

**Problem: "Cannot connect to database"**
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

**Problem: "Port 5000 already in use"**
- Change PORT in `.env` to another port (e.g., 5001)
- Kill the process using port 5000

**Problem: "JWT_SECRET is not defined"**
- Make sure you created `.env` file
- Check that JWT_SECRET is set in `.env`

### Frontend Issues

**Problem: "Cannot connect to API"**
- Ensure backend server is running on port 5000
- Check browser console for errors
- Verify proxy settings in `vite.config.js`

**Problem: "Module not found"**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Problem: "Port 3000 already in use"**
- Change port in `vite.config.js`
- Or kill the process using port 3000

### Database Issues

**Problem: "Access denied for user"**
- Check MySQL username and password
- Grant privileges: `GRANT ALL PRIVILEGES ON traveloop.* TO 'root'@'localhost';`

**Problem: "Unknown database 'traveloop'"**
- Run the schema.sql file again
- Or manually create: `CREATE DATABASE traveloop;`

## 🧪 Testing the API

You can test the API using tools like:
- **Postman** - [Download](https://www.postman.com/downloads/)
- **Thunder Client** (VS Code extension)
- **cURL** (command line)

### Example API Calls

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Current User (requires token):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📦 Phase 1 Features Completed

✅ **Backend:**
- Express server setup
- MySQL database connection
- User authentication (register/login)
- JWT token generation
- Password hashing with bcrypt
- Protected routes middleware
- Error handling
- Input validation
- File upload configuration

✅ **Frontend:**
- React app with Vite
- Tailwind CSS styling
- Authentication pages (Login/Register)
- Dashboard page
- My Trips page
- Protected routes
- Auth context
- Toast notifications
- Responsive sidebar layout

✅ **Database:**
- Complete schema with 8 tables
- Foreign key relationships
- Sample activity data
- Proper indexing

## 🎯 Next Steps (Phase 2)

The next phase will implement:
- Trip CRUD operations (Create, Read, Update, Delete)
- Trip detail page
- Trip listing with filters
- User profile management
- Dashboard statistics

## 📝 Development Commands

### Backend
```bash
cd server
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

### Frontend
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔐 Security Notes

- Never commit `.env` files to version control
- Change JWT_SECRET in production
- Use strong passwords for MySQL
- Enable HTTPS in production
- Implement rate limiting for production
- Add CORS restrictions for production

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

## 💡 Tips

1. **Keep both servers running** - Backend (port 5000) and Frontend (port 3000)
2. **Check browser console** for frontend errors
3. **Check terminal** for backend errors
4. **Use React DevTools** for debugging React components
5. **Test API endpoints** before integrating with frontend

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check that MySQL is running
5. Look for error messages in terminal/console

---

**Happy Coding! 🚀**

Start planning amazing trips with Traveloop!
