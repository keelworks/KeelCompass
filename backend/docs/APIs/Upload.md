# Upload Related APIs

### Update time: 3/17/2025

## General

- If an endpoint requires **authentication**, please add `Authorization: Bearer <token>` in the request header
- Content-Type: `multipart/form-data`
- Sample response if the authentication header is not included or the token is invalid

```Json
{
    "error": "Unauthorized access."
}
{
    "error": "Invalid or expired token."
}
```

- This implementation uses Google Cloud Service to store the files, and there are some configurations need to be filled in the `env` file
- Sample env file

```ini
# Google Cloud Config
GOOGLE_APPLICATION_CREDENTIALS=./secret/credential.json
GCS_BUCKET_NAME=my_bucket
FILE_SIZE_LIMIT=5 # MB
```

## 1. Upload a file

### Description:

Upload ONE file

### Path & Method:

POST: `/api/upload`

### Authentication Required

Yes

### File type accepted

- Documents. E.g. `.pdf`, `.csv`, `.docx`
- Image. E.g. `.jpg`, `.png`

### Parameters

Request body:
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------------------- |
| file | file | Yes | file to upload |

Note:

- **There is a size limit to the file that can be configured in `env` file**
- **There is NO limit to the frequency a user can upload a file**

### Responses

| Name    | Type   | Required | Description              |
| ------- | ------ | -------- | ------------------------ |
| message | string | Yes      | response message         |
| fileUrl | string | No       | URL of the uploaded file |

Sample response:

```Json
{
    "message": "File uploaded successfully",
    "fileUrl": "https://storage.googleapis.com/my_bucket/sample_file.pdf"
}
```
