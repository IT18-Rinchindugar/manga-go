import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
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
import AdminDashboard from "@/pages/admin/dashboard";
import AdminMangaList from "@/pages/admin/manga-list";

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
      <Route path="/profile" component={Profile} />
      <Route path="/manga/:id" component={MangaDetails} />
      <Route path="/read/:mangaId/:chapterId" component={Reader} />
      
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
          <TooltipProvider>
            <Toaster />
            <ScrollToTop />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
