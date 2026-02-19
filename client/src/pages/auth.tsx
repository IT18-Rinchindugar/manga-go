import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.username, loginData.password);
      toast.success(t('notifications.loginSuccess'));
      setLocation('/');
    } catch (error: any) {
      toast.error(error.message || t('notifications.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      await register(registerData.username, registerData.email, registerData.password);
      toast.success(t('notifications.accountCreated'));
      setLocation('/');
    } catch (error: any) {
      toast.error(error.message || t('notifications.registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Decorative manga-style elements */}
      <div className="absolute top-10 left-10 text-primary/10 text-9xl font-display select-none" style={{ fontFamily: 'Carter One' }}>漫</div>
      <div className="absolute bottom-10 right-10 text-primary/10 text-9xl font-display select-none" style={{ fontFamily: 'Carter One' }}>画</div>
      
      <Card className="relative z-10 w-full max-w-md border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-display text-primary mb-2" style={{ fontFamily: 'Carter One, system-ui' }}>
            {t('appName')}
          </h1>
          <CardDescription>{t('auth.welcomeMessage')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">{t('common.login')}</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">{t('common.register')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">{t('user.username')}</Label>
                  <Input
                    id="login-username"
                    data-testid="input-login-username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('user.password')}</Label>
                  <Input
                    id="login-password"
                    data-testid="input-login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  data-testid="button-login"
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.loggingIn')}
                    </>
                  ) : (
                    t('common.login')
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">{t('user.username')}</Label>
                  <Input
                    id="register-username"
                    data-testid="input-register-username"
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">{t('user.email')}</Label>
                  <Input
                    id="register-email"
                    data-testid="input-register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{t('user.password')}</Label>
                  <Input
                    id="register-password"
                    data-testid="input-register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">{t('user.confirmPassword')}</Label>
                  <Input
                    id="register-confirm-password"
                    data-testid="input-register-confirm-password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  data-testid="button-register"
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.creatingAccount')}
                    </>
                  ) : (
                    t('auth.createAccount')
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>{t('user.demoCredentials')}:</p>
            <p>{t('auth.demoUser')}</p>
            <p>{t('auth.demoAdmin')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
