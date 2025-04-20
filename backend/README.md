# Book Trading Club Backend

This is the backend API server for the Book Trading Club project, built with Node.js, Express, TypeScript, and MongoDB.

## Table of Contents
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Development Guidelines](#development-guidelines)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)
- [WebSocket Implementation](#websocket-implementation)
- [Project Architecture](#project-architecture)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, etc.)
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── tests/             # Test files
├── dist/              # Compiled JavaScript files (after build)
└── tsconfig.json      # TypeScript configuration
```

## Key Features

- RESTful API design with comprehensive endpoints
- JWT authentication with Firebase verification
- WebSocket integration for real-time trade notifications
- MongoDB with Mongoose ODM for data modeling
- TypeScript for enhanced type safety
- Input validation and sanitization
- Comprehensive error handling middleware
- Security features including rate limiting and CORS
- Transaction support for critical operations
- Pagination and filtering for efficient data retrieval

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues

## Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-trading-club
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=24h
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with Firebase/GitHub token
- `GET /api/auth/refresh` - Refresh authentication token

### Books
- `GET /api/books` - List all available books (supports pagination and filters)
- `POST /api/books` - Create a new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/user/:userId` - Get books by user

### Trades
- `GET /api/trades` - List user's trades
- `POST /api/trades` - Create trade proposal
- `PUT /api/trades/:id` - Update trade status
- `PUT /api/trades/:id/complete` - Complete trade
- `GET /api/trades/statistics` - Get trading statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/statistics` - Get user trading statistics

## Models

### User
```typescript
interface IUser {
  username: string;        // Unique username
  email: string;           // User's email address
  fullName?: string;       // Optional full name
  location?: string;       // Optional location information
  books: mongoose.Types.ObjectId[]; // Books owned by the user
  githubUsername?: string; // GitHub username if OAuth used
  githubPhotoUrl?: string; // GitHub profile photo
  favorites: string[];     // List of favorite book IDs
  wishlist: string[];      // List of books in wishlist
  createdAt: Date;         // Account creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Book
```typescript
interface IBook {
  title: string;            // Book title
  author: string;           // Book author
  description: string;      // Book description
  condition: BookCondition; // Physical condition of the book
  owner: mongoose.Types.ObjectId; // Reference to User
  isAvailable: boolean;     // Whether the book is available for trade
  image?: string;           // Optional book cover image URL
  isbn?: string;            // Optional ISBN number
  genre?: string[];         // Optional genres
  publishedYear?: number;   // Optional publication year
  createdAt: Date;          // Creation timestamp
  updatedAt: Date;          // Update timestamp
}

type BookCondition = 'New' | 'Like New' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
```

### Trade
```typescript
interface ITrade {
  initiator: mongoose.Types.ObjectId;       // User who proposed the trade
  receiver: mongoose.Types.ObjectId;        // User who receives the proposal
  bookOffered: mongoose.Types.ObjectId;     // Book offered by initiator
  bookRequested: mongoose.Types.ObjectId;   // Book requested from receiver
  status: TradeStatus;                      // Current status of the trade
  message?: string;                         // Optional message for the trade
  isSeen: boolean;                          // Whether the trade has been seen
  createdAt: Date;                          // Creation timestamp
  updatedAt: Date;                          // Update timestamp
}

type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
```

## Development Guidelines

1. Follow RESTful API design principles
2. Use TypeScript decorators and types with proper JSDoc comments
3. Implement proper error handling with specific error messages
4. Validate all inputs before processing
5. Use async/await for asynchronous operations with try/catch blocks
6. Write meaningful comments and documentation
7. Follow clean code principles (DRY, SOLID)
8. Use consistent naming conventions
9. Extract reusable logic into separate functions or utilities
10. Write tests for critical functionality

## Error Handling

The API uses a consistent error response format:

```typescript
interface ApiError {
  message: string;                  // User-friendly error message
  errors?: Record<string, string[]>; // Validation errors by field
  status: number;                   // HTTP status code
  stack?: string;                   // Stack trace (development only)
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    errors: err.errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

## Dependencies

Key dependencies and their purposes:
- `express` - Web framework for building the API
- `mongoose` - MongoDB ODM for data modeling and queries
- `jsonwebtoken` - JWT authentication and token management
- `ws` - WebSocket server for real-time features
- `firebase-admin` - Firebase authentication verification
- `bcryptjs` - Password hashing (for future password auth)
- `cors` - Cross-Origin Resource Sharing support
- `express-validator` - Request validation
- `helmet` - Security headers
- `compression` - Response compression
- `morgan` - HTTP request logging
- `dotenv` - Environment variable management

## WebSocket Implementation

The WebSocket server enables real-time notifications for trade updates, new messages, and system announcements.

### Server Setup

```typescript
// WebSocket server initialization
const wss = new WebSocketServer({ server });

interface WSMessage {
  type: 'trade_request' | 'trade_accepted' | 'trade_rejected' | 'trade_completed';
  payload: any;
}

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;       // Associated user ID after authentication
  isAlive: boolean;      // Connection status for ping/pong
  connectionTime: Date;  // When the connection was established
}
```

### Message Types

1. **Trade Request**
   ```typescript
   {
     type: 'trade_request',
     payload: {
       tradeId: string;       // ID of the new trade
       bookRequested: string; // ID of the requested book
       bookOffered: string;   // ID of the offered book
       initiator: string;     // ID of the trade initiator
       message?: string;      // Optional message
     }
   }
   ```

2. **Trade Status Update**
   ```typescript
   {
     type: 'trade_status',
     payload: {
       tradeId: string;       // ID of the trade
       status: 'accepted' | 'rejected' | 'completed'; // New status
       timestamp: string;     // ISO timestamp of the update
       message?: string;      // Optional message
     }
   }
   ```

3. **System Notification**
   ```typescript
   {
     type: 'system_notification',
     payload: {
       message: string;       // Notification message
       level: 'info' | 'warning' | 'error'; // Importance level
     }
   }
   ```

### Authentication Flow

1. Client connects to WebSocket server
2. Client sends authentication message with JWT token
   ```typescript
   { token: 'jwt_token_here' }
   ```
3. Server validates token and associates socket with user ID
4. Connection is maintained with ping/pong heartbeat
5. Server sends notifications based on user ID

### Broadcasting Example

```typescript
// Send message to specific user
const broadcastToUser = (userId: string, message: WSMessage) => {
  wss.clients.forEach(client => {
    const ws = client as AuthenticatedWebSocket;
    if (ws.userId === userId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

// Send trade notification
tradeEmitter.on('tradeCreated', (trade: ITrade) => {
  const message: WSMessage = {
    type: 'trade_request',
    payload: {
      tradeId: trade._id.toString(),
      bookRequested: trade.bookRequested.toString(),
      bookOffered: trade.bookOffered.toString(),
      initiator: trade.initiator.toString(),
      timestamp: new Date().toISOString()
    }
  };
  
  // Send to trade recipient
  broadcastToUser(trade.receiver.toString(), message);
});
```

## Project Architecture

### Domain Layer

The domain layer contains the core business logic and entities:

```
src/
└── models/
    ├── Book.ts       # Book domain model
    ├── Trade.ts      # Trade domain model
    └── User.ts       # User domain model
```

### Application Layer

The application layer coordinates the application activities:

```
src/
├── controllers/      # Business logic handlers
│   ├── authController.ts
│   ├── bookController.ts
│   ├── tradeController.ts
│   └── userController.ts
├── services/         # Domain services
│   ├── bookService.ts
│   ├── tradeService.ts
│   └── userService.ts
└── utils/            # Helper functions
    ├── validators.ts
    └── formatters.ts
```

### Infrastructure Layer

The infrastructure layer handles external interactions:

```
src/
├── config/           # Application configuration
│   ├── database.ts
│   └── firebase.ts
├── middleware/        # HTTP middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── validators.ts
└── routes/            # API routes
    ├── authRoutes.ts
    ├── bookRoutes.ts
    ├── tradeRoutes.ts
    └── userRoutes.ts
```

### Data Flow

1. **Request Flow**
   ```
   Client Request → Route → Middleware → Controller → Service → Model → Database
   ```

2. **Response Flow**
   ```
   Database → Model → Service → Controller → Response Transform → Client Response
   ```

3. **WebSocket Flow**
   ```
   Event → Emitter → WebSocket Handler → Client Connection → Client UI
   ```

### Security Architecture

The application implements multiple security layers:

1. **Authentication**
   - Firebase token verification for initial login
   - JWT token generation for session management
   - Token expiration and refresh mechanisms
   - WebSocket connection authentication

2. **Authorization**
   - Role-based access control
   - Resource ownership validation
   - Action-based permissions
   - API endpoint protection

3. **Data Protection**
   - Input validation and sanitization
   - Query injection prevention
   - Rate limiting on sensitive endpoints
   - Proper CORS configuration
   - Secure HTTP headers

### Error Handling Architecture

The application uses a centralized error handling approach:

```typescript
// Custom error class
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>,
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }
  
  // Log unexpected errors
  console.error('Unhandled error:', err);
  
  // Generic error response for unexpected errors
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.'
  });
};
```