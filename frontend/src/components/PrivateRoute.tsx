import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/bookStore';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../utils/constants';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isAuthenticated } = useStore();
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  if (!token || !isAuthenticated) {
    // Remove token if it exists but user is not authenticated
    if (token) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    }
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;