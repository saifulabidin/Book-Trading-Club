# Book Trading Club Frontend

This is the frontend application for the Book Trading Club project, built with React, TypeScript, and Vite.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── store/          # Zustand state management
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions and constants
│   ├── types/          # TypeScript type definitions
│   └── routers/        # React Router configuration
```

## Key Features

- GitHub OAuth authentication with Firebase
- Real-time notifications using WebSocket
- State management with Zustand
- Form validation with custom hooks
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Environment Variables

Create a `.env` file with:

```
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Directory Details

### Components
- `AuthButton.tsx` - GitHub authentication button
- `BookCard.tsx` - Book display component
- `Modal.tsx` - Reusable modal component
- `NotificationCenter.tsx` - Real-time notifications
- And more...

### Store
- `bookStore.ts` - Central state management using Zustand

### Hooks
- `useFormValidation.ts` - Form validation logic
- `useKeyPress.ts` - Keyboard shortcuts

### Utils
- `api.ts` - Axios configuration
- `firebase.ts` - Firebase setup
- `validation.ts` - Form validation rules

## Development Guidelines

1. Follow the existing TypeScript patterns and interfaces
2. Use Tailwind CSS for styling
3. Create reusable components in `/components`
4. Keep pages simple, move logic to hooks/store
5. Handle all API calls through the api.ts utility
6. Use proper error handling and loading states

## Dependencies

Key dependencies and their purposes:
- `react` - UI library
- `zustand` - State management
- `axios` - API requests
- `firebase` - Authentication
- `react-router-dom` - Routing
- `tailwindcss` - Styling
- `typescript` - Type safety
- `vite` - Build tool

## WebSocket Implementation Guide

### Client Setup

The WebSocket client is implemented in the NotificationCenter component and manages real-time trade notifications.

```typescript
// WebSocket hook example
const useWebSocket = (token: string | null) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      const socket = new WebSocket(import.meta.env.VITE_WS_URL);
      ws.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ token }));
        setIsConnected(true);
      };

      socket.onclose = () => {
        setIsConnected(false);
        setTimeout(connect, 5000); // Reconnection logic
      };
    };

    connect();
    return () => ws.current?.close();
  }, [token]);

  return { isConnected, ws: ws.current };
};
```

### Message Handling

```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'trade_request':
      handleTradeRequest(data.payload);
      break;
    case 'trade_status':
      handleTradeStatus(data.payload);
      break;
  }
};
```

### Integration with State Management

```typescript
// Zustand store integration
const handleTradeRequest = (payload: TradeRequest) => {
  useStore.getState().addNotification({
    type: 'trade_request',
    message: `New trade request for ${payload.bookRequested}`,
    tradeId: payload.tradeId
  });
};
```

## Application Architecture

### Component Architecture

```
components/
├── layout/           # Layout components
│   ├── Header.tsx
│   └── Footer.tsx
├── common/           # Reusable UI components
│   ├── Button.tsx
│   └── Modal.tsx
└── features/         # Feature-specific components
    ├── books/
    ├── trades/
    └── auth/
```

### State Management Architecture

#### Store Structure
```typescript
interface BookStore {
  // Domain State
  books: Book[];
  trades: Trade[];
  currentUser: User | null;

  // UI State
  isLoading: Record<string, boolean>;
  error: string | null;
  message: string | null;

  // Actions
  fetchBooks: () => Promise<void>;
  proposeTrade: (trade: TradeRequest) => Promise<void>;
  // ... more actions
}
```

### Data Flow Architecture

1. **Component Level**
```
User Action → Component → Action → API Call → Store Update → UI Update
```

2. **Real-time Updates**
```
WebSocket Event → Store Update → UI Update
```

### Component Design Patterns

1. **Container Pattern**
```typescript
// Container
const BooksContainer = () => {
  const books = useStore(state => state.books);
  const fetchBooks = useStore(state => state.fetchBooks);
  
  return <BooksList books={books} />;
};

// Presentation
const BooksList = ({ books }: { books: Book[] }) => (
  <div className="grid">
    {books.map(book => <BookCard key={book._id} book={book} />)}
  </div>
);
```

2. **Compound Components**
```typescript
const Modal = {
  Root: ({ children }: PropsWithChildren) => {...},
  Header: ({ title }: { title: string }) => {...},
  Body: ({ children }: PropsWithChildren) => {...},
  Footer: ({ children }: PropsWithChildren) => {...}
};
```

### Form Handling Architecture

```typescript
const useBookForm = (initialData?: Book) => {
  const { values, errors, handleChange, handleSubmit } = useFormValidation({
    initialValues: initialData || {
      title: '',
      author: '',
      description: '',
      condition: '',
      genre: []
    },
    validate: validateBook,
    onSubmit: async (values) => {
      await addBook(values);
    }
  });

  return { values, errors, handleChange, handleSubmit };
};
```

### Error Boundary Implementation

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Performance Optimization Patterns

1. **Memoization**
```typescript
const MemoizedBookCard = memo(BookCard, (prev, next) => {
  return prev.book._id === next.book._id && 
         prev.book.updatedAt === next.book.updatedAt;
});
```

2. **Code Splitting**
```typescript
const AddBook = lazy(() => import('./pages/AddBook'));
const Settings = lazy(() => import('./pages/Settings'));
```
