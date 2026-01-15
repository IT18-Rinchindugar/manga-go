import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  BarChart,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/manga", icon: BookOpen, label: "Manage Manga" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/50 backdrop-blur-xl flex-shrink-0 flex flex-col fixed h-full z-50">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/">
            <a className="font-display text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              InkFlow <span className="text-muted-foreground text-xs font-sans font-normal ml-1">Admin</span>
            </a>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@inkflow.com</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-background/95">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <span>Admin</span>
             <ChevronRight className="h-4 w-4" />
             <span className="text-foreground font-medium">
               {navItems.find(i => i.href === location)?.label || 'Dashboard'}
             </span>
           </div>
           <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">View Website</Link>
              </Button>
           </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
