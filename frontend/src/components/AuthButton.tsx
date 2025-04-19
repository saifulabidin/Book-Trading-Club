import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/bookStore';
import Modal from './Modal';
import Button from './Button';
import ErrorAlert from './ErrorAlert';

const AuthButton = () => {
  const { currentUser, login, register, logout, signInWithGithub } = useStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs for focusing inputs
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const registerUsernameRef = useRef<HTMLInputElement>(null);

  // Set focus when modals open
  useEffect(() => {
    if (showLoginModal && loginEmailRef.current) {
      setTimeout(() => loginEmailRef.current?.focus(), 100);
    }
    if (showRegisterModal && registerUsernameRef.current) {
      setTimeout(() => registerUsernameRef.current?.focus(), 100);
    }
  }, [showLoginModal, showRegisterModal]);

  // Clear form errors when closing modals
  useEffect(() => {
    if (!showLoginModal && !showRegisterModal) {
      setFormError(null);
    }
  }, [showLoginModal, showRegisterModal]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await login(email, password);
      setShowLoginModal(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGithubLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any form submission
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      await signInWithGithub();
      setShowLoginModal(false);
      setShowRegisterModal(false);
    } catch (error) {
      console.error('GitHub login error:', error);
      setFormError(error instanceof Error ? error.message : 'GitHub login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await register(username, email, password);
      setShowRegisterModal(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Minimum length
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains symbol
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(Math.min(strength, 5));
  };

  const getStrengthColor = () => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500'
    ];
    return colors[passwordStrength] || colors[0];
  };

  const getStrengthLabel = () => {
    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[passwordStrength] || labels[0];
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Render user info when logged in
  if (currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-3"
      >
        {/* Username display */}
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentUser.username}
        </span>

        {/* Sign Out button */}
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="transition-all duration-300"
        >
          Sign Out
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="secondary" 
          onClick={() => setShowLoginModal(true)}
          aria-label="Sign in to your account"
        >
          Sign In
        </Button>
        <Button 
          variant="primary"
          onClick={() => setShowRegisterModal(true)}
          aria-label="Create a new account"
        >
          Sign Up
        </Button>
      </motion.div>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Sign In"
      >
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorAlert message={formError} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* GitHub Login Button - Outside the form for direct click handling */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 flex justify-center items-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>
          
          <div className="relative flex items-center justify-center text-sm my-4">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or use email</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
          </div>
          
          {/* Email login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                ref={loginEmailRef}
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                aria-describedby="email-description"
              />
              <p id="email-description" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter the email address associated with your account
              </p>
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:text-indigo-500 dark:focus:text-indigo-400"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300 focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="secondary"
                type="button"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Create an Account"
      >
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorAlert message={formError} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* GitHub Register Button - Outside the form */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 flex justify-center items-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
              </svg>
              <span>Sign up with GitHub</span>
            </button>
          </div>
          
          <div className="relative flex items-center justify-center text-sm my-4">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or register with email</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
          </div>
          
          {/* Email registration form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                required
                ref={registerUsernameRef}
                autoComplete="username"
                placeholder="username"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                aria-describedby="username-requirements"
              />
              <p id="username-requirements" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Username must be at least 3 characters and contain only letters, numbers, and underscore
              </p>
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              />
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                  aria-describedby="password-strength"
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:text-indigo-500 dark:focus:text-indigo-400"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password strength indicator */}
              <div id="password-strength" className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${getStrengthColor()}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[4rem] text-right">
                    {getStrengthLabel()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use at least 6 characters with a mix of letters, numbers & symbols
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="secondary"
                type="button"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={passwordStrength < 2}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AuthButton;