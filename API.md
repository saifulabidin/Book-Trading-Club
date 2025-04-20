# Book Trading Club API Documentation

## Table of Contents
- [API Information](#api-information)
- [Base URLs](#base-urls)
- [Authentication](#authentication)
  - [Auth Endpoints](#auth-endpoints)
    - [POST /auth/login](#post-authlogin)
    - [GET /auth/refresh](#get-authrefresh)
  - [Book Endpoints](#book-endpoints)
    - [GET /books](#get-books)
    - [GET /books/:id](#get-booksid)
    - [POST /books](#post-books)
    - [PUT /books/:id](#put-booksid)
    - [DELETE /books/:id](#delete-booksid)
  - [Trade Endpoints](#trade-endpoints)
    - [GET /trades](#get-trades)
    - [POST /trades](#post-trades)
    - [PUT /trades/:id](#put-tradesid)
    - [PUT /trades/:id/complete](#put-tradesidcomplete)
  - [User Endpoints](#user-endpoints)
    - [GET /users/profile](#get-usersprofile)
    - [PUT /users/profile](#put-usersprofile)
    - [GET /users/:id/books](#get-usersidbooks)
  - [WebSocket Events](#websocket-events)
    - [Authentication](#authentication-1)
    - [Event Types](#event-types)
- [Error Handling](#error-handling)
  - [Common HTTP Status Codes](#common-http-status-codes)
  - [Common Error Codes](#common-error-codes)
- [Rate Limiting](#rate-limiting)
- [Data Models](#data-models)
  - [User](#user)
  - [Book](#book)
  - [Trade](#trade)
- [Changelog](#changelog)

## API Information
- **Current Version**: 1.0.0
- **Last Updated**: April 20, 2025
- **Release Date**: March 15, 2025

## Base URLs
```
Development: http://localhost:5000/api
Staging: https://staging.book-trading-club.com/api
Production: https://book-trading-club.com/api
```

## Authentication

All protected routes require a JWT token in the Authorization header.

```
Authorization: Bearer <token>
```

JWT tokens expire after 24 hours and need to be refreshed using the `/auth/refresh` endpoint.

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
  "token": "jwt_token",
  "expiresAt": "2025-04-21T10:00:00.000Z"
}
```

**Errors:**
- 401: Invalid credentials
- 403: Account suspended
- 500: Server error

#### GET /auth/refresh
Refresh an existing JWT token before it expires.

**Request Headers:**
```
Authorization: Bearer <current_token>
```

**Response:**
```json
{
  "token": "new_jwt_token",
  "expiresAt": "2025-04-22T10:00:00.000Z"
}
```

**Errors:**
- 401: Invalid or expired token
- 403: Account suspended
- 500: Server error

### Book Endpoints

#### GET /books
Get all available books.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term in title or author
- `condition` (optional): Book condition (comma-separated for multiple)
- `genre` (optional): Book genre (comma-separated for multiple)
- `sort` (optional): Sort field (title, author, createdAt)
- `order` (optional): Sort order (asc, desc)

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
      "genre": ["Fiction", "Fantasy"],
      "isbn": "1234567890123",
      "publishedYear": 2020,
      "image": "https://bookimages.com/cover.jpg",
      "createdAt": "2025-04-19T10:00:00.000Z",
      "updatedAt": "2025-04-19T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10,
  "hasMore": true
}
```

#### GET /books/:id
Get details for a specific book.

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
    "username": "username",
    "profilePicture": "https://example.com/profile.jpg"
  },
  "isAvailable": true,
  "genre": ["Fiction", "Fantasy"],
  "isbn": "1234567890123",
  "publishedYear": 2020,
  "image": "https://bookimages.com/cover.jpg",
  "createdAt": "2025-04-19T10:00:00.000Z",
  "updatedAt": "2025-04-19T10:00:00.000Z"
}
```

**Errors:**
- 404: Book not found

#### POST /books
Create a new book listing.

**Request:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "condition": "New",
  "genre": ["Fiction", "Fantasy"],
  "isbn": "1234567890123",
  "publishedYear": 2020,
  "image": "base64_encoded_image_or_url"
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
  "genre": ["Fiction", "Fantasy"],
  "isbn": "1234567890123",
  "publishedYear": 2020,
  "image": "https://bookimages.com/cover.jpg",
  "createdAt": "2025-04-20T10:00:00.000Z",
  "updatedAt": "2025-04-20T10:00:00.000Z"
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized

#### PUT /books/:id
Update a book listing.

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "condition": "Like New",
  "isAvailable": true
}
```

**Response:**
```json
{
  "_id": "book_id",
  "title": "Updated Title",
  "author": "Author Name",
  "description": "Updated description",
  "condition": "Like New",
  "isAvailable": true,
  "updatedAt": "2025-04-20T11:00:00.000Z"
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized
- 403: Not the book owner
- 404: Book not found

#### DELETE /books/:id
Delete a book listing.

**Response:**
```json
{
  "message": "Book deleted successfully",
  "id": "book_id"
}
```

**Errors:**
- 401: Unauthorized
- 403: Not the book owner
- 404: Book not found

### Trade Endpoints

#### GET /trades
List user's trades.

**Query Parameters:**
- `status` (optional): Filter by status (pending, accepted, rejected, completed, cancelled)
- `role` (optional): Filter by role (initiator, receiver)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "trades": [
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
        "title": "Book Title",
        "image": "https://bookimages.com/cover.jpg"
      },
      "bookRequested": {
        "_id": "book_id",
        "title": "Book Title",
        "image": "https://bookimages.com/cover.jpg"
      },
      "status": "pending",
      "message": "I'm interested in trading this book",
      "isSeen": false,
      "createdAt": "2025-04-19T10:00:00.000Z",
      "updatedAt": "2025-04-19T10:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "pages": 3,
  "hasMore": true
}
```

#### POST /trades
Create a new trade proposal.

**Request:**
```json
{
  "bookOffered": "book_id",
  "bookRequested": "book_id",
  "message": "I'm interested in trading this book"
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
    "title": "Book Title",
    "image": "https://bookimages.com/cover.jpg"
  },
  "bookRequested": {
    "_id": "book_id",
    "title": "Book Title",
    "image": "https://bookimages.com/cover.jpg"
  },
  "status": "pending",
  "message": "I'm interested in trading this book",
  "isSeen": false,
  "createdAt": "2025-04-20T10:00:00.000Z",
  "updatedAt": "2025-04-20T10:00:00.000Z"
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized
- 404: Book not found
- 409: Book unavailable

#### PUT /trades/:id
Update trade status.

**Request:**
```json
{
  "status": "accepted",
  "message": "I accept your trade offer"
}
```

**Response:**
```json
{
  "_id": "trade_id",
  "status": "accepted",
  "message": "I accept your trade offer",
  "updatedAt": "2025-04-20T11:00:00.000Z"
}
```

**Errors:**
- 400: Invalid status
- 401: Unauthorized
- 403: Not a participant in this trade
- 404: Trade not found
- 409: Invalid status transition

#### PUT /trades/:id/complete
Complete a trade after books have been exchanged.

**Response:**
```json
{
  "_id": "trade_id",
  "status": "completed",
  "completedAt": "2025-04-20T15:00:00.000Z"
}
```

**Errors:**
- 401: Unauthorized
- 403: Not a participant in this trade
- 404: Trade not found
- 409: Trade not in accepted status

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
  "githubUsername": "github_username",
  "githubPhotoUrl": "https://github.com/profile.jpg",
  "books": ["book_id1", "book_id2"],
  "booksCount": 5,
  "tradeStats": {
    "completed": 12,
    "initiated": 20,
    "received": 15
  },
  "createdAt": "2025-01-19T10:00:00.000Z",
  "updatedAt": "2025-04-19T10:00:00.000Z"
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

**Response:**
```json
{
  "_id": "user_id",
  "username": "new_username",
  "fullName": "New Full Name",
  "location": "New Location",
  "updatedAt": "2025-04-20T10:00:00.000Z"
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized
- 409: Username already taken

#### GET /users/:id/books
Get books owned by a specific user.

**Response:**
```json
{
  "books": [
    {
      "_id": "book_id",
      "title": "Book Title",
      "author": "Author Name",
      "condition": "New",
      "isAvailable": true,
      "image": "https://bookimages.com/cover.jpg",
      "createdAt": "2025-04-19T10:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

### WebSocket Events

Connect to WebSocket server:
```
Development: ws://localhost:5000/ws
Production: wss://book-trading-club.com/ws
```

#### Authentication
Send after connection is established:
```json
{
  "type": "auth",
  "payload": {
    "token": "jwt_token"
  }
}
```

#### Event Types

1. Trade Request:
```json
{
  "type": "trade_request",
  "payload": {
    "tradeId": "trade_id",
    "bookRequested": {
      "id": "book_id",
      "title": "Book Title",
      "image": "https://bookimages.com/cover.jpg"
    },
    "bookOffered": {
      "id": "book_id",
      "title": "Book Title",
      "image": "https://bookimages.com/cover.jpg"
    },
    "initiator": {
      "id": "user_id",
      "username": "username"
    },
    "message": "Optional trade message",
    "timestamp": "2025-04-20T10:00:00.000Z"
  }
}
```

2. Trade Status Update:
```json
{
  "type": "trade_status",
  "payload": {
    "tradeId": "trade_id",
    "status": "accepted",
    "message": "I accept your trade offer",
    "timestamp": "2025-04-20T11:00:00.000Z" 
  }
}
```

3. System Notification:
```json
{
  "type": "system_notification",
  "payload": {
    "title": "Maintenance Notice",
    "message": "The system will be down for maintenance on April 25",
    "level": "info",
    "timestamp": "2025-04-20T12:00:00.000Z"
  }
}
```

4. Ping/Pong:
```json
// Server sends ping:
{
  "type": "ping",
  "payload": {
    "timestamp": "2025-04-20T10:30:00.000Z"
  }
}

// Client should respond with:
{
  "type": "pong",
  "payload": {
    "timestamp": "2025-04-20T10:30:01.000Z"
  }
}
```

## Error Handling

All error responses follow this consistent format:
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": {
    "field": ["Error details for specific field"]
  },
  "code": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2025-04-20T10:00:00.000Z"
}
```

### Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 429: Too Many Requests
- 500: Server Error

### Common Error Codes:
- `VALIDATION_ERROR`: Request data validation failed
- `AUTHENTICATION_ERROR`: Authentication issues
- `AUTHORIZATION_ERROR`: Permission issues
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RESOURCE_CONFLICT`: Resource state conflict
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1619020230
```

## Data Models

### User
```typescript
{
  _id: string;                // MongoDB document ID
  username: string;           // Unique username
  email: string;              // User's email address
  fullName?: string;          // Optional full name
  location?: string;          // Optional location information
  books: string[];            // Array of book IDs owned by user
  githubUsername?: string;    // GitHub username if OAuth used
  githubPhotoUrl?: string;    // GitHub profile photo URL
  favorites: string[];        // List of favorite book IDs
  wishlist: string[];         // List of books in wishlist
  createdAt: string;          // Account creation timestamp (ISO string)
  updatedAt: string;          // Last update timestamp (ISO string)
}
```

### Book
```typescript
{
  _id: string;                // MongoDB document ID
  title: string;              // Book title
  author: string;             // Book author
  description: string;        // Book description
  condition: "New" | "Like New" | "Very Good" | "Good" | "Fair" | "Poor";
  owner: string | User;       // User ID or populated User object
  isAvailable: boolean;       // Whether the book is available for trade
  image?: string;             // Book cover image URL
  isbn?: string;              // ISBN number
  genre?: string[];           // Book genres
  publishedYear?: number;     // Publication year
  createdAt: string;          // Creation timestamp (ISO string)
  updatedAt: string;          // Update timestamp (ISO string)
}
```

### Trade
```typescript
{
  _id: string;                // MongoDB document ID
  initiator: string | User;   // User who proposed the trade
  receiver: string | User;    // User who received the proposal
  bookOffered: string | Book; // Book offered by initiator
  bookRequested: string | Book; // Book requested from receiver
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  message?: string;           // Optional trade message
  isSeen: boolean;            // Whether the receiver has seen the trade
  statusHistory: [{           // History of status changes
    status: string;
    timestamp: string;
    message?: string;
    updatedBy: string;
  }];
  createdAt: string;          // Creation timestamp (ISO string)
  updatedAt: string;          // Update timestamp (ISO string)
  completedAt?: string;       // Completion timestamp (ISO string)
}
```

## Changelog

### v1.0.0 (2025-03-15)
- Initial API release

### v0.9.0 (2025-02-20)
- Beta release with complete trade functionality
- Added WebSocket support
- Improved error handling

### v0.8.0 (2025-01-15)
- Alpha release with basic functionality
- Book and user management