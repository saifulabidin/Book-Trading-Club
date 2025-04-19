# Testing Guide

This document outlines the testing strategy and setup for both frontend and backend components.

## Backend Testing

### Setup

We use Jest for unit testing and Supertest for API integration testing.

1. Install dependencies:
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

2. Configure Jest in `backend/jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**/*.ts'
  ]
};
```

### Test Structure

```
backend/
└── src/
    └── tests/
        ├── setup.ts                  # Test setup and configuration
        ├── fixtures/                 # Test data
        │   ├── books.ts
        │   ├── trades.ts
        │   └── users.ts
        ├── integration/             # API tests
        │   ├── auth.test.ts
        │   ├── books.test.ts
        │   └── trades.test.ts
        └── unit/                    # Unit tests
            ├── models/
            ├── controllers/
            └── utils/
```

### Example Tests

#### Unit Test Example (User Model)
```typescript
import { User } from '../models/User';

describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await user.save();
    expect(user.password).not.toBe('password123');
  });
});
```

#### Integration Test Example (Book API)
```typescript
import request from 'supertest';
import app from '../index';
import { createTestUser, getAuthToken } from './helpers';

describe('Book API', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should create a new book', async () => {
    const response = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
        condition: 'New'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Book');
  });
});
```

## Frontend Testing

### Setup

We use Vitest and React Testing Library for frontend testing.

1. Install dependencies:
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

2. Configure Vitest in `frontend/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/']
    }
  }
});
```

### Test Structure

```
frontend/
└── src/
    └── tests/
        ├── setup.ts                 # Test setup
        ├── mocks/                  # Mock data and services
        │   ├── books.ts
        │   ├── trades.ts
        │   └── handlers.ts
        ├── components/             # Component tests
        │   ├── BookCard.test.tsx
        │   └── SearchAndFilter.test.tsx
        ├── hooks/                  # Custom hook tests
        │   └── useFormValidation.test.ts
        └── store/                  # Store tests
            └── bookStore.test.ts
```

### Example Tests

#### Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '../components/BookCard';

describe('BookCard', () => {
  const mockBook = {
    _id: '1',
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    condition: 'New'
  };

  it('renders book information correctly', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('shows trade modal when trade button is clicked', () => {
    render(<BookCard book={mockBook} />);
    fireEvent.click(screen.getByText('Propose Trade'));
    expect(screen.getByText('Select your book to offer')).toBeInTheDocument();
  });
});
```

#### Hook Test
```typescript
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../hooks/useFormValidation';

describe('useFormValidation', () => {
  it('validates required fields', () => {
    const { result } = renderHook(() => useFormValidation({
      initialValues: { title: '' },
      validate: values => {
        const errors: Record<string, string> = {};
        if (!values.title) errors.title = 'Title is required';
        return errors;
      }
    }));

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors.title).toBe('Title is required');
  });
});
```

### E2E Testing

We use Cypress for end-to-end testing.

1. Install Cypress:
```bash
npm install --save-dev cypress
```

2. Example E2E test:
```typescript
describe('Book Trading Flow', () => {
  beforeEach(() => {
    cy.login();
  });

  it('allows user to create and trade books', () => {
    // Add a book
    cy.visit('/add-book');
    cy.get('[name="title"]').type('Test Book');
    cy.get('[name="author"]').type('Test Author');
    cy.get('[type="submit"]').click();
    cy.url().should('include', '/');

    // Propose a trade
    cy.get('[data-testid="book-card"]').first().click();
    cy.get('[data-testid="trade-button"]').click();
    cy.get('[data-testid="book-select"]').select('Test Book');
    cy.get('[data-testid="propose-trade"]').click();
    
    // Verify trade creation
    cy.visit('/trades');
    cy.contains('Test Book').should('exist');
  });
});
```

## Test Coverage Goals

- Backend:
  - Unit Tests: 80% coverage
  - Integration Tests: All API endpoints
  - Model Tests: All mongoose models

- Frontend:
  - Component Tests: All interactive components
  - Hook Tests: All custom hooks
  - Store Tests: All actions and state updates
  - E2E Tests: Critical user flows

## CI/CD Integration

Tests are run automatically in GitHub Actions:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install Backend Dependencies
        run: cd backend && npm install
        
      - name: Run Backend Tests
        run: cd backend && npm test
        
      - name: Install Frontend Dependencies
        run: cd frontend && npm install
        
      - name: Run Frontend Tests
        run: cd frontend && npm test
        
      - name: Run E2E Tests
        run: npm run test:e2e
```

## Writing Good Tests

### Best Practices

1. **Arrange-Act-Assert** pattern
   ```typescript
   it('updates book availability', async () => {
     // Arrange
     const book = await createTestBook();
     
     // Act
     await markBookUnavailable(book._id);
     
     // Assert
     const updated = await getBook(book._id);
     expect(updated.isAvailable).toBe(false);
   });
   ```

2. **Use Data Builders**
   ```typescript
   const createTestBook = (overrides = {}) => ({
     title: 'Test Book',
     author: 'Test Author',
     description: 'Test Description',
     condition: 'New',
     ...overrides
   });
   ```

3. **Mock External Dependencies**
   ```typescript
   jest.mock('../utils/api', () => ({
     get: jest.fn(),
     post: jest.fn()
   }));
   ```

### Common Testing Scenarios

1. **Async Operations**
   ```typescript
   it('loads books asynchronously', async () => {
     const { result } = renderHook(() => useStore());
     
     await act(async () => {
       await result.current.fetchBooks();
     });
     
     expect(result.current.books.length).toBeGreaterThan(0);
   });
   ```

2. **User Interactions**
   ```typescript
   it('handles form submission', async () => {
     render(<AddBook />);
     
     fireEvent.change(screen.getByLabelText('Title'), {
       target: { value: 'New Book' }
     });
     
     fireEvent.click(screen.getByText('Add Book'));
     
     await waitFor(() => {
       expect(screen.getByText('Book added successfully')).toBeInTheDocument();
     });
   });
   ```

3. **Error States**
   ```typescript
   it('displays error message', async () => {
     server.use(
       rest.get('/api/books', (req, res, ctx) => {
         return res(ctx.status(500));
       })
     );
     
     render(<Home />);
     
     await waitFor(() => {
       expect(screen.getByText('Failed to fetch books')).toBeInTheDocument();
     });
   });
   ```