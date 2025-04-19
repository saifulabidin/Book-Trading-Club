# Book Trading Club

A full-stack web application that allows users to trade books with other book enthusiasts. Built with React, TypeScript, Node.js, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Backend Deployment](#backend-deployment-example-with-digital-ocean)
- [Frontend Deployment](#frontend-deployment-example-with-vercel)
- [Production Security Checklist](#production-security-checklist)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Development Tools](#development-tools)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)


## Features

- 📚 Browse available books for trading
- 🔐 Secure authentication with Firebase (GitHub OAuth)
- 💌 Real-time notifications for trade requests and updates
- 📱 Responsive design with Tailwind CSS
- 🔍 Advanced search and filtering options
- 💬 In-app messaging for trade negotiations
- ⚡ Fast and modern tech stack

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
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=
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

### Backend Deployment (Example with Digital Ocean)

1. Create a Digital Ocean Droplet or App Platform project
2. Set up environment variables in Digital Ocean dashboard
3. Configure MongoDB Atlas for production database
4. Set up PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name book-trading-backend
   ```

### Frontend Deployment (Example with Vercel)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Extended Deployment Guide

#### Backend Deployment Options

##### Digital Ocean Deployment

1. **Using App Platform**:
   ```bash
   # Install doctl
   brew install doctl  # macOS
   snap install doctl # Ubuntu

   # Authenticate with Digital Ocean
   doctl auth init

   # Create app
   doctl apps create --spec app.yaml
   ```

2. **Using Docker**:
   ```dockerfile
   FROM node:16
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

##### AWS Deployment

1. **Using Elastic Beanstalk**:
   - Create application
   - Upload source bundle
   - Configure environment variables
   - Set up MongoDB Atlas VPC peering

2. **Using EC2**:
   - Launch EC2 instance
   - Configure security groups
   - Set up Nginx reverse proxy
   - Use PM2 for process management

#### Frontend Deployment Options

##### Vercel Deployment

1. **Automatic Deployment**:
   - Connect GitHub repository
   - Configure build settings
   - Set environment variables

2. **Manual Deployment**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

##### Netlify Deployment

1. **Using Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy
   ```

2. **Using GitHub Integration**:
   - Connect repository
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```

### Production Security Checklist

- [ ] Enable HTTPS
- [ ] Set secure headers
- [ ] Configure CORS properly
- [ ] Rate limiting
- [ ] Input validation
- [ ] DDoS protection
- [ ] Regular security updates
- [ ] Secure cookie settings
- [ ] Environment variable protection
- [ ] API key rotation

### Monitoring and Logging

1. **Backend Monitoring**:
   - PM2 monitoring
   - MongoDB Atlas monitoring
   - Application logs
   - Error tracking (Sentry)

2. **Frontend Monitoring**:
   - Performance monitoring
   - Error tracking
   - User analytics
   - Console error monitoring

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

1. **MongoDB Compass** - GUI for database management
2. **Redux DevTools** - For state debugging (works with Zustand)
3. **React Developer Tools** - For component debugging
4. **Postman/Insomnia** - For API testing

## API Documentation

The API documentation is available at `/api/docs` when running the backend server. Key endpoints include:

- `POST /api/auth/login` - Authenticate user
- `GET /api/books` - List all available books
- `POST /api/trades` - Create a trade proposal
- `GET /api/trades` - List user's trades
- `PUT /api/users/profile` - Update user profile

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [MongoDB](https://www.mongodb.com)

## Contact

- GitHub: [@saifulabidin](https://github.com/saifulabidin)
- Email: syaiful.osd@yahoo.com
