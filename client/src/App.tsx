import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MangaDetails from "@/pages/manga-details";
import Reader from "@/pages/reader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/manga/:id" component={MangaDetails} />
      <Route path="/read/:mangaId/:chapterId" component={Reader} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
