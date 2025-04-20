# Book Trading Club Frontend

This is the frontend application for the Book Trading Club project, built with React, TypeScript, and Vite.

## Table of Contents
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Directory Details](#directory-details)
- [Development Guidelines](#development-guidelines)
- [Dependencies](#dependencies)
- [WebSocket Implementation](#websocket-implementation)
- [Application Architecture](#application-architecture)
- [UI Components](#ui-components)
- [Performance Optimization](#performance-optimization)
- [Accessibility Features](#accessibility-features)

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── store/           # Zustand state management
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and constants
│   ├── types/           # TypeScript type definitions
│   └── routers/         # React Router configuration
├── public/             # Static assets
├── dist/               # Build output directory
└── tests/              # Test files
```

## Key Features

- GitHub OAuth authentication via Firebase
- Real-time trade notifications using WebSockets
- Centralized state management with Zustand
- Form validation with custom validation hooks
- Responsive UI design with Tailwind CSS
- TypeScript for enhanced type safety
- Efficient data fetching and caching
- Dark mode support
- Keyboard shortcuts for common actions
- Accessibility compliance

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
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
- `BookCardSkeleton.tsx` - Loading skeleton for book cards
- `Button.tsx` - Reusable button component with variants
- `ConfirmDeleteModal.tsx` - Confirmation dialog for deletions
- `DarkModeToggle.tsx` - Theme switcher
- `ErrorAlert.tsx` - Error message display
- `ErrorBoundary.tsx` - React error boundary for catching errors
- `Header.tsx` - Application header with navigation
- `KeyboardShortcuts.tsx` - Keyboard controls component
- `LoadingSpinner.tsx` - Loading indicator
- `MessageToast.tsx` - Toast notifications
- `Modal.tsx` - Reusable modal dialog
- `NotificationCenter.tsx` - Real-time notifications display
- `PrivateRoute.tsx` - Route protection component
- `SearchAndFilter.tsx` - Search and filtering controls
- `Toast.tsx` - Individual toast notification
- `ToastContainer.tsx` - Container for toast notifications

### Hooks
- `useAuth.ts` - Authentication hook
- `useFormValidation.ts` - Form validation logic
- `useKeyPress.ts` - Keyboard event handler
- `useWebSocket.ts` - WebSocket connection management

### Store
- `bookStore.ts` - Zustand store for application state
- `storeHelpers.ts` - Helper functions for the store

### Utils
- `animations.ts` - Animation utilities
- `api.ts` - Axios configuration and API calls
- `constants.ts` - Application constants
- `firebase.ts` - Firebase configuration
- `helpers.ts` - Helper functions
- `typeGuards.ts` - TypeScript type guard functions
- `validation.ts` - Form validation rules

## Development Guidelines

1. Follow TypeScript best practices
   - Use proper type definitions
   - Avoid `any` type when possible
   - Use interfaces for object shapes
   - Use type guards for runtime type checking

2. Component development
   - Keep components focused on a single responsibility
   - Extract reusable logic to hooks
   - Use React.memo for performance optimizations where appropriate
   - Follow the presentational/container component pattern

3. State management
   - Use Zustand store for global state
   - Use React's useState/useReducer for local component state
   - Keep related state together
   - Normalize complex data structures

4. Styling
   - Use Tailwind CSS utility classes for styling
   - Follow mobile-first responsive design principles
   - Keep component styling consistent
   - Use design tokens for colors, spacing, etc.

5. Code quality
   - Follow consistent naming conventions
   - Write meaningful comments
   - Use ESLint and Prettier for code formatting
   - Implement proper error handling

## Dependencies

Key dependencies and their purposes:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `zustand` - State management
- `firebase` - Authentication
- `axios` - API requests
- `tailwindcss` - Utility-first CSS framework
- `typescript` - Type checking
- `vite` - Build tool and dev server
- `vitest` - Testing library
- `eslint` - Code linting
- `prettier` - Code formatting

## WebSocket Implementation

The frontend uses WebSockets to receive real-time updates about trades and other notifications.

### WebSocket Hook

The `useWebSocket` hook manages the WebSocket connection and reconnection logic:

```typescript
const useWebSocket = (token: string | null) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      const socket = new WebSocket(import.meta.env.VITE_WS_URL);
      ws.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        // Send authentication token
        socket.send(JSON.stringify({ token }));
        setIsConnected(true);
      };

      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        // Implement reconnection with exponential backoff
        setTimeout(connect, 5000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();
    
    // Clean up on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token]);

  return { isConnected, ws: ws.current };
};
```

### Message Handling

WebSocket messages are processed in the NotificationCenter component:

```typescript
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data) as WSMessage;
    
    switch (data.type) {
      case 'trade_request':
        handleTradeRequest(data.payload);
        break;
      case 'trade_status':
        handleTradeStatus(data.payload);
        break;
      case 'system_notification':
        handleSystemNotification(data.payload);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  } catch (error) {
    console.error('Error processing WebSocket message:', error);
  }
};
```

### Integration with State Management

WebSocket events are integrated with the Zustand store to update application state:

```typescript
// Handling trade request notifications
const handleTradeRequest = (payload: TradeRequestPayload) => {
  // Create a notification
  const notification: Notification = {
    type: 'trade_request',
    message: `New trade proposal for your book`,
    tradeId: payload.tradeId,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  // Update store
  useStore.getState().addNotification(notification);
  useStore.getState().fetchUserTrades();
  
  // Play notification sound
  notificationSound.play();
};
```

## Application Architecture

### Component Architecture

Components are organized by their responsibility:

```
components/
├── layout/           # Layout components
│   ├── Header.tsx    # Main navigation
│   └── Footer.tsx    # Page footer
├── common/           # Reusable UI components
│   ├── Button.tsx    # Button variants
│   ├── Card.tsx      # Card container
│   └── Modal.tsx     # Modal dialog
└── features/         # Feature-specific components
    ├── books/        # Book-related components
    ├── trades/       # Trade-related components
    └── auth/         # Authentication components
```

### State Management Architecture

The application uses Zustand for state management with a well-structured store:

```typescript
interface BookStore {
  // Domain State - Application data
  books: Book[];
  currentUser: User | null;
  trades: Trade[];
  
  // UI State - Interface state
  unseenTradesCount: number;
  notifications: Notification[];
  filters: {
    search: string;
    categories: string[];
    condition: string[];
  };
  isAuthenticated: boolean;
  isLoading: {
    auth: boolean;
    books: boolean;
    trades: boolean;
  };
  error: string | null;
  message: string | null;
  
  // Actions - Methods to update state
  checkAuthStatus: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  
  fetchBooks: () => Promise<void>;
  addBook: (book: NewBook) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  
  fetchUserTrades: () => Promise<void>;
  proposeTrade: (proposerBookId: string, receiverBookId: string) => Promise<void>;
  updateTradeStatus: (tradeId: string, status: TradeStatus) => Promise<void>;
  
  addNotification: (notification: NotificationData) => void;
  markNotificationAsRead: (notificationId: string) => void;
}
```

### Data Flow Architecture

Data flows through the application in predictable patterns:

1. **User Interactions → State Changes**
```
User Action → Component → Action → API Call → Store Update → UI Update
```

2. **Real-time Updates**
```
WebSocket Event → Store Update → UI Update
```

3. **Routing Transitions**
```
Route Change → Page Component → Data Fetch → Render
```

### Component Design Patterns

The application employs several React design patterns:

1. **Container/Presentation Pattern**
```typescript
// Container component
const BookListContainer: React.FC = () => {
  const books = useStore(state => state.books);
  const isLoading = useStore(state => state.isLoading.books);
  const fetchBooks = useStore(state => state.fetchBooks);
  
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  
  return <BookList books={books} isLoading={isLoading} />;
};

// Presentation component
const BookList: React.FC<BookListProps> = ({ books, isLoading }) => {
  if (isLoading) return <BookListSkeleton />;
  if (books.length === 0) return <EmptyState message="No books found" />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map(book => <BookCard key={book._id} book={book} />)}
    </div>
  );
};
```

2. **Compound Components**
```typescript
const Modal = {
  Root: ({ children, isOpen, onClose }: ModalRootProps) => (
    <div className={`modal ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">{children}</div>
    </div>
  ),
  Header: ({ title }: ModalHeaderProps) => (
    <div className="modal-header">
      <h2>{title}</h2>
    </div>
  ),
  Body: ({ children }: PropsWithChildren) => (
    <div className="modal-body">{children}</div>
  ),
  Footer: ({ children }: PropsWithChildren) => (
    <div className="modal-footer">{children}</div>
  )
};

// Usage
<Modal.Root isOpen={isOpen} onClose={handleClose}>
  <Modal.Header title="Confirm Trade" />
  <Modal.Body>Are you sure you want to trade?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal.Root>
```

3. **Custom Hooks**
```typescript
const useBookForm = (initialData?: Book) => {
  const { values, errors, handleChange, handleSubmit } = useFormValidation({
    initialValues: initialData || {
      title: '',
      author: '',
      description: '',
      condition: 'Good',
      genre: []
    },
    validate: validateBook,
    onSubmit: async (values) => {
      await useStore.getState().addBook(values);
    }
  });

  return { values, errors, handleChange, handleSubmit };
};
```

## UI Components

The application includes a comprehensive set of UI components:

1. **Data Display**
   - BookCard - Display book information
   - UserProfile - Show user details
   - TradeList - List of trade proposals

2. **Inputs & Forms**
   - SearchInput - Search functionality
   - FilterSelect - Filter options
   - BookForm - Add/edit book form

3. **Feedback**
   - Toast - Non-intrusive notifications
   - ErrorAlert - Error messages
   - LoadingSpinner - Loading indicator

4. **Navigation**
   - Header - Main navigation
   - TabBar - Section navigation
   - Pagination - Page navigation

5. **Modals & Dialogs**
   - ConfirmDialog - Confirmation prompts
   - TradeProposalModal - Trade creation
   - BookDetailModal - Book details view

## Performance Optimization

The application implements various performance optimizations:

1. **Component Memoization**
```typescript
const MemoizedBookCard = memo(BookCard, (prev, next) => {
  // Only re-render if the relevant props changed
  return (
    prev.book._id === next.book._id &&
    prev.book.updatedAt === next.book.updatedAt
  );
});
```

2. **Code Splitting with React.lazy**
```typescript
// Lazy-loaded routes
const AddBook = lazy(() => import('./pages/AddBook'));
const UserSettings = lazy(() => import('./pages/Settings'));
const TradeHistory = lazy(() => import('./pages/Trades'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/add-book" element={<AddBook />} />
  <Route path="/settings" element={<UserSettings />} />
  <Route path="/trades" element={<TradeHistory />} />
</Suspense>
```

3. **Virtualization for Long Lists**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedBookList = ({ books }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: books.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <BookCard book={books[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

4. **Optimized Re-rendering**
```typescript
// Using useCallback for event handlers
const handleTradeClick = useCallback(() => {
  openTradeModal(book._id);
}, [book._id, openTradeModal]);

// Using useMemo for derived data
const availableBooks = useMemo(() => {
  return books.filter(book => book.isAvailable);
}, [books]);
```

## Accessibility Features

The application implements accessibility features:

1. **Semantic HTML**
```jsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current={isHome ? 'page' : undefined}>Home</a></li>
  </ul>
</nav>
```

2. **ARIA Attributes**
```jsx
<button 
  aria-label="Close modal"
  aria-pressed={isPressed}
  onClick={onClose}
>
  ×
</button>
```

3. **Focus Management**
```typescript
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Save previous focus
      const previousActiveElement = document.activeElement as HTMLElement;
      
      // Focus first focusable element in modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
      
      // Restore focus on close
      return () => {
        previousActiveElement?.focus();
      };
    }
  }, [isOpen]);

  return (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className={isOpen ? 'modal-open' : 'modal-closed'}
    >
      {children}
    </div>
  );
};
```

4. **Keyboard Navigation**
```typescript
const KeyboardShortcut = ({ keys, action }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.every(key => key === e.key || key === e.code)) {
        e.preventDefault();
        action();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, action]);
  
  return null;
};

// Usage
<KeyboardShortcut keys={['/']} action={() => focusSearchInput()} />
```
