import { Navigate } from 'react-router-dom';
import { useAdminAuth, AdminRole } from '@/context/AdminAuthContext';

interface DeveloperProtectedRouteProps {
  children: React.ReactNode;
}

const DeveloperProtectedRoute = ({ children }: DeveloperProtectedRouteProps) => {
  const { isAuthenticated, isLoading, admin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || admin?.role !== AdminRole.DEVELOPER_ADMIN) {
    return <Navigate to="/admin/developer" replace />;
  }

  return <>{children}</>;
};

export default DeveloperProtectedRoute;
