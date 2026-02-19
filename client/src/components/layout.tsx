import { Link, useLocation } from "wouter";
import { Search, User, Coins, Menu, X, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import PaymentModal from "./payment-modal";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('notifications.logoutSuccess'));
      setLocation('/');
    } catch (error: any) {
      toast.error(error.message || t('notifications.logoutFailed'));
    }
  };

  const handleCoinPurchase = (amount: number) => {
    // Handled by PaymentModal
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <a className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                {t('appName')}
              </a>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/"><a className={`hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}>{t('common.home')}</a></Link>
              <Link href="/browse"><a className={`hover:text-primary transition-colors ${location === '/browse' ? 'text-primary' : ''}`}>{t('common.browse')}</a></Link>
              <Link href="/genres"><a className="hover:text-primary transition-colors">{t('common.genres')}</a></Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('common.search')}
                className="w-full bg-secondary/50 border-transparent focus-visible:ring-primary pl-9 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                <button 
                  onClick={() => setIsPaymentOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full text-primary font-medium text-sm border border-primary/20 cursor-pointer"
                  data-testid="button-coins"
                >
                  <Coins className="h-4 w-4 fill-primary" />
                  <span data-testid="text-coins">{user.coins}</span>
                  <Plus className="h-3 w-3 ml-1" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20" data-testid="button-user-menu">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || undefined} alt={`@${user.username}`} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none" data-testid="text-username">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground" data-testid="text-email">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                       <DropdownMenuItem className="cursor-pointer" data-testid="link-profile">{t('common.profile')}</DropdownMenuItem>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer" data-testid="link-admin">{t('admin.adminDashboard')}</DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuItem onClick={() => setIsPaymentOpen(true)} data-testid="button-topup">
                      <Coins className="mr-2 h-4 w-4" /> {t('navigation.topUpCoins')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout} data-testid="button-logout">
                      {t('common.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="rounded-full px-6 font-medium" data-testid="button-signin">
                  {t('common.signIn')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/"><a className="text-lg font-medium hover:text-primary">{t('common.home')}</a></Link>
                  <Link href="/browse"><a className="text-lg font-medium hover:text-primary">{t('common.browse')}</a></Link>
                  <Link href="/latest"><a className="text-lg font-medium hover:text-primary">{t('common.latest')}</a></Link>
                  <Link href="/genres"><a className="text-lg font-medium hover:text-primary">{t('common.genres')}</a></Link>
                  {!user && (
                    <Link href="/auth">
                      <Button className="mt-4 w-full">{t('common.signIn')}</Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-8 mt-12 bg-card/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">{t('ui.terms')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('ui.privacy')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('ui.contact')}</a>
          </div>
        </div>
      </footer>

      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onSuccess={handleCoinPurchase} />
    </div>
  );
}
