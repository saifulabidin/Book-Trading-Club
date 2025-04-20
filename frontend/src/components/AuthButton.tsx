import { motion } from 'framer-motion';
import { useStore } from '../store/bookStore';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';

const AuthButton = () => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const handleSignInClick = () => {
    navigate('/login');
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
        {/* Clickable Username display */}
        <Link 
          to={`/user/${currentUser.username}/books`} 
          className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
        >
          @{currentUser.username} 
        </Link>

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
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="primary" 
        onClick={handleSignInClick}
        aria-label="Sign in with GitHub"
      >
        Sign In
      </Button>
    </motion.div>
  );
};

export default AuthButton;