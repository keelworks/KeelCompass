# KeelCompass Backend APIs

This document lists the main API endpoints exposed by the backend, including their purpose, request format, and response structure. It serves as a quick reference for both backend and frontend developers working with the system.

All API definitions in this file are derived directly from the source code and should stay in sync with any changes made to the code.

## Authentication & Authorization

Authentication is handled using a JWT token passed in the `Authorization` header.

There are two types of access control checks used:
- Authentication (`isUser`): The user is logged in and has a valid token.
- Authorization (`isFacilitator`): The authenicated user has facilitator permissions.

Most endpoints require the user to be authenticated and some require the user to be authorized.

## Primary Endpoints

### Categories

#### GET /api/categories

Fetch all categories.

- Auth: None
- Request:
    - Params: None
    - Query: None
    - Body: None
- Response: 
```json
[
    {
        "id": number,
        "name": "string"
    }
]
```
### Questions

#### GET /api/questions

Fetch recent questions.

- Auth: isUser
- Request: 
    - Params: None
    - Query: count, offset
    - Body: None
- Response: 
```json
{
  "questions": [
    {
      "id": number,
      "user": { "username": "string" },
      "title": "string",
      "description": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "isInterested": boolean,
      "interestId": number,
      "hasLiked": boolean,
      "likeCount": number,
      "commentCount": number
    }
  ],
  "total": number,
  "offset": number
}
```

#### GET /api/question/questions/popular

Fetch popular questions.

- Auth: isUser
- Request:
    - Params: None
    - Query: count, offset
    - Body: None
- Response: 
```json
{
  "questions": [
    {
      "id": number,
      "user": { "username": "string" },
      "title": "string",
      "description": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "isInterested": boolean,
      "interestId": number,
      "hasLiked": boolean,
      "likeCount": number,
      "commentCount": number
    }
  ],
  "total": number,
  "offset": number
}
```

#### GET /api/questions/pending

Fetch all pending questions.

- Auth: isUser, isFacilitator
- Request:
    - Params: None
    - Query: count, offset
    - Body: None
- Response: 
```json
{
  "questions": [
    {
      "id": number,
      "user": {
        "id": number,
        "username": "string"
      },
      "title": "string",
      "description": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "total": number,
  "offset": number
}
```

<!-- ADD REST OF ENDPOINTS FOR QUESTIONS -->

### QuestionCategories

### UserQuestionActions

### Comments

### UserCommentActions

### Interests

### Notifications

## Other Endpoints

### Auth

### Search
