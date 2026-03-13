import { useRoute, Link } from "wouter";
import { mangaApi } from "@/services/manga-api";
import { api } from "@/services/api";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Star, Clock, BookOpen, Lock, Coins, Heart, Share2, Calendar, User, Palette, Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import { navigate } from "wouter/use-browser-location";
import { useSubscriptionModal } from "@/context/login-modal-context";

export default function MangaDetails() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { hasSubscriptionAccess, isFavorite, toggleFavorite, isLoadingFavorites } = useUser();
  const { openSubscriptionModal } = useSubscriptionModal();
  const [match, params] = useRoute("/manga/:id");
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  // Fetch manga details from PocketBase
  const { data: manga, isLoading: mangaLoading, error: mangaError } = useQuery({
    queryKey: ['manga', params?.id],
    queryFn: () => api.getMangaById(params?.id || ''),
    enabled: !!params?.id
  });

  // Fetch chapters
  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', params?.id],
    queryFn: () => mangaApi.getChaptersByMangaId(params?.id || ''),
    enabled: !!params?.id
  });

  // Loading state
  if (mangaLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Error or not found
  if (mangaError || !manga) return <NotFound />;

  // Get cover URL for PBManga
  const coverUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${manga.collectionId}/${manga.id}/${manga.coverUrl}`;

  return (
    <Layout>
      {/* Header Backdrop */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={coverUrl} alt="Background" className="w-full h-full object-cover blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-80">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-background ring-1 ring-white/10 relative">
              <img src={coverUrl} alt={manga.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button size="lg" className="w-full text-md font-bold shadow-lg shadow-primary/20" asChild>
                <Link href={chapters.length > 0 ? `/read/${manga.id}/${chapters[0].id}` : '#'}>
                  <Play className="mr-2 h-5 w-5 fill-current" />{t('common.readFirstChapter')}
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  disabled={isLoadingFavorites}
                  variant={isFavorite(params?.id) ? "default" : "secondary"} 
                  className="w-full"
                  onClick={() => {
                    if (!user) {
                      openLoginModal();
                      return;
                    }
                    params?.id && toggleFavorite(params?.id);
                  }}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite(params?.id) ? "fill-current" : ""}`} /> 
                  {isFavorite(params?.id) ? t('common.saved') : t('common.favorite')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('common.share')}
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{manga.title}</h1>
            {manga.altTitle && (
              <h2 className="text-xl text-muted-foreground mb-4 font-medium">{manga.altTitle}</h2>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
              <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg">{manga.rating}</span>
                <span className="text-muted-foreground font-normal ml-1 text-sm">({manga.reviews} {t('manga.reviewsNumber')})</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{chapters.length} {t('manga.chapters')}</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t(`manga.${manga.status.toLowerCase()}`)}</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{manga.releaseYear}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
               <div className="flex items-center gap-2">
                 <User className="h-4 w-4 text-primary" />
                 <span className="text-muted-foreground">{t('manga.author')}:</span>
                 <span className="font-medium">{manga.author}</span>
               </div>
               {manga.artist && (
                 <div className="flex items-center gap-2">
                   <Palette className="h-4 w-4 text-primary" />
                   <span className="text-muted-foreground">{t('manga.artist')}:</span>
                   <span className="font-medium">{manga.artist}</span>
                 </div>
               )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {/* Handle both genres array formats */}
              {(Array.isArray(manga.genres) ? manga.genres : []).map(genre => (
                <Badge key={genre} variant="secondary" className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary border border-white/5">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="mb-8 p-6 rounded-xl bg-secondary/20 border border-white/5">
              <h3 className="text-lg font-bold mb-2 text-foreground/80">{t('manga.synopsis')}</h3>
              <p className={`text-muted-foreground leading-relaxed text-lg overflow-hidden transition-all duration-300 ${synopsisExpanded ? '' : 'line-clamp-2'}`}>
                {manga.synopsis}
              </p>
              <button
                onClick={() => setSynopsisExpanded(prev => !prev)}
                className="mt-2 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {synopsisExpanded ? t('common.showLess') : t('common.showMore')}
              </button>
            </div>

            {/* Chapters List */}
            <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-muted/20">
                <h3 className="font-bold text-lg">{t('manga.chapters')}</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  {chapters.length} {t('manga.chapters')}
                </span>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-3">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={!chapter.isFree ? "#" : `/read/${manga.id}/${chapter.id}`}
                      onClick={(e) => {
                        if (!chapter.isFree && !user) {
                          e.preventDefault();
                          openLoginModal();
                          return;
                        }

                        if (!chapter.isFree && !hasSubscriptionAccess()) {
                          e.preventDefault();
                          openSubscriptionModal();
                          return;
                        }

                        navigate(`/read/${manga.id}/${chapter.id}`);
                        return;
                      }}
                      className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-white/5 bg-muted/20 hover:bg-primary/10 hover:border-primary/40 transition-all group text-center ${!chapter.isFree ? 'opacity-60' : ''}`}
                    >
                      <span className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">
                         {t('manga.chapter')} {chapter?.title ? `: ${chapter.title}` : ''}
                      </span>
                      {!chapter.isFree ? (
                        <>
                          <Lock className="h-3 w-3 text-muted-foreground" /> 
                          {/* <span className="text-[12px] text-primary font-semibold uppercase tracking-wide">{chapter.price} {t('manga.coins')}</span> */}
                        </>
                      ) : (
                        <span className="text-[10px] text-primary font-semibold uppercase tracking-wide">
                          {t('manga.free')}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}