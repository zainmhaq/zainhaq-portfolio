# Authenticate to the API

When you make a request to the API, you must include an OAuth 2.0 access token in the request headers. An access token is a set of short-lived credentials that grants permission to call the API.

To get an access token:

1. Generate API credentials in the merchant console.
2. Exchange those credentials for an access token by making an HTTPS POST request to the token endpoint.

Access tokens expire every 15 minutes. After a token expires, request a new token using the same client permissions.

## Step 1: Generate API credentials

1. Sign in to the merchant console as an owner or admin.
2. Choose **Settings**.
3. Under **Settings**, choose **API Credentials**.
4. Choose **Generate credentials**.
5. For **Credentials name**, enter a name that helps you identify the purpose of the credentials.
6. Choose the permissions you want the API credentials to have:
   - **Full access**: Edit and view access to all listed permissions (selects all APIs automatically).
   - **Custom**: Select permissions from a list (select specific APIs manually).
7. Choose **Generate**. The merchant console generates your API credentials and opens a page where you can download a file containing:
   - client ID
   - client secret
   - target ID
   - list of permissions
8. Download the credentials file to your computer.
9. Locate and open the downloaded credentials file.

## Step 2: Use API credentials to get an access token

Make an HTTPS POST request to the token endpoint with the fields listed below in the request body.

Token endpoint:

```
https://api.writing-sample.com/token
```

### Request fields

| Field | Description | Required |
| --- | --- | --- |
| `client_id` | The client ID from the downloaded API credentials file. | Yes |
| `client_secret` | The client secret from the downloaded API credentials file. | Yes |
| `grant_type` | OAuth 2.0 grant type. Use `client_credentials`. | Yes |

### Example request (curl)

Replace the placeholders with values from your downloaded credentials file.

```bash
curl --location --request POST 'https://api.writing-sample.com/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'x-api-version: 2024-11-01' \
  --data-urlencode 'client_id=EXAMPLE_CLIENT_ID' \
  --data-urlencode 'client_secret=EXAMPLE_CLIENT_SECRET' \
  --data-urlencode 'grant_type=client_credentials'
```

### Successful response fields

| Field | Description |
| --- | --- |
| `access_token` | Token used to access the API. |
| `expires_in` | Time until the token expires, in seconds. |

## Error responses

### Failed response fields

| Field | Description |
| --- | --- |
| `message` | Description of the cause of the error. |
| `code` | Only present for HTTP 400 `InvalidParameterException` responses. Code that further describes the cause of the HTTP 400 error. |
| `type` | Exception type thrown by the service (for example, `ValidationError` or `AccessDeniedError`). |

### Error codes

| HTTP Status Code | Error Type | Error Code | Description |
| --- | --- | --- | --- |
| 400 | `ValidationError` | `InvalidContentType` | The `Content-Type` header is missing or invalid. It must be `application/x-www-form-urlencoded`. |
| 400 | `ValidationError` | `NonDeserializableContent` | The request payload is not in a format the server can interpret. |
| 400 | `ValidationError` | `InvalidClientId` | The payload does not contain `client_id`, or the specified `client_id` is incomplete, malformed, or invalid. |
| 400 | `ValidationError` | `InvalidClientSecret` | The payload does not contain `client_secret`, or the specified `client_secret` is incomplete, malformed, or invalid. |
| 400 | `ValidationError` | `InvalidGrantType` | The payload does not contain `grant_type`, or the specified `grant_type` is incomplete, malformed, or invalid. The `grant_type` must be `client_credentials`. |
| 401 | `AccessDeniedError` | N/A | The requested payload does not have permission to receive an access token. |
| 429 | `ThrottlingError` | N/A | The request was throttled. Throttling occurs after a limit of 12 requests per second per `client_id` is reached. |
| 500 | `InternalServerError` | N/A | An internal error occurred. Try again. |

### Example failed response (HTTP 400)

```json
{
  "message": "Content type is null or invalid. Ensure content type is: application/x-www-form-urlencoded",
  "code": "InvalidContentType",
  "type": "ValidationError"
}
```
