# 🧪 Testing Report – User Management API

This document describes the manual testing performed on the User Management API to validate functionality, security, and edge cases.

---

## 🔧 Testing Tools Used

- Postman
- curl
- Local Node.js server

---

## 🔐 Authentication Testing

### 1. User Registration

**Endpoint:**  
POST `/api/auth/register`

**Test Cases:**
- ✅ Register with valid email, password, and name
- ❌ Register with invalid email
- ❌ Register with weak password
- ❌ Register with existing email

**Expected Result:**
- Valid registration creates a user with hashed password
- Invalid inputs are rejected with appropriate error messages

---

### 2. Account Activation

**Endpoint:**  
GET `/api/auth/activate?token=<activation_token>`

**Test Cases:**
- ✅ Activate account using valid token
- ❌ Activate using invalid or expired token

**Expected Result:**
- Account is activated successfully
- Invalid tokens are rejected

---

### 3. Login

**Endpoint:**  
POST `/api/auth/login`

**Test Cases:**
- ✅ Login with valid credentials
- ❌ Login with incorrect password
- ❌ Login with unregistered email

**Expected Result:**
- JWT token is returned on successful login
- Invalid credentials are rejected

---

### 4. Profile Access

**Endpoint:**  
GET `/api/auth/profile`

**Test Cases:**
- ✅ Access profile with valid JWT
- ❌ Access profile without token
- ❌ Access profile with invalid token

**Expected Result:**
- Authenticated user receives profile data
- Unauthorized access is blocked

---

## 🔑 Password Management Testing

### 5. Change Password

**Endpoint:**  
POST `/api/auth/change-password`

**Test Cases:**
- ✅ Change password with correct old password
- ❌ Change password with incorrect old password
- ❌ Change password with weak new password

**Expected Result:**
- Password is updated and stored as hashed
- Invalid inputs are rejected

---

### 6. Forgot Password

**Endpoint:**  
POST `/api/auth/forgot-password`

**Test Cases:**
- ✅ Request password reset with registered email
- ❌ Request password reset with unregistered email

**Expected Result:**
- Same success message returned for both cases (security best practice)

---

### 7. Reset Password

**Endpoint:**  
POST `/api/auth/reset-password`

**Test Cases:**
- ✅ Reset password using valid reset token
- ❌ Reset password using invalid or expired token

**Expected Result:**
- Password updated successfully
- Invalid tokens rejected

---

## 👥 User Management Testing

### 8. Get Users (Pagination & Search)

**Endpoint:**  
GET `/api/users`

**Test Cases:**
- ✅ Fetch users with pagination
- ✅ Fetch users using search query
- ❌ Access without authentication

**Expected Result:**
- Paginated user list returned
- Search filters users correctly
- Unauthorized access blocked

---

### 9. Update User

**Endpoint:**  
PUT `/api/users/:id`

**Test Cases:**
- ✅ User updates own profile
- ✅ Admin updates any user
- ❌ User attempts to update another user

**Expected Result:**
- Only admin or owner can update user
- Role and password fields cannot be updated directly

---

### 10. Delete User

**Endpoint:**  
DELETE `/api/users/:id`

**Test Cases:**
- ✅ Admin deletes a user
- ❌ User attempts self-deletion
- ❌ Non-admin attempts deletion

**Expected Result:**
- Only admins can delete users
- Self-deletion is prevented

---

## 👑 Admin Testing

### 11. Admin Statistics

**Endpoint:**  
GET `/api/admin/stats`

**Test Cases:**
- ✅ Admin accesses statistics
- ❌ Non-admin attempts access

**Expected Result:**
- Admin receives system and user statistics
- Non-admin access is forbidden

---

## 🛡️ Security Testing

- ✅ JWT verification enforced on protected routes
- ✅ Rate limiting applied to auth endpoints
- ✅ Passwords never returned in API responses
- ✅ Role-based access control enforced

---

## 🧩 Puzzle Testing

- ✅ Secret header discovered via response headers
- ✅ Hidden endpoint accessed successfully
- ✅ Base64 encoded message decoded
- ✅ Multiple access methods validated

---

## ✅ Summary

All endpoints were tested manually and behave as expected.  
Security, validation, authentication, and authorization rules are enforced correctly.
