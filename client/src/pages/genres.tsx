import { useState } from "react";
import { Link } from "wouter";
import { MOCK_MANGA } from "@/lib/mock-data";
import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sword, 
  Sparkles, 
  Heart, 
  Ghost, 
  Rocket, 
  Book, 
  Laugh, 
  Skull, 
  Zap,
  Palette,
  GraduationCap,
  Gamepad2,
  Tags
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const genreIcons: Record<string, React.ReactNode> = {
  'Action': <Sword className="h-5 w-5" />,
  'Fantasy': <Sparkles className="h-5 w-5" />,
  'Romance': <Heart className="h-5 w-5" />,
  'Horror': <Ghost className="h-5 w-5" />,
  'Sci-Fi': <Rocket className="h-5 w-5" />,
  'Drama': <Book className="h-5 w-5" />,
  'Comedy': <Laugh className="h-5 w-5" />,
  'Thriller': <Skull className="h-5 w-5" />,
  'Adventure': <Zap className="h-5 w-5" />,
  'Slice of Life': <Palette className="h-5 w-5" />,
  'School Life': <GraduationCap className="h-5 w-5" />,
  'Isekai': <Gamepad2 className="h-5 w-5" />,
};

const genreColors: Record<string, string> = {
  'Action': 'from-red-500/20 to-orange-500/20 border-red-500/30 hover:border-red-500/50',
  'Fantasy': 'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50',
  'Romance': 'from-pink-500/20 to-rose-500/20 border-pink-500/30 hover:border-pink-500/50',
  'Horror': 'from-gray-500/20 to-slate-500/20 border-gray-500/30 hover:border-gray-500/50',
  'Sci-Fi': 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:border-cyan-500/50',
  'Drama': 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 hover:border-amber-500/50',
  'Comedy': 'from-yellow-500/20 to-lime-500/20 border-yellow-500/30 hover:border-yellow-500/50',
  'Thriller': 'from-slate-500/20 to-zinc-500/20 border-slate-500/30 hover:border-slate-500/50',
  'Adventure': 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-500/50',
  'Slice of Life': 'from-sky-500/20 to-indigo-500/20 border-sky-500/30 hover:border-sky-500/50',
  'School Life': 'from-blue-500/20 to-violet-500/20 border-blue-500/30 hover:border-blue-500/50',
  'Isekai': 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 hover:border-violet-500/50',
};

export default function Genres() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const allGenres = Array.from(new Set(MOCK_MANGA.flatMap(m => m.genre))).sort();

  const genreCounts = allGenres.reduce((acc, genre) => {
    acc[genre] = MOCK_MANGA.filter(m => m.genre.includes(genre)).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredManga = selectedGenre 
    ? MOCK_MANGA.filter(m => m.genre.includes(selectedGenre))
    : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Tags className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Browse by Genre</h1>
              <p className="text-muted-foreground">Explore manga by your favorite categories</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            {allGenres.map((genre, index) => (
              <motion.button
                key={genre}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                data-testid={`genre-button-${genre.toLowerCase().replace(/\s+/g, '-')}`}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  bg-gradient-to-br ${genreColors[genre] || 'from-primary/20 to-primary/10 border-primary/30 hover:border-primary/50'}
                  ${selectedGenre === genre ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'}
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-lg ${selectedGenre === genre ? 'bg-primary text-primary-foreground' : 'bg-background/50'}`}>
                    {genreIcons[genre] || <Tags className="h-5 w-5" />}
                  </div>
                  <span className="font-semibold text-sm">{genre}</span>
                  <Badge variant="secondary" className="text-xs">
                    {genreCounts[genre]} titles
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedGenre && (
              <motion.section
                key={selectedGenre}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary`}>
                      {genreIcons[selectedGenre] || <Tags className="h-5 w-5" />}
                    </div>
                    <h2 className="text-2xl font-bold">{selectedGenre}</h2>
                    <Badge variant="outline">{filteredManga.length} titles</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedGenre(null)}
                    data-testid="clear-genre-button"
                  >
                    Clear filter
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredManga.map((manga, index) => (
                    <motion.div
                      key={manga.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MangaCard manga={manga} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {!selectedGenre && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 border-2 border-dashed border-muted rounded-xl"
            >
              <Tags className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select a Genre</h3>
              <p className="text-muted-foreground">Click on any genre above to see available manga</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
