import { useState } from "react";
import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Tags,
  Brain,
  Swords,
  Clock,
  Repeat,
  Leaf,
  Trophy,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/services/manga-api";
import { useTranslation } from "react-i18next";

const genreIcons: Record<string, React.ReactNode> = {
  "Action": <Sword className="h-5 w-5" />,
  "Adventure": <Zap className="h-5 w-5" />,
  "Fantasy": <Sparkles className="h-5 w-5" />,
  "Supernatural": <Eye className="h-5 w-5" />,
  "Romance": <Heart className="h-5 w-5" />,
  "Comedy": <Laugh className="h-5 w-5" />,
  "Drama": <Book className="h-5 w-5" />,
  "Horror": <Ghost className="h-5 w-5" />,
  "Mystery": <AlertTriangle className="h-5 w-5" />,
  "Sci-Fi": <Rocket className="h-5 w-5" />,
  "Psychological": <Brain className="h-5 w-5" />,
  "Martial Arts": <Swords className="h-5 w-5" />,
  "Isekai": <Gamepad2 className="h-5 w-5" />,
  "School": <GraduationCap className="h-5 w-5" />,
  "Historical": <Clock className="h-5 w-5" />,
  "Reincarnation": <Repeat className="h-5 w-5" />,
  "Cultivation": <Leaf className="h-5 w-5" />,
  "Sports": <Trophy className="h-5 w-5" />,
  "Thriller": <Skull className="h-5 w-5" />,
};

const genreColors: Record<string, string> = {
  "Action": "from-red-500/20 to-orange-500/20 border-red-500/30 hover:border-red-500/50",
  "Adventure": "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-500/50",
  "Fantasy": "from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50",
  "Supernatural": "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 hover:border-indigo-500/50",
  "Romance": "from-pink-500/20 to-rose-500/20 border-pink-500/30 hover:border-pink-500/50",
  "Comedy": "from-yellow-500/20 to-lime-500/20 border-yellow-500/30 hover:border-yellow-500/50",
  "Drama": "from-amber-500/20 to-yellow-500/20 border-amber-500/30 hover:border-amber-500/50",
  "Horror": "from-gray-500/20 to-slate-500/20 border-gray-500/30 hover:border-gray-500/50",
  "Mystery": "from-stone-500/20 to-zinc-500/20 border-stone-500/30 hover:border-stone-500/50",
  "Sci-Fi": "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:border-cyan-500/50",
  "Psychological": "from-violet-500/20 to-purple-500/20 border-violet-500/30 hover:border-violet-500/50",
  "Martial Arts": "from-orange-500/20 to-red-500/20 border-orange-500/30 hover:border-orange-500/50",
  "Isekai": "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 hover:border-violet-500/50",
  "School": "from-blue-500/20 to-violet-500/20 border-blue-500/30 hover:border-blue-500/50",
  "Historical": "from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-500/50",
  "Reincarnation": "from-teal-500/20 to-cyan-500/20 border-teal-500/30 hover:border-teal-500/50",
  "Cultivation": "from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50",
  "Sports": "from-lime-500/20 to-green-500/20 border-lime-500/30 hover:border-lime-500/50",
  "Thriller": "from-slate-500/20 to-zinc-500/20 border-slate-500/30 hover:border-slate-500/50",
};

const ALL_GENRES = Object.keys(genreIcons);

export default function Genres() {
  const { t } = useTranslation();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["genres-manga", selectedGenres],
    queryFn: () =>
      mangaApi.getBrowseManga({
        genres: selectedGenres,
        sortOrder: "latest",
        perPage: 48,
      }),
    enabled: selectedGenres.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const filteredManga = data?.items ?? [];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

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
              <h1 className="text-3xl font-display font-bold">{t('manga.browseByGenre')}</h1>
              <p className="text-muted-foreground">{t('manga.exploreMangaByYourFavoriteCategories')}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {ALL_GENRES.map((genre, index) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <motion.button
                  key={genre}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleGenre(genre)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300
                    bg-gradient-to-br ${genreColors[genre] ?? "from-primary/20 to-primary/10 border-primary/30 hover:border-primary/50"}
                    ${isSelected ? "ring-2 ring-primary scale-105" : "hover:scale-105"}
                  `}
                >
                  <span className={isSelected ? "text-primary" : ""}>
                    {genreIcons[genre] ?? <Tags className="h-4 w-4" />}
                  </span>
                  <span className="font-medium text-sm">{t(`genres.${genre.toLowerCase().replace(' ', '')}`)}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {selectedGenres.length > 0 && (
              <motion.section
                key={selectedGenres.join(",")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold">{t('common.showing')}:</h2>
                    {selectedGenres.map(genre => (
                      <Badge key={genre} variant="default" className="text-sm">
                        {t(`genres.${genre.toLowerCase().replace(' ', '')}`)}
                      </Badge>
                    ))}
                    {!isLoading && (
                      <Badge variant="outline">{data?.totalItems ?? 0} {t('manga.titles')}</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGenres([])}
                  >
                    {t('navigation.clearAll')}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : (
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
                    {filteredManga.length === 0 && (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t('manga.noMangaFoundForSelectedGenres')}
                      </div>
                    )}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {selectedGenres.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 border-2 border-dashed border-muted rounded-xl"
            >
              <Tags className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('navigation.selectAGenre')}</h3>
              <p className="text-muted-foreground">{t('navigation.clickOnAnyGenreAboveToSeeAvailableManga')}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
