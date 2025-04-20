import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/bookStore';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page with return URL parameter
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export default PrivateRoute;