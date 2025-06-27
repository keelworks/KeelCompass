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

## 1. Search Questions by title and description Keywords

### Description:

Get a list of questions that have a matching keyword in title or description.

### Path & Method:

Get: `/api/search`

### Authentication Required

Yes (to allow only logged in users to search)

### Parameters

Query parameters:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| query | string | Yes | keywords |
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