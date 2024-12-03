# Comment Related APIs

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

## 1. Create a comment

### Description:

Create a comment to a question

### Path & Method:

POST: `/api/comments`

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| questionID | int | Yes | id of the question |
| content | string | Yes | content of the comment |

Sample request body:

```Json
{
    "questionID": 2,
    "content": "my comment"
}
```

### Responses

| Name      | Type   | Required | Description               |
| --------- | ------ | -------- | ------------------------- |
| message   | string | Yes      | response message          |
| commentID | int    | No       | ID of the created comment |

Sample response:

```Json
{
    "message": "Comment created successfully",
    "commentID": 30
}
```

## 2. Delete a comment

### Description:

Delete a comment

### Path & Method:

DELETE: `/api/comments`

### Authentication Required

Yes

### Parameters

Query parameters:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| commentID | int | Yes | id of the comment |

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
    "message": "comment not found"
}
```

## 3. Update a comment

### Description:

Update a comment

### Path & Method:

PUT: `/api/comments`

### Authentication Required

Yes

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| commentID | int | Yes | id of the comment |
| content | string | Yes | new content of the comment |

Sample request body:

```Json
{
    "commentID": 30,
    "content": "my new comment"
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
    "message": "comment not found"
}
```

## 4. Get comment list of a question

### Description:

Get a list of comments of a question, ordered by create time, from oldest to latest

### Path & Method:

Get: `/api/comments`

### Authentication Required

No

### Parameters

Query parameters:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| questionID | int | Yes | Id of the question |
| count | int | Yes | number of questions to get |
| offset | int | Yes | from where to get |

### Responses

| Name     | Type            | Required | Description                                    |
| -------- | --------------- | -------- | ---------------------------------------------- |
| message  | string          | Yes      | response message                               |
| comments | array of object | Yes      | list of comments                               |
| offset   | int             | Yes      | offset for next request. -1 if there's no more |
| total    | int             | Yes      | total number of questions                      |

Sample response:

```Json
{
    "message": "success",
    "comments": [
        {
            "id": 9,
            "content": "I disagree with the premise of the question. I think there are other factors to consider.",
            "created_at": "2024-11-12T04:15:00.000Z",
            "user": {
                "id": 2,
                "username": "bob"
            }
        }
    ],
    "offset": -1,
    "total": 1
}

```
