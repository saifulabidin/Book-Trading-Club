import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/bookStore';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';

const SignIn = () => {
  const { currentUser, signInWithGithub } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract returnUrl from query parameters
  const getReturnUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('returnUrl') || '/';
  };

  // If user is already logged in, redirect to return URL or home
  useEffect(() => {
    if (currentUser) {
      navigate(getReturnUrl());
    }
  }, [currentUser, navigate, location.search]);

  const handleGithubLogin = async () => {
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      await signInWithGithub();
      navigate(getReturnUrl());
    } catch (error: any) {
      if (error.message) {
        setFormError(error.message);
      } else {
        setFormError('GitHub login failed. Please try again.');
      }
      console.error('GitHub login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto p-4 sm:p-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Sign In</h1>
        
        <AnimatePresence mode="wait">
          {formError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <ErrorAlert message={formError} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* GitHub Login Button */}
        <div className="my-6">
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={isSubmitting}
            className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 flex justify-center items-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
            <span>{isSubmitting ? 'Signing In...' : 'Continue with GitHub'}</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Book Trading Club uses GitHub for authentication.
            <br />
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Learn more about GitHub
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SignIn;