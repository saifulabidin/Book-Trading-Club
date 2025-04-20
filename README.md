# Book Trading Club

A full-stack web application that allows users to trade books with other book enthusiasts. Built with React, TypeScript, Node.js, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Features

- 📚 Browse available books for trading
- 🔐 Secure authentication with Firebase (GitHub OAuth)
- 💌 Real-time notifications for trade requests and updates via WebSockets
- 📱 Responsive design with Tailwind CSS
- 🔍 Advanced search and filtering options
- 💬 In-app messaging for trade negotiations
- 🔄 Status tracking for trade proposals
- 📋 User profile management
- 📲 Mobile-friendly interface
- ⚡ Fast and modern tech stack with TypeScript

## Tech Stack

### Frontend
- React with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- Zustand for state management
- Firebase Authentication
- WebSocket for real-time notifications
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with TypeScript
- Express.js framework
- MongoDB with Mongoose
- JWT authentication
- WebSocket for real-time features
- Input validation and sanitization
- Error handling middleware

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- A Firebase project (for authentication)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saifulabidin/book-trading-club.git
   cd book-trading-club
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:

   Backend (.env):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/book-trading-club
   JWT_SECRET=your_jwt_secret_here
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

   Frontend (.env):
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

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Deployment

### Backend Deployment

#### Digital Ocean
1. Create a Digital Ocean App Platform project
2. Set up environment variables in Digital Ocean dashboard
3. Configure MongoDB Atlas for production database
4. Set up PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name book-trading-backend
   ```

#### Docker Container
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### AWS
- Set up Elastic Beanstalk or EC2 instance
- Configure security groups
- Set up MongoDB Atlas VPC peering
- Use managed services for monitoring and logging

### Frontend Deployment

#### Vercel
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set up environment variables in Vercel dashboard
4. Deploy!

#### Netlify
- Connect GitHub repository
- Configure build settings
- Set up environment variables
- Enable auto-deployment

### Production Security Checklist

- [ ] Enable HTTPS
- [ ] Set secure headers
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Set up DDoS protection
- [ ] Perform regular security updates
- [ ] Use secure cookie settings
- [ ] Protect environment variables
- [ ] Rotate API keys regularly
- [ ] Set up proper authentication flows
- [ ] Implement proper error handling

## API Documentation

The API documentation is available at `/api/docs` when running the backend server. Key endpoints include:

### Authentication
- `POST /api/auth/login` - Authenticate user with GitHub OAuth token

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

## Troubleshooting Guide

### Common Issues and Solutions

#### Backend Issues

1. **MongoDB Connection Errors**
   ```
   Problem: "MongoServerError: bad auth : authentication failed"
   Solution: Check your MongoDB URI and credentials in .env
   ```

2. **JWT Token Issues**
   ```
   Problem: "JsonWebTokenError: invalid signature"
   Solution: Ensure JWT_SECRET is properly set and matches between auth and verification
   ```

3. **WebSocket Connection Failures**
   ```
   Problem: "WebSocket connection to 'ws://localhost:5000' failed"
   Solution: Check if the backend server is running and WebSocket port is accessible
   ```

#### Frontend Issues

1. **Firebase Authentication**
   ```
   Problem: "Firebase: Error (auth/configuration-not-found)"
   Solution: Verify Firebase configuration in .env and Firebase Console settings
   ```

2. **API Connection Issues**
   ```
   Problem: "Network Error: Failed to fetch"
   Solution: Check if backend is running and VITE_API_URL is correctly set
   ```

3. **Build Errors**
   ```
   Problem: "TypeError: Cannot read properties of undefined"
   Solution: Check for null values in components and add proper type checking
   ```

### Development Tools

- **MongoDB Compass** - GUI for database management
- **Redux DevTools** - For state debugging (works with Zustand)
- **React Developer Tools** - For component debugging
- **Postman/Insomnia** - For API testing
- **VS Code with ESLint/Prettier** - For code quality and formatting

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes following the code style guidelines
4. Write tests for your changes
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request with a detailed description of changes

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

Run E2E tests (requires both backend and frontend running):
```bash
npm run test:e2e
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [MongoDB](https://www.mongodb.com)
- [Express.js](https://expressjs.com)
- [Zustand](https://github.com/pmndrs/zustand)

## Contact

- GitHub: [@saifulabidin](https://github.com/saifulabidin)
- Email: syaiful.osd@yahoo.com
- LinkedIn: [Saiful Abidin](https://linkedin.com/in/saifulabidin)
