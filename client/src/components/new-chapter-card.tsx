// components/new-chapter-card.tsx
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { PBChapterExpanded } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";  // ✅

interface NewChapterCardProps {
  chapter: PBChapterExpanded;
}

export default function NewChapterCard({ chapter }: NewChapterCardProps) {
  const { t } = useTranslation();
  const manga = chapter.expand?.manga;
  if (!manga) return null;

  const coverUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${manga.collectionId}/${manga.id}/${manga.coverUrl}`;
  // TODO: add the logic to check subscription status and show the badge accordingly
  // /read/${manga.id}/${chapter.id}
  return (
    <Link href={`/manga/${manga.id}`}>
      <motion.div
        className="group relative flex items-center gap-3 rounded-xl bg-card hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {chapter?.isFree && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary hover:bg-primary font-bold text-[9px] uppercase tracking-wider">
              {t('manga.free')}
            </Badge>
          </div>
        )}
        {/* Thumbnail — small portrait, same ratio as MangaCard */}
        <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
          <img
            src={coverUrl}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors">
            {manga.title}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {t('manga.chapter')}: {chapter.title}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}