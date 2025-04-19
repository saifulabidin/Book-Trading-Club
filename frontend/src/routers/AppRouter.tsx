import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import AddBook from '../pages/AddBook';
import Settings from '../pages/Settings';
import Trades from '../pages/Trades';
import Header from '../components/Header';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import PrivateRoute from '../components/PrivateRoute';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <KeyboardShortcuts />
      <Header />
      <main className="pt-6 pb-12">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/add-book"
              element={
                <PrivateRoute>
                  <AddBook />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/trades"
              element={
                <PrivateRoute>
                  <Trades />
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </BrowserRouter>
  );
};

export default AppRouter;
