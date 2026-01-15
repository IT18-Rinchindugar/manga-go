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
import AuthModal from "./auth-modal";
import PaymentModal from "./payment-modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state
  const [coins, setCoins] = useState(150);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleCoinPurchase = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <a className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                InkFlow
              </a>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/"><a className={`hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}>Home</a></Link>
              <Link href="/browse"><a className={`hover:text-primary transition-colors ${location === '/browse' ? 'text-primary' : ''}`}>Browse</a></Link>
              <Link href="/latest"><a className="hover:text-primary transition-colors">Latest</a></Link>
              <Link href="/genres"><a className="hover:text-primary transition-colors">Genres</a></Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search manga..."
                className="w-full bg-secondary/50 border-transparent focus-visible:ring-primary pl-9 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => setIsPaymentOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full text-primary font-medium text-sm border border-primary/20 cursor-pointer"
                >
                  <Coins className="h-4 w-4 fill-primary" />
                  <span>{coins}</span>
                  <Plus className="h-3 w-3 ml-1" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          john@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                       <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Library</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsPaymentOpen(true)}>
                      <Coins className="mr-2 h-4 w-4" /> Top Up Coins
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setIsAuthOpen(true)} size="sm" className="rounded-full px-6 font-medium">
                Sign In
              </Button>
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
                  <Link href="/"><a className="text-lg font-medium hover:text-primary">Home</a></Link>
                  <Link href="/browse"><a className="text-lg font-medium hover:text-primary">Browse</a></Link>
                  <Link href="/latest"><a className="text-lg font-medium hover:text-primary">Latest</a></Link>
                  <Link href="/genres"><a className="text-lg font-medium hover:text-primary">Genres</a></Link>
                  {!isLoggedIn && (
                     <Button onClick={() => setIsAuthOpen(true)} className="mt-4 w-full">Sign In</Button>
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
            © 2024 InkFlow. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onSuccess={handleCoinPurchase} />
    </div>
  );
}
