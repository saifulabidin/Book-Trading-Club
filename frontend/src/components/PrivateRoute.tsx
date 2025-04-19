import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/bookStore';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to sign-in page with return URL
    return <Navigate to={`/signin?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export default PrivateRoute;