# Book Trading Club Backend

This is the backend API server for the Book Trading Club project, built with Node.js, Express, TypeScript, and MongoDB.

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
```

## Key Features

- RESTful API design
- JWT authentication
- WebSocket integration for real-time features
- MongoDB with Mongoose ODM
- TypeScript for type safety
- Input validation and sanitization
- Error handling middleware
- Firebase token verification

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-trading-club
JWT_SECRET=your_jwt_secret_here
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with Firebase/GitHub token

### Books
- `GET /api/books` - List all available books
- `POST /api/books` - Create a new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Trades
- `GET /api/trades` - List user's trades
- `POST /api/trades` - Create trade proposal
- `PUT /api/trades/:id` - Update trade status
- `PUT /api/trades/:id/complete` - Complete trade

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Models

### User
```typescript
interface IUser {
  username: string;
  email: string;
  location?: string;
  fullName?: string;
  books: mongoose.Types.ObjectId[];
}
```

### Book
```typescript
interface IBook {
  title: string;
  author: string;
  description: string;
  condition: BookCondition;
  owner: mongoose.Types.ObjectId;
  isAvailable: boolean;
  image?: string;
  isbn?: string;
  genre?: string[];
  publishedYear?: number;
}
```

### Trade
```typescript
interface ITrade {
  initiator: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  bookOffered: mongoose.Types.ObjectId;
  bookRequested: mongoose.Types.ObjectId;
  status: TradeStatus;
  message?: string;
}
```

## Development Guidelines

1. Follow RESTful API design principles
2. Use TypeScript decorators and types
3. Implement proper error handling
4. Validate all inputs
5. Use async/await for asynchronous operations
6. Write meaningful comments and documentation
7. Follow the existing project structure

## Error Handling

The API uses a consistent error response format:

```typescript
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
```

## Dependencies

Key dependencies and their purposes:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - CORS support
- `typescript` - Type safety
- `express-validator` - Input validation

## WebSocket Implementation Guide

### Server Setup

The WebSocket server is implemented using the `ws` package for real-time notifications and trade updates.

```typescript
// WebSocket configuration example
interface WSMessage {
  type: 'trade_request' | 'trade_accepted' | 'trade_rejected';
  payload: any;
}

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}
```

### Message Types

1. **Trade Request**
   ```typescript
   {
     type: 'trade_request',
     payload: {
       tradeId: string;
       bookRequested: string;
       bookOffered: string;
       initiator: string;
     }
   }
   ```

2. **Trade Status Update**
   ```typescript
   {
     type: 'trade_status',
     payload: {
       tradeId: string;
       status: 'accepted' | 'rejected' | 'completed';
     }
   }
   ```

### Authentication Flow

1. Client connects with JWT token
2. Server validates token and associates socket with user
3. Connection is maintained with ping/pong
4. Server sends notifications based on user ID

### Example Usage

```typescript
// Server-side broadcasting
const broadcastToUser = (userId: string, message: WSMessage) => {
  wss.clients.forEach(client => {
    const ws = client as AuthenticatedWebSocket;
    if (ws.userId === userId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

// Handling trade updates
tradeEmitter.on('tradeUpdated', (trade) => {
  const message: WSMessage = {
    type: 'trade_status',
    payload: {
      tradeId: trade._id,
      status: trade.status
    }
  };
  broadcastToUser(trade.initiator.toString(), message);
});
```

## Project Architecture

### Domain Layer

```
src/
└── models/
    ├── Book.ts       # Book domain model
    ├── Trade.ts      # Trade domain model
    └── User.ts       # User domain model
```

### Application Layer

```
src/
├── controllers/      # Business logic
├── services/        # Domain services
└── utils/           # Helper functions
```

### Infrastructure Layer

```
src/
├── config/          # Configuration
├── middleware/      # HTTP middleware
└── routes/          # API routes
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

### Security Architecture

1. **Authentication**
   - Firebase token verification
   - JWT token generation
   - Token refresh mechanism

2. **Authorization**
   - Role-based access control
   - Resource ownership validation
   - API endpoint protection

3. **Data Protection**
   - Input validation
   - Query injection prevention
   - Rate limiting
   - CORS configuration

### Error Handling Architecture

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

// Usage in controllers
const handleError = (err: AppError, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Log unexpected errors
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
};
```