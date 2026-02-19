import { MOCK_MANGA, HERO_IMAGE } from "@/lib/mock-data";
import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Home() {
  const featuredManga = MOCK_MANGA[0];
  const popularManga = MOCK_MANGA.filter(m => m.isPopular);
  const newManga = MOCK_MANGA.filter(m => m.isNew);
  const { t } = useTranslation();
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={HERO_IMAGE} 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-20 md:pb-32">
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {popularManga.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {newManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
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
