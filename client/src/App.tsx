import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { LoginModalProvider } from "@/context/login-modal-context";
import "@/lib/i18n"; // Initialize i18n
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MangaDetails from "@/pages/manga-details";
import Reader from "@/pages/reader";
import Browse from "@/pages/browse";
import Latest from "@/pages/latest";
import Genres from "@/pages/genres";
import Profile from "@/pages/profile";
import Auth from "@/pages/auth";
import Subscription from "@/pages/subscription";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminMangaList from "@/pages/admin/manga-list";
import { ProtectedRoute } from "./components/protected-route";
import { UserProvider } from "./context/user-context";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/latest" component={Latest} />
      <Route path="/genres" component={Genres} />
      <Route path="/auth" component={Auth} />
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/subscription">
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      </Route>
      
      <Route path="/manga/:id" component={MangaDetails} />
      <Route path="/read/:mangaId/:chapterId">
        <ProtectedRoute>
          <Reader />
        </ProtectedRoute>
      </Route>
      
      {/* Admin Routes */}
      {/* <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/manga" component={AdminMangaList} />
       */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <UserProvider>
            <LoginModalProvider>
              <TooltipProvider>
                <Toaster />
                <ScrollToTop />
                <Router />
              </TooltipProvider>
            </LoginModalProvider>
          </UserProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
