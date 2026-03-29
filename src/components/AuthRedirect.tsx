import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthRedirectProps {
  children: React.ReactNode;
  /** If true, redirects authenticated users away (for login/register pages) */
  guestOnly?: boolean;
}

const AuthRedirect = ({ children, guestOnly = false }: AuthRedirectProps) => {
  const { user, loading, profileLoading, profileType, profileError, getRedirectPath, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || profileLoading) return;

    if (guestOnly && user) {
      if (profileError) return; // show error UI
      if (!profileType) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate(getRedirectPath(), { replace: true });
      }
    }
  }, [user, loading, profileLoading, profileType, profileError, guestOnly, navigate, getRedirectPath]);

  // Show loading while auth or profile is being checked
  if (loading || (guestOnly && user && profileLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verificando sua sessão...</p>
      </div>
    );
  }

  // Show error fallback
  if (guestOnly && user && profileError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 animate-fade-in">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Erro ao carregar perfil</p>
        <Button variant="outline" size="sm" onClick={() => refreshProfile()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRedirect;
