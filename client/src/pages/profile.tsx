import Layout from "@/components/layout";
import { MOCK_USER, MOCK_MANGA, MOCK_CHAPTERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import MangaCard from "@/components/manga-card";
import { Coins, Settings, History, Heart, LogOut, Crown, Calendar, ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "@/services/subscription-api";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const favorites = MOCK_MANGA.filter(m => MOCK_USER.favorites.includes(m.id));
  
  const history = MOCK_USER.history.map(h => {
    const manga = MOCK_MANGA.find(m => m.id === h.mangaId);
    const chapter = MOCK_CHAPTERS.find(c => c.id === h.chapterId);
    return { ...h, manga, chapter };
  }).filter(h => h.manga && h.chapter);

  // Fetch user's subscription
  const { data: userSubscription } = useQuery({
    queryKey: ['user-subscription'],
    queryFn: () => subscriptionApi.getUserActiveSubscription(),
    enabled: !!user,
  });

  const getSubscriptionStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const calculateRemainingDays = (endDate?: string) => {
    if (!endDate) return 0;
    const remainingDays = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

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
                    <span className="font-bold">{user?.coins || MOCK_USER.coins} {t('user.coins')}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">{t('navigation.topUp')}</Button>
                </div>

                {/* Subscription Status */}
                <div className="w-full mb-6">
                  <Card className="border-white/10 bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{userSubscription?.status !== 'active' ? t('subscription.title') : 'Гишүүнчлэл'}</span>
                        </div>
                        <Badge className={getSubscriptionStatusColor(userSubscription?.status || 'free')}>
                          {t(`subscription.status.${userSubscription?.status || 'free'}`)}
                        </Badge>
                      </div>
                      
                      {userSubscription ? (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">{t('subscription.currentPlan')}: </span>
                            <span className="font-semibold">{userSubscription.expand?.subscriptionPlan?.name || 'Premium'}</span>
                          </div>
                          {userSubscription.end_date && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{t('subscription.messages.expiresOn')}: {new Date(userSubscription?.end_date).toLocaleDateString()}</span>
                            </div>
                          )}
        
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{t('subscription.remainingDays')}: {calculateRemainingDays(userSubscription?.end_date)}</span>
                          </div>

                          {/* <Link href="/subscription">
                            <Button variant="default" size="sm" className="w-full h-8 text-xs">
                              {t('subscription.manage')} <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link> */}

                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {t('subscription.subtitle')}
                          </p>
                          <Link href="/subscription">
                            <Button variant="default" size="sm" className="w-full h-8 text-xs">
                              {t('subscription.subscribe')} <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" /> {t('navigation.accountSettings')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> {t('common.logout')}
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
                  <Heart className="mr-2 h-4 w-4" /> {t('navigation.favorites')} ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 md:flex-none">
                  <History className="mr-2 h-4 w-4" /> {t('user.readingHistory')}
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 md:flex-none">
                  {t('navigation.settings')}
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
                    <p>{t('user.noFavorites')}</p>
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
                             <span>{t('manga.lastRead')}: {item.lastRead}</span>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="secondary" className="ml-4">
                          <Link href={`/read/${item.manga?.id}/${item.chapter?.id}`}>{t('common.continue')}</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-muted-foreground border rounded-xl border-dashed border-white/10">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>{t('user.noHistory')}</p>
                    </div>
                  )}
                 </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle>{t('user.appearance')}</CardTitle>
                    <CardDescription>{t('user.customizeExperience')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <Label>{t('user.darkMode')}</Label>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-muted-foreground">{t('user.alwaysOn')}</span>
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
