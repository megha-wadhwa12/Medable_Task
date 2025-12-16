# 🔐 User Management API

A secure User Management API built with Node.js and Express as part of a backend assessment.  
The project fixes multiple security bugs, implements missing features, and includes hidden puzzle challenges.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- express-rate-limit
- In-memory data store (for assessment scope)

---

## ⚙️ Setup & Run

### Prerequisites

- Node.js v18+
- npm
- Netlify CLI (for local development)

### Installation

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:8888`

### 🔐 Authentication Flow

- User registers → account created (inactive)

- User activates account using activation token

- User logs in → receives JWT token

- JWT token required for all protected routes

- Role-based access enforced via middleware

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login

Login with email and password and receive JWT token

```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

#### POST /api/auth/register

Register a new user

```json
{
  "email": "newuser@test.com",
  "password": "securepassword123",
  "name": "New User"
}
```

#### GET /api/auth/profile

Get logged-in user profile
🔒 Requires JWT

#### POST /api/auth/change-password

Change password for logged-in user
🔒 Requires JWT

```
{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123"
}

```

#### POST /api/auth/forgot-password

Request password reset link  
Always returns success message for security

#### POST /api/auth/reset-password

Reset password using reset token

### 👥 User Management Routes

#### 🔒 All routes require JWT authentication

#### GET /api/users

- Supports pagination & search

- Query params:

- page

- limit

- search

`/api/users?page=1&limit=10&search=test`

#### Get user by ID

`GET /api/users/:id`

#### PUT /api/users/:id

Update user (admin or self only)

#### DELETE /api/users/:id

Delete user  
🔐 Admin only  
❌ Self-deletion blocked

### Admin Routes

#### GET /api/admin/stats

Admin-only statistics endpoint

Returns:

- Total users
- Admin users
- Regular users
- System info

### 🛡️ Security Features Implemented

- JWT-based authentication

- Role-based access control

- Password hashing (bcrypt)

- Rate limiting on auth endpoints

- Input validation (email, password strength)

- Centralized user data

- No password exposure in responses

- Secure password reset & activation tokens

- Rate limiting applied on authentication endpoints to prevent brute-force attacks


### 🧩 Puzzle Solutions

#### Puzzle 1: Secret Header

##### Header:

- X-Secret-Challenge: find_me_if_you_can_2024

#### Puzzle 2: Hidden Endpoint

`/api/users/secret-stats`

#### Puzzle 3: Decoded Message

`Congratulations! You found the secret endpoint.The final clue is: SHC_Header_Puzzle_2024`

#### Puzzle 4: Access Methods

- The secret endpoint can be accessed via:

- Custom request header

- Query parameter override

#### 🧪 Testing

All endpoints were tested manually using:

- Postman

- curl

##### Edge cases tested:

- Invalid tokens

- Expired tokens

- Weak passwords

- Unauthorized access

- Admin-only access violations

Detailed testing steps are documented in TESTING.md.

#### 📌 Notes

- In-memory data store used intentionally (assessment scope)

- Swagger & unit tests were scoped out due to time constraints

- Code follows security best practices and clean architecture

#### ✅ Status

- ✔ All bugs fixed
- ✔ All required features implemented
- ✔ All puzzles solved
- ✔ All nice-to-have features completed

---

#### **Author:** Megha Wadhwa
**Assessment:** Backend User Management API
