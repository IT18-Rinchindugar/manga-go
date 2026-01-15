import Layout from "@/components/layout";
import { MOCK_USER, MOCK_MANGA, MOCK_CHAPTERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import MangaCard from "@/components/manga-card";
import { Coins, Settings, History, Heart, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const favorites = MOCK_MANGA.filter(m => MOCK_USER.favorites.includes(m.id));
  
  const history = MOCK_USER.history.map(h => {
    const manga = MOCK_MANGA.find(m => m.id === h.mangaId);
    const chapter = MOCK_CHAPTERS.find(c => c.id === h.chapterId);
    return { ...h, manga, chapter };
  }).filter(h => h.manga && h.chapter);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Info Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-purple-500/20"></div>
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl mb-4">
                  <AvatarImage src={MOCK_USER.avatar} />
                  <AvatarFallback>{MOCK_USER.username.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold font-display">{MOCK_USER.username}</h2>
                <p className="text-muted-foreground text-sm mb-4">{MOCK_USER.email}</p>
                
                <div className="w-full flex items-center justify-between p-3 bg-secondary/50 rounded-lg mb-6 border border-white/5">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{MOCK_USER.coins} Coins</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">Top Up</Button>
                </div>

                <div className="w-full space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" /> Account Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="mb-6 w-full md:w-auto bg-secondary/50 p-1">
                <TabsTrigger value="favorites" className="flex-1 md:flex-none">
                  <Heart className="mr-2 h-4 w-4" /> Favorites ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 md:flex-none">
                  <History className="mr-2 h-4 w-4" /> Reading History
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 md:flex-none">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="favorites">
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {favorites.map(manga => (
                      <MangaCard key={manga.id} manga={manga} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground border rounded-xl border-dashed border-white/10">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No favorites yet. Go explore!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history">
                 <div className="space-y-4">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <div key={idx} className="flex items-center p-4 rounded-xl bg-card border border-white/5 hover:border-primary/50 transition-colors group">
                        <Link href={`/manga/${item.manga?.id}`} className="flex-shrink-0 w-16 h-24 rounded overflow-hidden mr-4">
                            <img src={item.manga?.cover} alt={item.manga?.title} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/manga/${item.manga?.id}`} className="block font-bold truncate hover:text-primary transition-colors mb-1">
                            {item.manga?.title}
                          </Link>
                          <div className="flex items-center text-sm text-muted-foreground gap-2">
                             <span>{item.chapter?.title}</span>
                             <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                             <span>Last read: {item.lastRead}</span>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="secondary" className="ml-4">
                          <Link href={`/read/${item.manga?.id}/${item.chapter?.id}`}>Continue</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-muted-foreground border rounded-xl border-dashed border-white/10">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No reading history yet.</p>
                    </div>
                  )}
                 </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your reading experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <Label>Dark Mode</Label>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-muted-foreground">Always On</span>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
