import { HERO_IMAGE } from "@/lib/mock-data";
import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PBManga } from "@/lib/pocketbase-types";

export default function Home() {
  const { t } = useTranslation();

  // Fetch featured manga
  const { data: featuredManga, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-manga'],
    queryFn: () => api.getFeaturedManga(),
  });

  // Fetch popular manga
  const { data: popularManga = [], isLoading: popularLoading } = useQuery({
    queryKey: ['popular-manga'],
    queryFn: () => api.getAllPopularManga(),
  });

  // Fetch new manga
  const { data: newManga = [], isLoading: newLoading } = useQuery({
    queryKey: ['new-manga'],
    queryFn: () => api.getNewManga(),
  });

  // Helper function to convert PBManga to display format
  const getMangaCover = (manga: PBManga) => {
    // PocketBase returns the coverUrl as a relative path, so we need to construct the full URL
    return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/mangas/${manga.id}/${manga.coverUrl}`;
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={featuredManga?.coverUrl || HERO_IMAGE} 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-20 md:pb-32">
          {featuredLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : featuredManga ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  Featured Series
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight">
                {featuredManga.title}
                {featuredManga.altTitle && (
                  <><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                    {featuredManga.altTitle}
                  </span></>
                )}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3 md:line-clamp-none max-w-xl">
                {featuredManga.synopsis}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 text-lg font-semibold shadow-lg shadow-primary/25">
                  Start Reading
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-semibold bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10">
                  View Details
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  Featured Series
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight">
                Neon Ronin:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Cyber City</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3 md:line-clamp-none max-w-xl">
                In a world where steel meets soul, a lone warrior navigates the neon-drenched streets of Neo-Tokyo to find the truth about his past.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 text-lg font-semibold shadow-lg shadow-primary/25">
                  Start Reading
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-semibold bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10">
                  View Details
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold font-display">
              {t('manga.popularThisWeek')}
            </h2>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary group">
            {t('common.viewAll')} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        {popularLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[2/3] mb-2" />
                <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                <div className="bg-muted rounded h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : popularManga.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {popularManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No popular manga available at the moment.
          </div>
        )}
      </section>

      {/* New Releases Section */}
      <section className="py-12 bg-secondary/20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary fill-primary" />
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                {t('manga.newReleases')}
              </h2>
            </div>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary group">
              {t('common.viewAll')} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {newLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg aspect-[2/3] mb-2" />
                  <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                  <div className="bg-muted rounded h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : newManga.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {newManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No new manga releases at the moment.
            </div>
          )}
        </div>
      </section>
      
      {/* Genres / Categories Quick Links */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold font-display mb-8">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Comedy', 'Drama', 'Slice of Life', 'Mystery', 'Adventure', 'Isekai', 'Sports'].map((genre) => (
            <a 
              key={genre}
              href="#" 
              className="flex items-center justify-center h-24 rounded-xl bg-card border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <span className="font-semibold text-lg group-hover:text-primary transition-colors">{genre}</span>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
