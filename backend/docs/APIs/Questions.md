# Question Related APIs

### Update time: 11/30/2024

## General

- If an endpoint requires **authentication**, please add `Authorization: Bearer <token>` in the request header
- Content-Type: `application/json`
- Sample response if the authentication header is not included or the token is invalid

```Json
{
    "error": "Unauthorized access."
}
{
    "error": "Invalid or expired token."
}
```

## 1. Create questions

### Description:

Create a question

### Path & Method:

POST: `/api/questions`

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| title | string | Yes | title of the question |
| description | string | No | content of the question |
| attachment | **array** of object | No | attachment info |

Sample request body:

```Json
{
    "title": "test title",
    "description": "test description",
    "attachment": [
    {
      "url": "https://storage.googleapis.com/xxx-bucket/file1.jpg",
      "filename": "file1.jpg",
      "uploadedAt": "2025-02-15T12:00:00Z"
    }
  ]
}
```

Note:

The `attachment` field in the request body MUST be an array if it is present

### Responses

| Name       | Type   | Required | Description                |
| ---------- | ------ | -------- | -------------------------- |
| message    | string | Yes      | response message           |
| questionID | int    | No       | ID of the created question |

Sample response:

```Json
{
    "message": "Question created successfully",
    "questionID": 27
}
```

## 2. Get recent questions

### Description:

Get a list of questions, ordered by create time, from latest to oldest

### Path & Method:

Get: `/api/questions`

### Authentication Required

No

### Parameters

Query parameters:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| count | int | Yes | number of questions to get |
| offset | int | Yes | from where to get |

### Responses

| Name      | Type            | Required | Description                                    |
| --------- | --------------- | -------- | ---------------------------------------------- |
| message   | string          | Yes      | response message                               |
| questions | array of object | Yes      | list of questions                              |
| offset    | int             | Yes      | offset for next request. -1 if there's no more |
| total     | int             | Yes      | total number of questions                      |

Sample response:

```Json
{
    "message": "success",
    "questions": [
        {
            "id": 16,
            "title": "How can I access online course materials?",
            "description": "Is there a way to download course materials or access them offline?",
            "attachment": [
                {
                    "url": "https://storage.googleapis.com/your-bucket/file1.jpg",
                    "filename": "file1.jpg",
                    "uploadedAt": "2025-02-15T12:00:00Z"
                }
            ],
            "created_at": "2024-11-12T00:00:00.000Z",
            "user": {
                "id": 3,
                "username": "charlie"
            },
            "likeCount": 0,
            "reportCount": 0
        },
        {
            "id": 15,
            "title": "What housing options are available for first-year students?",
            "description": "Are there specific dorms or residence halls for first-year students? How do I apply for them?",
            "attachment": [],
            "created_at": "2024-11-11T23:30:00.000Z",
            "user": {
                "id": 10,
                "username": "User2"
            },
            "likeCount": 0,
            "reportCount": 0
        },
        {
            "id": 14,
            "title": "How do I join clubs and societies on campus?",
            "description": "I am interested in joining some clubs. Can anyone explain how to get involved in campus activities?",
            "attachment": [],
            "created_at": "2024-11-11T23:00:00.000Z",
            "user": {
                "id": 9,
                "username": "User1"
            },
            "likeCount": 0,
            "reportCount": 0
        }
    ],
    "offset": 13,
    "total": 26
}
```

```Json
{
    "message": "success",
    "questions": [],
    "offset": -1,
    "total": 26
}
```

## 3. Get a question by ID

### Description:

Get a question using its ID

### Path & Method:

GET: `/api/questions/:questionID`

### Authentication Required

Np

### Parameters

Path parameters:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| questionID | int | Yes | ID of the question |

### Responses

| Name     | Type   | Required | Description      |
| -------- | ------ | -------- | ---------------- |
| message  | string | Yes      | response message |
| question | object | Yes      | question         |

Sample response:

```Json
{
    "message": "success",
    "question": {
        "id": 10,
        "title": "What is the application deadline for the fall semester?",
        "description": "Does anyone know the deadline for submitting applications for the upcoming fall semester?",
        "attachment": [],
        "created_at": "2024-11-11T21:00:00.000Z",
        "user": {
            "id": 5,
            "username": "eve"
        },
        "likeCount": 2,
        "reportCount": 1
    }
}
```

Failure response

```Json
{
    "message": "question not found"
}
```

## 4. Delete a question by ID

### Description:

Delete a question

### Path & Method:

DELETE: `/api/questions`

### Authentication Required

Yes

### Parameters

Query parameters:
| Name | Type | Required | Description |
| ---------- | --- | --- | ----------------------- |
| questionID | int | Yes | id of the question |

### Responses

| Name    | Type   | Required | Description      |
| ------- | ------ | -------- | ---------------- |
| message | string | Yes      | response message |

Sample response:

```Json
{
    "message": "success"
}
```

Failure response"

```Json
{
    "message": "question not found"
}
{
    "message": "no permission"
}
```

## 5. Update a question

### Description:

Modify a question

### Path & Method:

PUT: `/api/questions`

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| title | string | Yes | title of the question |
| description | string | No | content of the question |
| questionID | int | Yes | ID of the question |

Sample request body:

```Json
{
    "questionID": 20,
    "title": "new title",
    "description": "new content"
}
```

### Responses

| Name    | Type   | Required | Description      |
| ------- | ------ | -------- | ---------------- |
| message | string | Yes      | response message |

Sample response:

```Json
{
    "message": "success"
}
```

Failure response

```Json
{
    "message": "no permission"
}
{
    "message": "question not found"
}
```

## 6. Add a like/flag to a question

### Description:

Add a like or flag(report) to a question

### Path & Method:

POST: `/api/questions/action`

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ---------------- |
| questionID | int | Yes | ID of the question |
| actionType | string | Yes | Type of the action |

Valid action types:

- `like`
- `report`

Sample request body:

```Json
{
    "questionID": 10,
    "actionType": "report"
}
```

### Responses

| Name    | Type   | Required | Description      |
| ------- | ------ | -------- | ---------------- |
| message | string | Yes      | response message |

Sample response:

```Json
{
    "message": "success"
}
```

Failure responses

```Json
{
    "message": "record existed"
}
{
    "message": "question not found"
}
```

## 7. Remove a like/flag to a question

### Description:

Remove a like or flag(report) to a question

### Path & Method:

DELETE: `/api/questions/action`

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ---------------- |
| questionID | int | Yes | ID of the question |
| actionType | string | Yes | Type of the action |

Valid action types:

- `like`
- `report`

Sample request body:

```Json
{
    "questionID": 10,
    "actionType": "report"
}
```

### Responses

| Name    | Type   | Required | Description      |
| ------- | ------ | -------- | ---------------- |
| message | string | Yes      | response message |

Sample response:

```Json
{
    "message": "success"
}
```

Failure responses

```Json
{
    "message": "record not found"
}
{
    "message": "question not found"
}
```
