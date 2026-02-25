import { Link } from "wouter";
import { Star } from "lucide-react";
import { Manga } from "@/lib/mock-data";
import type { PBManga } from "@/lib/pocketbase-types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface MangaCardProps {
  manga: Manga | PBManga;
}

// Type guard to check if manga is PBManga
function isPBManga(manga: Manga | PBManga): manga is PBManga {
  return 'collectionId' in manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  const { t } = useTranslation();
  // Get values based on manga type
  const cover = isPBManga(manga) ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${manga.collectionId}/${manga.id}/${manga.coverUrl}` : manga.cover;
  const rating = manga.rating;
  const title = manga.title;
  const status = manga.status;
  const isNew = isPBManga(manga) ? false : manga.isNew; // PBManga doesn't have isNew yet
  const chapters = isPBManga(manga) ? 0 : manga.chapters; // Will need to fetch chapter count separately
  
  return (
    <Link href={`/manga/${manga.id}`}>
      <motion.div 
        className="group relative block cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-secondary shadow-lg">
          <img 
            src={cover} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
          
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="backdrop-blur-md bg-black/50 border-white/10 text-xs font-semibold">
              <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
              {rating}
            </Badge>
          </div>
          
          {isNew && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary hover:bg-primary font-bold text-[10px] uppercase tracking-wider">
                New
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              {chapters > 0 && (
                <>
                  <span>{chapters} {t('manga.chapters')}</span>
                  <span>•</span>
                </>
              )}
              <span>{t(`manga.${status.toLowerCase()}`)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
