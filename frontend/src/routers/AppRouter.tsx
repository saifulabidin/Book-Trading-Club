import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

// Core components
import Header from '../components/Header';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import PrivateRoute from '../components/PrivateRoute';
import LoadingSpinner from '../components/LoadingSpinner';

// Eagerly loaded pages
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import UserBooks from '../pages/UserBooks';

// Lazily loaded pages (code-splitting)
const AddBook = lazy(() => import('../pages/AddBook'));
const Settings = lazy(() => import('../pages/Settings'));
const Trades = lazy(() => import('../pages/Trades'));

/**
 * Main application router component
 * Handles route definitions and layouts
 */
const AppRouter = () => {
  return (
    <>
      <KeyboardShortcuts />
      <Header />
      <main className="pt-6 pb-12">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/user/:username/books" element={<UserBooks />} />
            
            {/* Protected routes */}
            <Route
              path="/add-book"
              element={
                <PrivateRoute>
                  <Suspense fallback={<PageLoader />}>
                    <AddBook />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Settings />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/trades"
              element={
                <PrivateRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Trades />
                  </Suspense>
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
};

/**
 * Loading indicator for lazy-loaded pages
 */
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <LoadingSpinner size="large" />
  </div>
);

export default AppRouter;
