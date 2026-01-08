import { Link } from "wouter";
import { Star } from "lucide-react";
import { Manga } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  return (
    <Link href={`/manga/${manga.id}`}>
      <motion.a 
        className="group relative block cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-secondary shadow-lg">
          <img 
            src={manga.cover} 
            alt={manga.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
          
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="backdrop-blur-md bg-black/50 border-white/10 text-xs font-semibold">
              <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
              {manga.rating}
            </Badge>
          </div>
          
          {manga.isNew && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary hover:bg-primary font-bold text-[10px] uppercase tracking-wider">
                New
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {manga.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>{manga.chapters} Chapters</span>
              <span>•</span>
              <span>{manga.status}</span>
            </div>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}
