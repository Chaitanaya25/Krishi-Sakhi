# Krishi Sakhi API Reference

## Base URL

```
http://localhost:8000
```

## Authentication

Most endpoints require authentication. Include an API key in the request headers:

```
X-API-Key: your_api_key_here
```

## Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API.

**Response**

```json
{
  "ok": true,
  "status": "healthy",
  "service": "Krishi Sakhi API"
}
```

### Farmers

#### Get All Farmers

```
GET /farmers
```

Returns a list of all farmers.

#### Get Farmer by ID

```
GET /farmers/{farmer_id}
```

Returns details for a specific farmer.

#### Create Farmer

```
POST /farmers
```

Creates a new farmer record.

**Request Body**

```json
{
  "name": "Farmer Name",
  "phone": "1234567890",
  "location": "Village Name"
}
```

### Advisories

#### Get Advisories for Farmer

```
GET /advisories/farmer/{farmer_id}
```

Returns all advisories for a specific farmer.

#### Create Advisory

```
POST /advisories
```

Creates a new advisory.

**Request Body**

```json
{
  "farmer_id": 1,
  "content": "Advisory content",
  "type": "crop"
}
```

### AI Services

#### Generate Farming Advice

```
POST /ai/advice
```

Generates farming advice based on input parameters.

**Request Body**

```json
{
  "farmer_id": 1,
  "query": "How to deal with pest infestation in rice?",
  "crop": "rice"
}
```

## Error Responses

All endpoints return standard HTTP status codes. In case of an error, the response body will contain an error message:

```json
{
  "detail": "Error message"
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per API key.