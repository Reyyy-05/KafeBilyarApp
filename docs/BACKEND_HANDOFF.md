# BACKEND HANDOFF DOCUMENTATION
# Kafe & Bilyar Booking System

**Last Updated:** November 20, 2025  
**For Backend Development Team**

---

# 1. PROJECT OVERVIEW

## Tech Stack (Frontend)
- React Native (Expo SDK 51)
- TypeScript
- Redux Toolkit + Redux Persist
- React Navigation
- React Native Paper

## Current Status
✅ Customer authentication (Login/Register/Logout)
✅ Admin authentication (2FA: Password + Face Recognition)
✅ Table browsing & booking flow
✅ Menu ordering with cart system
✅ Booking history & summary
✅ Attendance tracking (admin)
⏳ Waiting for backend API integration

---

# 2. API ENDPOINTS

## Base URL
Development: http://localhost:3000/api
Production: https://api.kafebilyar.com/api

## Authentication
All protected endpoints require: Authorization: Bearer <jwt-token>

---

## 2.1 CUSTOMER AUTH

### Register Customer
POST /auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08123456789"
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  }
}

---

### Login Customer
POST /auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  }
}

---

## 2.2 ADMIN AUTH

### Admin Login Step 1 (Credentials)
POST /admin/login

Request Body:
{
  "username": "admin",
  "password": "admin123"
}

Response 200:
{
  "success": true,
  "data": {
    "tempToken": "temp-jwt",
    "admin": {
      "id": "uuid",
      "username": "admin",
      "name": "Admin Utama",
      "role": "admin"
    },
    "requiresFaceVerification": true
  }
}

---

### Admin Login Step 2 (Face Verification)
POST /admin/verify-face

Request Body:
{
  "tempToken": "temp-jwt",
  "faceImage": "base64-encoded-image",
  "timestamp": "2025-11-20T22:15:00Z"
}

Response 200:
{
  "success": true,
  "data": {
    "admin": {
      "id": "uuid",
      "username": "admin",
      "name": "Admin Utama",
      "role": "admin"
    },
    "token": "full-jwt-token",
    "attendance": {
      "id": "uuid",
      "checkInTime": "2025-11-20T22:15:00Z",
      "matchScore": 0.95
    }
  }
}

---

## 2.3 TABLES

### Get All Tables
GET /tables?status=available&type=vip

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tableNumber": "A1",
      "name": "Meja VIP A1",
      "type": "vip",
      "capacity": 6,
      "pricePerHour": 50000,
      "status": "available",
      "image": "https://cdn.example.com/tables/a1.jpg"
    }
  ]
}

---

### Create Table (Admin)
POST /admin/tables
Headers: Authorization: Bearer <admin-token>

Request Body:
{
  "tableNumber": "A1",
  "name": "Meja VIP A1",
  "type": "vip",
  "capacity": 6,
  "pricePerHour": 50000,
  "image": "base64-or-url"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "tableNumber": "A1",
    "name": "Meja VIP A1",
    "type": "vip",
    "capacity": 6,
    "pricePerHour": 50000,
    "status": "available",
    "createdAt": "2025-11-20T10:00:00Z"
  }
}

---

## 2.4 BOOKINGS

### Create Booking
POST /bookings
Headers: Authorization: Bearer <customer-token>

Request Body:
{
  "tableId": "uuid",
  "bookingDate": "2025-11-21",
  "bookingTime": "14:00",
  "duration": 2,
  "menuItems": [
    {
      "menuId": "uuid",
      "quantity": 2
    }
  ]
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingCode": "BK-20251121-001",
    "tableId": "uuid",
    "tableName": "Meja VIP A1",
    "customerId": "uuid",
    "bookingDate": "2025-11-21",
    "bookingTime": "14:00",
    "duration": 2,
    "tablePrice": 100000,
    "menuTotal": 85000,
    "grandTotal": 185000,
    "status": "pending",
    "qrCode": "base64-qr-code",
    "createdAt": "2025-11-20T22:15:00Z"
  }
}

---

### Get My Bookings
GET /bookings/my-bookings?status=upcoming
Headers: Authorization: Bearer <customer-token>

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingCode": "BK-20251121-001",
      "tableName": "Meja VIP A1",
      "bookingDate": "2025-11-21",
      "bookingTime": "14:00",
      "duration": 2,
      "grandTotal": 185000,
      "status": "confirmed",
      "menuItems": [...]
    }
  ]
}

---

### Get All Bookings (Admin)
GET /admin/bookings?status=pending&date=2025-11-21
Headers: Authorization: Bearer <admin-token>

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingCode": "BK-20251121-001",
      "customer": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tableName": "Meja VIP A1",
      "bookingDate": "2025-11-21",
      "bookingTime": "14:00",
      "duration": 2,
      "grandTotal": 185000,
      "status": "pending"
    }
  ]
}

---

### Update Booking Status (Admin)
PATCH /admin/bookings/:id/status
Headers: Authorization: Bearer <admin-token>

Request Body:
{
  "status": "confirmed",
  "notes": "Booking approved"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed",
    "updatedAt": "2025-11-20T22:20:00Z"
  }
}

---

## 2.5 MENU

### Get All Menu Items
GET /menu?category=drinks

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Espresso",
      "description": "Kopi espresso premium",
      "price": 25000,
      "category": "drinks",
      "image": "https://cdn.example.com/menu/espresso.jpg",
      "isAvailable": true
    }
  ]
}

---

### Create Menu Item (Admin)
POST /admin/menu
Headers: Authorization: Bearer <admin-token>

Request Body:
{
  "name": "Espresso",
  "description": "Kopi espresso premium",
  "price": 25000,
  "category": "drinks",
  "image": "base64-or-url"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Espresso",
    "price": 25000,
    "category": "drinks",
    "isAvailable": true
  }
}

---

# 3. DATABASE SCHEMA

## PostgreSQL Tables

### customers
id UUID PRIMARY KEY
name VARCHAR(255) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
phone VARCHAR(20)
profile_image TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

---

### admins
id UUID PRIMARY KEY
username VARCHAR(50) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
name VARCHAR(255) NOT NULL
role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'kasir'))
face_data TEXT
is_active BOOLEAN DEFAULT true
created_by UUID REFERENCES admins(id)
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

---

### tables
id UUID PRIMARY KEY
table_number VARCHAR(10) UNIQUE NOT NULL
name VARCHAR(100) NOT NULL
type VARCHAR(20) CHECK (type IN ('vip', 'regular', 'family'))
capacity INT NOT NULL
price_per_hour DECIMAL(10,2) NOT NULL
status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance'))
image TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

---

### menu_items
id UUID PRIMARY KEY
name VARCHAR(100) NOT NULL
description TEXT
price DECIMAL(10,2) NOT NULL
category VARCHAR(20) CHECK (category IN ('drinks', 'food', 'dessert'))
image TEXT
is_available BOOLEAN DEFAULT true
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

---

### bookings
id UUID PRIMARY KEY
booking_code VARCHAR(50) UNIQUE NOT NULL
customer_id UUID REFERENCES customers(id)
table_id UUID REFERENCES tables(id)
booking_date DATE NOT NULL
booking_time TIME NOT NULL
duration INT NOT NULL
table_price DECIMAL(10,2) NOT NULL
menu_total DECIMAL(10,2) DEFAULT 0
grand_total DECIMAL(10,2) NOT NULL
status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
qr_code TEXT
notes TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

---

### booking_items
id UUID PRIMARY KEY
booking_id UUID REFERENCES bookings(id)
menu_item_id UUID REFERENCES menu_items(id)
quantity INT NOT NULL
price DECIMAL(10,2) NOT NULL
subtotal DECIMAL(10,2) NOT NULL
created_at TIMESTAMP DEFAULT NOW()

---

### attendance
id UUID PRIMARY KEY
admin_id UUID REFERENCES admins(id)
check_in_time TIMESTAMP NOT NULL
check_out_time TIMESTAMP
face_match_score DECIMAL(3,2)
date DATE NOT NULL
created_at TIMESTAMP DEFAULT NOW()

---

# 4. REDUX STATE STRUCTURE

auth: {
  user: { id, name, email } | null
  token: string | null
  isAuthenticated: boolean
}

adminAuth: {
  admin: { id, username, role, name } | null
  token: string | null
  isAuthenticated: boolean
  pendingVerification: boolean
}

cart: {
  items: [{ id, name, price, quantity, image }]
  total: number
}

bookingHistory: {
  bookings: [...]
}

attendance: {
  records: [...]
  currentSession: { adminId, checkInTime } | null
}

---

# 5. AUTHENTICATION FLOW

## Customer Auth
1. User enters email & password
2. POST /auth/login
3. Backend validates & returns JWT
4. Frontend stores token in Redux + AsyncStorage
5. All API calls include: Authorization: Bearer <token>
6. Logout: Clear state + reload

## Admin Auth (2FA)
1. Admin enters username & password
2. POST /admin/login → Get tempToken
3. Navigate to FaceVerificationScreen
4. Capture face photo
5. POST /admin/verify-face with tempToken + faceImage
6. Backend compares face with stored face_data
7. If match > 0.7: Return full token + create attendance
8. Frontend stores token + navigate to dashboard

---

# 6. MIGRATION FROM MOCK TO REAL API

## Create API Service
src/services/api.ts with axios + interceptors

## Replace Mock Functions
Before: dispatch(loginSuccess({ user: mockUser }))
After: const res = await api.post('/auth/login'); dispatch(loginSuccess(res.data.data))

## Update Screens
- LoginScreen → Real API
- RegisterScreen → Real API
- AdminLoginScreen → Real API
- FaceVerificationScreen → Real API
- BookingScreen → Fetch real tables
- MenuScreen → Fetch real menu
- BookingHistoryScreen → Fetch real bookings

---

# 7. ENVIRONMENT VARIABLES

## Frontend (.env)
API_BASE_URL=http://localhost:3000/api
FACE_API_THRESHOLD=0.70

## Backend (.env)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/kafebilyar
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
AWS_REKOGNITION_ACCESS_KEY=your-key
AWS_REKOGNITION_SECRET_KEY=your-secret

---

# 8. DEPLOYMENT

## Frontend
- Web: Vercel / Netlify
- Android: Expo EAS Build
- iOS: TestFlight

## Backend
- Server: AWS EC2 / DigitalOcean / Railway
- Database: AWS RDS / Supabase
- Storage: AWS S3 / Cloudinary
- Face API: AWS Rekognition / Azure Face API

---

# 9. CONTACT

Frontend Developer: [Your Name]
Email: [Your Email]
GitHub: [Repo Link]

Questions? Contact via Slack/Discord

Good luck with backend development! 🚀
