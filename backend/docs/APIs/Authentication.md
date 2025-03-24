
# Authentication APIs

### Update time: 03/24/2025

## General
- All endpoints require **authentication** via `Authorization: Bearer <token>` in the request header, including login.
- Content-Type: `application/json`
- Sample response if the authentication header is not included or the token is invalid:

```json
{
    "error": "Unauthorized access."
}
{
    "error": "Invalid or expired token."
}
```

---

## 1. Register User

### Description:
Register a new user.

### Path & Method:
POST: `/api/auth/register`

### Authentication Required:
No

### Parameters:
Request body:
| Name     | Type   | Required | Description               |
|----------|--------|----------|---------------------------|
| username | string | Yes      | Username for the new user |
| email    | string | Yes      | Email address             |
| password | string | Yes      | Password                  |

Sample request body:
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Responses:
| Name    | Type   | Required | Description              |
|---------|--------|----------|--------------------------|
| message | string | Yes      | Response message         |
| token   | string | Yes      | JWT token for the session|

Sample response:
```json
{
    "message": "User registered successfully",
    "token": "<jwt_token>"
}
```

Failure response:
```json
{
    "message": "User already exists"
}
{
    "message": "Server error"
}
```

---

## 2. Login User

### Description:
Login an existing user.

### Path & Method:
POST: `/api/auth/login`

### Authentication Required:
Yes (Token required in Authorization header)

### Parameters:
Request body:
| Name     | Type   | Required | Description          |
|----------|--------|----------|----------------------|
| email    | string | Yes      | Email address        |
| password | string | Yes      | Password             |

Sample request body:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Responses:
| Name    | Type   | Required | Description              |
|---------|--------|----------|--------------------------|
| message | string | Yes      | Response message         |
| token   | string | Yes      | JWT token for the session|

Sample response:
```json
{
    "message": "User logged in successfully",
    "token": "<jwt_token>"
}
```

Failure response:
```json
{
    "message": "Invalid email or password"
}
{
    "message": "Server error"
}
```

---

## 3. Logout User

### Description:
Logout the current user (handled client-side by discarding the JWT token).

### Path & Method:
POST: `/api/auth/logout`

### Authentication Required:
Yes

### Responses:
| Name    | Type   | Required | Description      |
|---------|--------|----------|------------------|
| message | string | Yes      | Response message |

Sample response:
```json
{
    "message": "User logged out successfully"
}
```

---

## Authentication Middleware

This middleware verifies JWT tokens for protected routes.
- Extracts token from `Authorization` header.
- Verifies token using `jwtUtils.verifyToken`.
- Attaches `userEmail` and `userId` to the request object if successful.

Note: All protected endpoints, including login, require the JWT token in the Authorization header.

Failure response:
```json
{
    "error": "Unauthorized access."
}
{
    "error": "Invalid or expired token."
}
```
## 4. Reset Password

### Description:
Reset Password a existing user.

### Path & Method:
POST: `/api/auth/reset-password`

### Authentication Required:
No

### Parameters:
Request body:
| Name     | Type   | Required | Description               |
|----------|--------|----------|---------------------------|
| username | string | Yes      | Username for the new user |
| email    | string | Yes      | Email address             |
| newPassword | string | Yes      | New Password                  |

Sample request body:
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "newPassword": "newPassword123"
}
```

### Responses:
| Name    | Type   | Required | Description              |
|---------|--------|----------|--------------------------|
| message | string | Yes      | Response message         |
| token   | string | Yes      | JWT token for the session|

Sample response:
```json
{
    "message": "Password updated successfully",
    "token": "<jwt_token>"
}
```

Failure response:
```json
{
    "message": "Missing required fields"
}
{
    "message": "Server error"
}
{
    "message": "User not found with provided username and email"
}
{
    "message": "Error updating password:"
}
```

---