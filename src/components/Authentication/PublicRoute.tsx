import { Navigate, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useAuthContext } from 'contexts/Auth/useAuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

interface LocationState {
  from?: Location;
}

/**
 * PublicRoute - Wraps auth pages (login, register, forgot-password)
 * Redirects authenticated users to home page or intended destination
 * Allows unauthenticated users to access the page
 */
export default function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    // If they were redirected from a protected route, go back there
    // Otherwise, go to dashboard
    const state = location.state as LocationState;
    const from = state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
