# Traveloop API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

### Login User

Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profile_image": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Get Current User

Get authenticated user's profile information.

**Endpoint:** `GET /api/auth/me`

**Access:** Protected (requires token)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_image": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

**Error Response (401 - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid token. Authorization denied."
}
```

**Error Response (401 - Expired Token):**
```json
{
  "success": false,
  "message": "Token expired. Please login again."
}
```

---

## 🔒 Authentication Flow

### 1. Register/Login
```javascript
// Register
const response = await axios.post('/api/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
})

// Store token
localStorage.setItem('token', response.data.data.token)
```

### 2. Set Token in Headers
```javascript
// Set default header for all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

### 3. Make Authenticated Requests
```javascript
// Token is automatically included
const response = await axios.get('/api/auth/me')
```

### 4. Handle Token Expiration
```javascript
// Axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 📋 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

---

## 🚨 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH requests |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Testing with JavaScript (Axios)

### Setup
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### Register
```javascript
try {
  const response = await api.post('/auth/register', {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
  
  console.log('User registered:', response.data)
  const token = response.data.data.token
  
  // Store token
  localStorage.setItem('token', token)
} catch (error) {
  console.error('Registration failed:', error.response.data)
}
```

### Login
```javascript
try {
  const response = await api.post('/auth/login', {
    email: 'john@example.com',
    password: 'password123'
  })
  
  console.log('Login successful:', response.data)
  const token = response.data.data.token
  
  // Store token
  localStorage.setItem('token', token)
  
  // Set for future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
} catch (error) {
  console.error('Login failed:', error.response.data)
}
```

### Get Current User
```javascript
try {
  const token = localStorage.getItem('token')
  
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  
  console.log('User data:', response.data)
} catch (error) {
  console.error('Failed to get user:', error.response.data)
}
```

---

## 🔧 Postman Collection

### Setup Environment Variables
```
base_url: http://localhost:5000/api
token: (will be set automatically)
```

### Register Request
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Test Script (save token)
pm.environment.set("token", pm.response.json().data.token);
```

### Login Request
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

// Test Script (save token)
pm.environment.set("token", pm.response.json().data.token);
```

### Get User Request
```
GET {{base_url}}/auth/me
Authorization: Bearer {{token}}
```

---

## 🔐 JWT Token Structure

### Token Payload
```json
{
  "id": 1,
  "email": "john@example.com",
  "iat": 1642234567,
  "exp": 1642839367
}
```

### Token Properties
- `id`: User ID
- `email`: User email
- `iat`: Issued at (timestamp)
- `exp`: Expiration time (timestamp)

### Token Expiration
Default: 7 days (configurable in `.env`)

---

## 📊 Database Schema Reference

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🛡️ Security Best Practices

### Password Security
- Passwords are hashed using bcrypt with salt rounds = 10
- Never store plain text passwords
- Minimum password length: 6 characters

### Token Security
- Tokens expire after 7 days (default)
- Store tokens in localStorage (frontend)
- Include token in Authorization header
- Validate token on every protected request

### API Security
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- CORS enabled for specific origins
- Error messages don't expose sensitive info

---

## 🐛 Common Errors & Solutions

### Error: "No token provided"
**Solution:** Include Authorization header with Bearer token

### Error: "Invalid token"
**Solution:** Token is malformed or tampered with. Login again.

### Error: "Token expired"
**Solution:** Token has expired. User must login again.

### Error: "User with this email already exists"
**Solution:** Use a different email address for registration

### Error: "Invalid email or password"
**Solution:** Check credentials and try again

### Error: "Validation failed"
**Solution:** Check the errors array for specific field validation issues

---

## 📝 Rate Limiting (Future)

Currently not implemented. In production, consider:
- 100 requests per 15 minutes per IP
- 5 login attempts per 15 minutes per IP
- Implement using `express-rate-limit`

---

## 🚀 Coming in Phase 2

### Trip Endpoints
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Trip Stop Endpoints
- `POST /api/trips/:id/stops` - Add stop to trip
- `PUT /api/trips/:id/stops/:stopId` - Update stop
- `DELETE /api/trips/:id/stops/:stopId` - Delete stop

### Activity Endpoints
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get single activity
- `POST /api/trips/:id/activities` - Add activity to trip

---

## 📞 Support

For issues or questions:
1. Check the error message and status code
2. Verify request format matches documentation
3. Check backend terminal for detailed errors
4. Ensure MySQL database is running
5. Verify environment variables are set correctly

---

**Last Updated:** Phase 1 - Authentication System
**API Version:** 1.0.0
