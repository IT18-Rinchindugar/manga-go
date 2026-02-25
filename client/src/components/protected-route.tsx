// client/src/components/protected-route.tsx
import { useAuth } from '@/context/auth-context';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // Redirect if auth is required but user is not logged in
      if (requireAuth && !user) {
        setLocation(redirectTo);
      }  
    }
  }, [user, isLoading, requireAuth, redirectTo, setLocation]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if requirements not met
  if (requireAuth && !user) {
    return null;
  }
  
  return <>{children}</>;
}