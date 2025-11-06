# KeelCompass Architecture Documentation

This document provides a comprehensive overview of the KeelCompass architecture, design decisions, and system components.

## Table of Contents

- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [API Design](#api-design)
- [File Storage](#file-storage)
- [Error Handling](#error-handling)
- [Logging](#logging)

## System Architecture

### High-Level Overview

KeelCompass follows a **client-server architecture** with a clear separation between frontend and backend:

```
┌─────────────┐      HTTP/REST      ┌─────────────┐
│   React     │ ◄──────────────────► │  Express.js │
│  Frontend   │      (Port 5173)     │   Backend   │
│  (Vite)     │                      │ (Port 8080) │
└─────────────┘                      └──────┬──────┘
                                            │
                                            │ Sequelize ORM
                                            ▼
                                      ┌─────────────┐
                                      │    MySQL    │
                                      │  Database   │
                                      └─────────────┘
```

### Technology Choices

#### Why Express.js?
- Lightweight and flexible
- Large ecosystem and community
- Easy to extend with middleware
- Well-suited for REST APIs

#### Why React + TypeScript?
- Type safety reduces runtime errors
- Component-based architecture for maintainability
- Large ecosystem and community support
- Excellent developer experience with Vite

#### Why Sequelize?
- Mature ORM with good MySQL support
- Migration system for version control
- Association handling simplifies relationships
- Built-in validation

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   │
│   ├── controllers/        # Request handlers (thin layer)
│   │   ├── authControllers.js
│   │   ├── questionControllers.js
│   │   └── ...
│   │
│   ├── services/           # Business logic (core layer)
│   │   ├── authServices.js
│   │   ├── questionServices.js
│   │   └── ...
│   │
│   ├── models/             # Sequelize models
│   │   ├── User.js
│   │   ├── Question.js
│   │   └── ...
│   │
│   ├── routes/             # Route definitions
│   │   ├── routes.js        # Main router
│   │   ├── authRoutes.js
│   │   └── ...
│   │
│   ├── middlewares/        # Custom middleware
│   │   ├── isUser.js        # Authentication check
│   │   └── isFacilitator.js # Authorization check
│   │
│   ├── utils/              # Utility functions
│   │   ├── jwtUtils.js     # JWT token handling
│   │   ├── logger.js       # Winston logger setup
│   │   └── ...
│   │
│   └── configs/            # Configuration
│       └── dbConfig.js     # Database configuration
│
├── migrations/             # Database migrations
├── seeders/                # Database seeders
└── docs/                   # API documentation
```

### Request Flow

```
Client Request
    │
    ▼
Express Router (routes/)
    │
    ▼
Middleware (authentication, validation)
    │
    ▼
Controller (controllers/)
    │
    ▼
Service (services/)
    │
    ▼
Model (models/) ────► Database
    │
    ▼
Response ────► Client
```

### Key Design Patterns

#### 1. Layered Architecture
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Data access layer

#### 2. Middleware Pattern
- Authentication middleware (`isUser`)
- Authorization middleware (`isFacilitator`)
- Error handling middleware
- Request logging middleware

#### 3. Service Layer Pattern
- Business logic separated from HTTP layer
- Easier to test and maintain
- Reusable across different entry points

### Authentication Flow

```
1. User submits credentials (POST /api/auth/login)
   │
2. Backend validates credentials
   │
3. If valid, generate JWT token
   │
4. Return token to client
   │
5. Client stores token (localStorage)
   │
6. Subsequent requests include token in Authorization header
   │
7. Middleware validates token on each request
```

### Environment Configuration

The backend supports multiple environments:
- **Development**: Uses local MySQL, loads `.env`
- **Testing**: Uses Dockerized MySQL, loads `.env.testing`
- **Production**: Uses production database, loads environment variables

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── main.tsx            # Application entry point
│   ├── App.tsx             # Root component & routing
│   │
│   ├── pages/              # Page-level components
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── QnA.tsx
│   │   └── ...
│   │
│   ├── components/         # Reusable components
│   │   ├── navigation/
│   │   ├── ui/
│   │   └── wrappers/
│   │
│   ├── features/           # Feature-based organization
│   │   ├── dashboard/
│   │   └── qna/
│   │
│   └── utils/              # Utilities
│       ├── api.ts          # Axios instance
│       ├── store.ts        # Zustand store
│       └── types.ts        # TypeScript types
```

### Component Organization

#### Feature-Based Structure
Components are organized by feature rather than by type:
- `features/dashboard/` - Dashboard-related components
- `features/qna/` - Q&A feature components

This makes it easier to:
- Find related components
- Understand feature boundaries
- Refactor or remove features

#### Component Hierarchy

```
App
├── AuthGuard (protects routes)
│   └── MainLayout
│       ├── Sidebar
│       └── Outlet (page content)
│           ├── Dashboard
│           ├── QnA
│           └── QuestionCreate
```

### State Management

**Zustand** is used for global state management:
- Lightweight and simple
- No boilerplate compared to Redux
- Good TypeScript support
- Used for authentication state and user data

### Routing

**React Router v6** handles client-side routing:
- Protected routes via `AuthGuard` component
- Token validation on route changes
- Automatic redirects for unauthenticated users

### API Integration

**Axios** instance with interceptors:
- Automatically adds JWT token to requests
- Centralized error handling
- Base URL configuration via environment variables

## Database Schema

### Core Models

#### User
- Primary user account model
- Roles: `volunteer`, `facilitator`
- Authenticated via email/password (bcrypt hashed)

#### Question
- Core content model
- Status: `pending`, `approved`, `rejected`
- Belongs to User
- Has many Categories (through QuestionCategory)
- Has many Comments
- Has many Attachments

#### Comment
- Response to questions
- Belongs to User and Question
- Can be nested (if implemented)

#### Category
- Question categorization
- Many-to-many with Questions

#### Interest
- Tracks user interest in questions
- Links User to Question

#### UserQuestionAction
- Tracks likes/dislikes on questions
- Links User to Question with action type

#### UserCommentAction
- Tracks likes/dislikes on comments
- Links User to Comment with action type

#### Notification
- User notifications
- Belongs to User

#### Attachment
- File attachments for questions
- Links to Google Cloud Storage

### Relationships

```
User
├── hasMany Questions
├── hasMany Comments
├── hasMany Interests
├── hasMany UserQuestionActions
├── hasMany UserCommentActions
└── hasMany Notifications

Question
├── belongsTo User
├── hasMany Comments
├── hasMany Interests
├── hasMany UserQuestionActions
├── hasMany Attachments
└── belongsToMany Categories (through QuestionCategory)

Comment
├── belongsTo User
├── belongsTo Question
└── hasMany UserCommentActions
```

## Authentication & Authorization

### Authentication

- **Method**: JWT (JSON Web Tokens)
- **Storage**: localStorage (frontend)
- **Header**: `Authorization: Bearer <token>`
- **Expiration**: Token includes expiration time
- **Validation**: Middleware validates token on each request

### Authorization

Two-level access control:

1. **isUser**: Any authenticated user
   - Can create questions
   - Can comment
   - Can like/dislike

2. **isFacilitator**: Authenticated user with facilitator role
   - Can approve/reject questions
   - Can view pending questions
   - Elevated permissions

### Security Considerations

- Passwords are hashed with bcrypt
- JWT tokens are signed and verified
- CORS is configured for frontend origin
- SQL injection prevented by Sequelize ORM
- Input validation via express-validator

## API Design

### RESTful Conventions

- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT/PATCH**: Update resources
- **DELETE**: Remove resources

### Endpoint Structure

```
/api/{resource}/{action?}
```

Examples:
- `GET /api/questions` - List questions
- `GET /api/questions/:id` - Get question details
- `POST /api/questions` - Create question
- `POST /api/search` - Search questions

### Response Format

Standard response structure:
```json
{
  "data": {...},
  "message": "Success",
  "status": 200
}
```

Error response:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

## File Storage

### Google Cloud Storage

- Files uploaded via multer middleware
- Stored in Google Cloud Storage bucket
- Attachment model stores file metadata
- URLs stored in database for retrieval

### File Upload Flow

```
1. Client sends file with question/comment
   │
2. Multer middleware handles upload
   │
3. File uploaded to GCS
   │
4. Attachment record created in database
   │
5. File URL returned to client
```

## Error Handling

### Backend Error Handling

1. **Validation Errors**: Caught by express-validator
2. **Database Errors**: Caught by Sequelize
3. **Authentication Errors**: Caught by middleware
4. **Global Error Handler**: Catches all unhandled errors

### Error Response Format

```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Error description"
}
```

### Frontend Error Handling

- Axios interceptors catch API errors
- User-friendly error messages displayed
- Snackbar component for notifications
- Fallback pages for 404 errors

## Logging

### Backend Logging

**Winston** for application logs:
- Logs written to `backend/logs/app.log`
- Different log levels: error, warn, info, debug
- HTTP requests logged via Morgan middleware

### Log Levels

- **Error**: Application errors, exceptions
- **Warn**: Warning conditions
- **Info**: General information, HTTP requests
- **Debug**: Detailed debugging information

### Frontend Logging

- Browser console for development
- Error boundaries for React error handling
- Network requests logged in browser DevTools

## Performance Considerations

### Backend

- Database indexes on foreign keys
- Eager loading for related data when needed
- Pagination for list endpoints
- Connection pooling for database

### Frontend

- Code splitting with React Router
- Lazy loading for routes
- Vite optimization for production builds
- Tailwind CSS purging unused styles



