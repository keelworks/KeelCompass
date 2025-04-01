# Interest/Bookmark Related APIs

### Update time: 12/02/2024

---

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

## 1. Get user interests

### Description:

Retrieve a list of interests for the authenticated user.

### Path & Method:

GET: /api/interests

### Authentication Required

Yes

### Parameters

None

### Responses

| Name       | Type   | Required | Description                |
| ---------- | ------ | -------- | -------------------------- |
| message    | string | Yes      | response message           |
| interests | array of object    | Yes       | List of interests for the user |

Sample response:

```Json
{
    "message": "success",
    "interests": [
        {
            "id": 1,
            "question": {
                "id": 10,
                "title": "How can I access online course materials?",
                "description": "Is there a way to download course materials or access them offline?"
            }
        },
        {
            "id": 2,
            "question": {
                "id": 15,
                "title": "What housing options are available for first-year students?",
                "description": "Are there specific dorms or residence halls for first-year students? How do I apply for them?"
            }
        }
    ]
}
```

failure response:

```Json
{
    "message": "no interests found",
    "interests": []
}
```

## 2. Save a question to interests

### Description:

Save a question as an interest for the authenticated user.

### Path & Method:

POST: /api/interests

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ------------- |
| question_id | int | Yes | ID of the question to be saved |

Sample request body:

```Json
{
    "question_id": 15
}
```

### Responses

| Name       | Type   | Required | Description                |
| ---------- | ------ | -------- | -------------------------- |
| message    | string | Yes      | response message           |
| InterestId | int    | Yes       | ID of the newly created interest |

Sample response:

```Json
{
    "message": "Interest created successfully",
    "InterestId": 3
}
```

failure response:

```Json
{
    "error": "Question Id is required"
}
```

```Json
{
    "message": "interest already exists"
}
```

```Json
{
    "message": "question not found"
}
```

## 3. Delete an Interest by ID

### Description:

Delete an interest by its ID for the authenticated user.

### Path & Method:

POST: /api/interests/:id

### Authentication Required

Yes

### Parameters
Path parameter:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | --------- |
| id | int | Yes | ID of the interest |

Sample response:

```Json
{
    "message": "Interest deleted successfully",
    "InterestId": 3
}
```

failure response:

```Json
{
    "message": "interest not found"
}
```

```Json
{
    "message": "no permission"
}
```
