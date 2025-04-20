import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/bookStore';
import { ToastManager } from '../components/ToastContainer';

/**
 * Options for the useAuth hook
 */
interface UseAuthOptions {
  /** Path to redirect to after login */
  redirectTo?: string;
  /** Whether to show success messages */
  showSuccessToasts?: boolean;
  /** Whether to show error messages */
  showErrorToasts?: boolean;
}

/**
 * Custom hook for authentication-related functionality
 * Provides methods for login, logout, and auth state checking
 * 
 * @param options - Configuration options
 * @returns Auth-related methods and state
 */
export function useAuth(options: UseAuthOptions = {}) {
  const { 
    redirectTo = '/',
    showSuccessToasts = true, 
    showErrorToasts = true 
  } = options;

  const navigate = useNavigate();
  
  const { 
    currentUser, 
    isAuthenticated,
    isLoading,
    signInWithGithub, 
    logout, 
    checkAuthStatus
  } = useStore();

  /**
   * Handles GitHub authentication with error handling and redirection
   * 
   * @param returnUrl - Where to redirect after successful login
   */
  const handleGithubLogin = useCallback(async (returnUrl?: string) => {
    try {
      await signInWithGithub();
      
      if (showSuccessToasts) {
        ToastManager.success('Successfully signed in!');
      }
      
      navigate(returnUrl || redirectTo);
    } catch (error) {
      if (showErrorToasts) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to sign in with GitHub';
          
        ToastManager.error(errorMessage, 'Authentication Error');
      }
      
      console.error('GitHub login error:', error);
      return false;
    }
    
    return true;
  }, [signInWithGithub, navigate, redirectTo, showSuccessToasts, showErrorToasts]);

  /**
   * Handles logout with cleanup and redirection
   * 
   * @param returnToLogin - Whether to redirect to login page after logout
   */
  const handleLogout = useCallback(async (returnToLogin = false) => {
    try {
      await logout();
      
      if (showSuccessToasts) {
        ToastManager.info('You have been signed out');
      }
      
      if (returnToLogin) {
        navigate('/login');
      }
    } catch (error) {
      if (showErrorToasts) {
        ToastManager.error('Failed to sign out properly', 'Logout Error');
      }
      console.error('Logout error:', error);
      return false;
    }
    
    return true;
  }, [logout, navigate, showSuccessToasts, showErrorToasts]);

  /**
   * Checks if the user is authenticated and refreshes auth state if needed
   */
  const refreshAuthStatus = useCallback(async () => {
    await checkAuthStatus();
    return isAuthenticated;
  }, [checkAuthStatus, isAuthenticated]);

  return {
    currentUser,
    isAuthenticated,
    isLoading: isLoading.auth,
    login: handleGithubLogin,
    logout: handleLogout,
    checkAuth: refreshAuthStatus
  };
}
