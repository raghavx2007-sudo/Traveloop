# Traveloop Backend API

Express.js REST API for the Traveloop travel planning platform.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=traveloop
JWT_SECRET=your_secret_key_here
```

### 3. Set Up Database

Run the SQL schema file to create database and tables:

```bash
mysql -u root -p < ../database/schema.sql
```

Or manually:
1. Open MySQL Workbench or command line
2. Run the contents of `database/schema.sql`

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

## Project Structure

```
server/
├── config/
│   └── database.js          # MySQL connection setup
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── upload.js            # File upload configuration
├── routes/
│   └── authRoutes.js        # Authentication routes
├── uploads/                 # Uploaded files directory
├── utils/
│   └── validation.js        # Input validation rules
├── .env                     # Environment variables (create this)
├── .env.example             # Environment template
├── server.js                # Main application entry
└── package.json             # Dependencies
```

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Example cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Next Steps

Phase 2 will add:
- Trip CRUD operations
- Dashboard endpoints
- User profile management
