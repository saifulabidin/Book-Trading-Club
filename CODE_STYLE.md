# Code Style Guide

## Table of Contents
- [Overview](#overview)
- [TypeScript Guidelines](#typescript-guidelines)
  - [Type Definitions](#type-definitions)
  - [Naming Conventions](#naming-conventions)
  - [File Organization](#file-organization)
- [React Best Practices](#react-best-practices)
  - [Component Organization](#component-organization)
  - [Hook Usage](#hook-usage)
  - [State Management](#state-management)
- [Backend Guidelines](#backend-guidelines)
  - [Controller Structure](#controller-structure)
  - [Error Handling](#error-handling)
- [CSS/Tailwind Guidelines](#csstailtwind-guidelines)
  - [Class Organization](#class-organization)
  - [Component Styling](#component-styling)
- [Git Commit Guidelines](#git-commit-guidelines)
  - [Commit Message Format](#commit-message-format)
  - [Types](#types)
  - [Examples](#examples)
- [Code Review Guidelines](#code-review-guidelines)
  - [Pull Request Template](#pull-request-template)
  - [Review Checklist](#review-checklist)
- [Documentation Guidelines](#documentation-guidelines)
  - [Component Documentation](#component-documentation)
  - [Function Documentation](#function-documentation)
- [Performance Guidelines](#performance-guidelines)
  - [React Performance](#react-performance)
  - [API Performance](#api-performance)
- [Accessibility Guidelines](#accessibility-guidelines)
  - [ARIA Attributes](#aria-attributes)
  - [Keyboard Navigation](#keyboard-navigation)

## Overview

This document outlines coding standards and best practices for the Book Trading Club project.

## TypeScript Guidelines

### Type Definitions

```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  name: string;
}

// Use type for unions, intersections, and primitives
type Status = 'pending' | 'approved' | 'rejected';
type NumericId = number;
```

### Naming Conventions

- **Interfaces**: PascalCase, descriptive names
  ```typescript
  interface BookDetails {}
  interface TradeRequest {}
  ```

- **Types**: PascalCase, descriptive names
  ```typescript
  type BookCondition = 'new' | 'used';
  type ValidationResult = boolean;
  ```

- **Variables**: camelCase, descriptive names
  ```typescript
  const currentUser = getUserProfile();
  let isLoading = false;
  ```

- **Functions**: camelCase, verb prefixes
  ```typescript
  function getUserBooks() {}
  const updateProfile = () => {};
  ```

- **Components**: PascalCase
  ```typescript
  function BookCard() {}
  const TradeModal = () => {};
  ```

### File Organization

```typescript
// Imports ordering
import { useState, useEffect } from 'react';           // React imports first
import { useNavigate } from 'react-router-dom';       // Third-party imports
import { Book } from '../types';                      // Local type imports
import { useStore } from '../store/bookStore';        // Local store imports
import BookCard from '../components/BookCard';         // Local component imports
import { formatDate } from '../utils/formatters';      // Local utility imports

// Component structure
export default function BookList() {
  // Hooks first
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  
  // Effects second
  useEffect(() => {
    loadBooks();
  }, []);
  
  // Event handlers and other functions third
  const handleBookClick = (id: string) => {
    navigate(`/books/${id}`);
  };
  
  // Render helpers last
  const renderBookCard = (book: Book) => (
    <BookCard key={book._id} book={book} onClick={handleBookClick} />
  );
  
  // Final return
  return (
    <div className="grid grid-cols-3 gap-4">
      {books.map(renderBookCard)}
    </div>
  );
}
```

## React Best Practices

### Component Organization

```typescript
// Prefer functional components
const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  // Implementation
};

// Use proper prop types
interface BookCardProps {
  book: Book;
  onClick?: (id: string) => void;
  className?: string;
}
```

### Hook Usage

```typescript
// Custom hook naming and structure
const useBookDetails = (bookId: string) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Implementation
  
  return { book, isLoading, error };
};
```

### State Management

```typescript
// Zustand store organization
interface BookStore {
  // State
  books: Book[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBooks: () => Promise<void>;
  addBook: (book: NewBook) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
}
```

## Backend Guidelines

### Controller Structure

```typescript
// Controller organization
export class BookController {
  // GET methods first
  async getBooks(req: Request, res: Response) {
    // Implementation
  }
  
  // POST methods second
  async createBook(req: Request, res: Response) {
    // Implementation
  }
  
  // PUT methods third
  async updateBook(req: Request, res: Response) {
    // Implementation
  }
  
  // DELETE methods last
  async deleteBook(req: Request, res: Response) {
    // Implementation
  }
}
```

### Error Handling

```typescript
// Consistent error handling
try {
  const result = await someOperation();
  return res.json(result);
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details
    });
  }
  
  return res.status(500).json({
    message: 'Internal server error'
  });
}
```

## CSS/Tailwind Guidelines

### Class Organization

```html
<!-- Class order: layout, spacing, typography, colors, other -->
<div 
  class="
    flex flex-col          <!-- Layout -->
    p-4 my-2              <!-- Spacing -->
    text-lg font-bold     <!-- Typography -->
    text-gray-800         <!-- Colors -->
    hover:shadow-lg       <!-- Other -->
  "
>
```

### Component Styling

```typescript
// Consistent component styling
const Button = ({ variant = 'primary', children }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

## Git Commit Guidelines

### Commit Message Format

```
type(scope): subject

body

footer
```

### Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

### Examples

```
feat(auth): implement GitHub OAuth login

- Add GitHub OAuth flow
- Store JWT token
- Handle login errors

Closes #123
```

```
fix(api): correct book trade status update

- Fix race condition in trade status updates
- Add proper error handling
- Update tests

Fixes #456
```

## Code Review Guidelines

### Pull Request Template

```markdown
## Description
[Description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments are clear and helpful
- [ ] Documentation is updated
- [ ] Tests are passing
- [ ] No new warnings
```

### Review Checklist

- Code follows project style guide
- No unnecessary code duplication
- Proper error handling
- Adequate test coverage
- Documentation is updated
- Performance considerations
- Security implications
- Accessibility requirements

## Documentation Guidelines

### Component Documentation

```typescript
/**
 * BookCard component displays a book's information in a card format
 *
 * @component
 * @example
 * ```tsx
 * <BookCard
 *   book={bookData}
 *   onClick={handleBookClick}
 *   className="custom-class"
 * />
 * ```
 */
export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  className
}) => {
  // Implementation
};
```

### Function Documentation

```typescript
/**
 * Formats a trade request for display
 *
 * @param trade - The trade object to format
 * @param currentUserId - ID of the current user
 * @returns Formatted trade information
 * @throws {Error} If trade object is invalid
 */
export function formatTradeRequest(
  trade: Trade,
  currentUserId: string
): FormattedTrade {
  // Implementation
}
```

## Performance Guidelines

### React Performance

- Use React.memo for expensive renders
- Implement proper dependency arrays in useEffect
- Avoid inline function definitions in JSX
- Use proper key props in lists
- Implement virtualization for long lists

### API Performance

- Implement proper database indexes
- Use query pagination
- Cache frequently accessed data
- Optimize database queries
- Use appropriate HTTP caching headers

## Accessibility Guidelines

### ARIA Attributes

```typescript
// Proper ARIA usage
const Modal = ({ isOpen, onClose, title, children }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-content"
  >
    <h2 id="modal-title">{title}</h2>
    <div id="modal-content">{children}</div>
    <button
      onClick={onClose}
      aria-label="Close modal"
    >
      ×
    </button>
  </div>
);
```

### Keyboard Navigation

- Implement proper focus management
- Use semantic HTML elements
- Provide keyboard shortcuts
- Ensure all interactive elements are focusable