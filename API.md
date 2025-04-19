# Book Trading Club API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected routes require a JWT token in the Authorization header.

```
Authorization: Bearer <token>
```

### Auth Endpoints

#### POST /auth/login
Authenticate user with GitHub OAuth token.

**Request:**
```json
{
  "token": "firebase_id_token"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "username",
  "email": "email@example.com",
  "token": "jwt_token"
}
```

**Errors:**
- 401: Invalid credentials
- 500: Server error

### Book Endpoints

#### GET /books
Get all available books.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `condition` (optional): Book condition
- `genre` (optional): Book genre

**Response:**
```json
{
  "books": [
    {
      "_id": "book_id",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Book description",
      "condition": "New",
      "owner": {
        "_id": "user_id",
        "username": "username"
      },
      "isAvailable": true,
      "genre": ["Fiction"],
      "createdAt": "2025-04-19T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

#### POST /books
Create a new book listing.

**Request:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "condition": "New",
  "genre": ["Fiction"],
  "isbn": "1234567890",
  "publishedYear": 2025
}
```

**Response:**
```json
{
  "_id": "book_id",
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "condition": "New",
  "owner": {
    "_id": "user_id",
    "username": "username"
  },
  "isAvailable": true,
  "genre": ["Fiction"],
  "createdAt": "2025-04-19T10:00:00.000Z"
}
```

### Trade Endpoints

#### POST /trades
Create a new trade proposal.

**Request:**
```json
{
  "bookOffered": "book_id",
  "bookRequested": "book_id",
  "message": "Optional trade message"
}
```

**Response:**
```json
{
  "_id": "trade_id",
  "initiator": {
    "_id": "user_id",
    "username": "username"
  },
  "receiver": {
    "_id": "user_id",
    "username": "username"
  },
  "bookOffered": {
    "_id": "book_id",
    "title": "Book Title"
  },
  "bookRequested": {
    "_id": "book_id",
    "title": "Book Title"
  },
  "status": "pending",
  "message": "Optional trade message",
  "createdAt": "2025-04-19T10:00:00.000Z"
}
```

#### PUT /trades/:id
Update trade status.

**Request:**
```json
{
  "status": "accepted" | "rejected" | "completed"
}
```

**Response:**
```json
{
  "_id": "trade_id",
  "status": "accepted",
  "updatedAt": "2025-04-19T10:00:00.000Z"
}
```

### User Endpoints

#### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "_id": "user_id",
  "username": "username",
  "email": "email@example.com",
  "fullName": "Full Name",
  "location": "City, Country",
  "books": ["book_id"],
  "createdAt": "2025-04-19T10:00:00.000Z"
}
```

#### PUT /users/profile
Update user profile.

**Request:**
```json
{
  "username": "new_username",
  "fullName": "New Full Name",
  "location": "New Location"
}
```

### WebSocket Events

Connect to WebSocket server:
```
ws://localhost:5000/ws
```

#### Authentication
Send after connection:
```json
{
  "token": "jwt_token"
}
```

#### Event Types

1. Trade Request:
```json
{
  "type": "trade_request",
  "payload": {
    "tradeId": "trade_id",
    "bookRequested": "book_id",
    "bookOffered": "book_id",
    "initiator": "user_id"
  }
}
```

2. Trade Status Update:
```json
{
  "type": "trade_status",
  "payload": {
    "tradeId": "trade_id",
    "status": "accepted" | "rejected" | "completed"
  }
}
```

## Error Handling

All error responses follow this format:
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error details"]
  },
  "status": 400
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

## Data Models

### User
```typescript
{
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  location?: string;
  books: string[];
  githubUsername?: string;
  githubPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Book
```typescript
{
  _id: string;
  title: string;
  author: string;
  description: string;
  condition: "New" | "Like New" | "Very Good" | "Good" | "Fair" | "Poor";
  owner: string | User;
  isAvailable: boolean;
  image?: string;
  isbn?: string;
  genre?: string[];
  publishedYear?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Trade
```typescript
{
  _id: string;
  initiator: string | User;
  receiver: string | User;
  bookOffered: string | Book;
  bookRequested: string | Book;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  message?: string;
  createdAt: string;
  updatedAt: string;
}
```