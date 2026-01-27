import { useRoute, Link } from "wouter";
import { MOCK_MANGA } from "@/lib/mock-data";
import { api } from "@/lib/api";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Star, Clock, BookOpen, Lock, Coins, Heart, Share2, Calendar, User, Palette } from "lucide-react";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function MangaDetails() {
  const [match, params] = useRoute("/manga/:id");
  const manga = MOCK_MANGA.find(m => m.id === params?.id);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', params?.id],
    queryFn: () => api.getChaptersByMangaId(params?.id || ''),
    enabled: !!params?.id
  });

  if (!manga) return <NotFound />;

  return (
    <Layout>
      {/* Header Backdrop */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={manga.cover} alt="Background" className="w-full h-full object-cover blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-80">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-background ring-1 ring-white/10 relative">
              <img src={manga.cover} alt={manga.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button size="lg" className="w-full text-lg font-bold shadow-lg shadow-primary/20" asChild>
                <Link href={chapters.length > 0 ? `/read/${manga.id}/${chapters[0].id}` : '#'}>
                  <Play className="mr-2 h-5 w-5 fill-current" /> Read First Chapter
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant={isFavorite ? "default" : "secondary"} 
                  className="w-full"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} /> 
                  {isFavorite ? "Saved" : "Favorite"}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">{manga.title}</h1>
            {manga.altTitle && (
              <h2 className="text-xl text-muted-foreground mb-4 font-medium">{manga.altTitle}</h2>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
              <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg">{manga.rating}</span>
                <span className="text-muted-foreground font-normal ml-1 text-sm">({manga.reviews} reviews)</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{manga.chapters} Chapters</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{manga.status}</span>
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
                 <span className="text-muted-foreground">Author:</span>
                 <span className="font-medium">{manga.author}</span>
               </div>
               {manga.artist && (
                 <div className="flex items-center gap-2">
                   <Palette className="h-4 w-4 text-primary" />
                   <span className="text-muted-foreground">Artist:</span>
                   <span className="font-medium">{manga.artist}</span>
                 </div>
               )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {manga.genre.map(genre => (
                <Badge key={genre} variant="secondary" className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary border border-white/5">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="mb-8 p-6 rounded-xl bg-secondary/20 border border-white/5">
              <h3 className="text-lg font-bold mb-2 text-foreground/80">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {manga.synopsis}
              </p>
            </div>

            {/* Chapters List */}
            <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-muted/20">
                <h3 className="font-bold text-lg">Chapters</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Updated: {manga.lastUpdated}</span>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-white/5">
                  {chapters.map((chapter) => (
                    <Link 
                      key={chapter.id} 
                      href={!chapter.isFree ? "#" : `/read/${manga.id}/${chapter.id}`}
                      className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors group ${!chapter.isFree ? 'opacity-70' : ''}`}
                    >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold group-hover:text-primary transition-colors text-base">
                            Chapter {chapter.number}: {chapter.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{chapter.pageUrls.length} pages</span>
                        </div>
                        
                        {!chapter.isFree ? (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                              <Coins className="h-3 w-3" /> {chapter.price}
                            </span>
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ) : (
                          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">
                            Free
                          </Badge>
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
