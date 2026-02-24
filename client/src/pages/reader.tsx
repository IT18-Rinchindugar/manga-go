import { useRoute, Link } from "wouter";
import { MOCK_MANGA } from "@/lib/mock-data";
import { mangaApi } from "@/services/manga-api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Menu, Settings, MessageSquare, List, Maximize, Minimize, Type, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

export default function Reader() {
  const [match, params] = useRoute("/read/:mangaId/:chapterId");
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState<'vertical' | 'single'>('vertical');
  const [zoom, setZoom] = useState(() => {
    // Check if device is mobile (screen width less than 768px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile ? 150 : 100;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['chapters', params?.mangaId],
    queryFn: () => mangaApi.getChaptersByMangaId(params?.mangaId || ''),
    enabled: !!params?.mangaId
  });

  const manga = {
    id: params?.mangaId || '',
    title: 'Manga Title',
    author: 'Manga Author'
  };

  const { data: chapter = null, isLoading: chapterLoading } = useQuery({
    queryKey: ['chapter', params?.chapterId],
    queryFn: () => mangaApi.getChapterById(params?.chapterId || ''),
    enabled: !!params?.chapterId
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  if (!params) return <NotFound />;
  
  if (isLoading || chapterLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  
  if (!manga || !chapter) return <NotFound />;

  const totalPages = chapter.pageUrls.length;

  const toggleControls = () => setShowControls(!showControls);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-foreground flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-white/10 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-white/10" asChild>
            <Link href={`/manga/${manga.id}`}>
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <h2 className="font-bold text-sm md:text-base line-clamp-1">{manga.title}</h2>
            <p className="text-xs text-muted-foreground">{chapter.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="hidden md:inline-flex">
             {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
           </Button>

           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50 shadow-2xl">
              <h3 className="font-bold mb-4 text-zinc-100">Chapters</h3>
              <ScrollArea className="h-[calc(100vh-100px)]">
                <div className="space-y-1">
                  {chapters.map(c => (
                    <Button 
                      key={c.id}
                      variant={c.id === chapter.id ? "secondary" : "ghost"} 
                      className="w-full justify-start hover:bg-white/10 transition-colors"
                      asChild
                    >
                      <Link href={`/read/${manga.id}/${c.id}`}>
                        Chapter {c.number}: {c.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50 shadow-2xl">
              <div className="space-y-6 py-6">
                <div>
                  <Label className="mb-2 block text-zinc-100 font-medium">Reading Mode</Label>
                  <ToggleGroup type="single" value={readingMode} onValueChange={(v) => v && setReadingMode(v as any)} className="bg-zinc-800/50 rounded-lg p-1">
                    <ToggleGroupItem value="vertical" aria-label="Vertical Scroll" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md">
                      Vertical
                    </ToggleGroupItem>
                    <ToggleGroupItem value="single" aria-label="Single Page" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md">
                      Single Page
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <Separator className="bg-zinc-700/50" />
                
                <div>
                  <div className="flex justify-between mb-3">
                    <Label className="text-zinc-100 font-medium">Zoom Level</Label>
                    <span className="text-sm text-zinc-400 font-mono">{zoom}%</span>
                  </div>
                  <Slider 
                    value={[zoom]} 
                    min={50} 
                    max={150} 
                    step={10} 
                    onValueChange={(v) => setZoom(v[0])} 
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Reader Area */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center py-20 cursor-pointer"
        onClick={toggleControls}
      >
        <div 
          className={`transition-all duration-200 ${readingMode === 'single' ? 'flex items-center justify-center h-full' : ''}`}
          style={{ width: readingMode === 'single' ? 'auto' : `${zoom > 100 ? '100' : (zoom/100) * 60}%`, maxWidth: '100%' }}
        >
           {readingMode === 'vertical' ? (
             // Vertical Mode - show all pages
             chapter.pageUrls.map((pageUrl, i) => (
               <img 
                key={i}
                src={pageUrl} 
                alt={`Page ${i+1}`}
                className="w-full h-auto block"
                style={{ width: `${zoom}%` }}
                loading="lazy"
               />
             ))
           ) : (
             // Single Page Mode
             <img 
              src={chapter.pageUrls[currentPage - 1]} 
              alt={`Page ${currentPage}`}
              className="max-h-[80vh] w-auto shadow-2xl object-contain"
              style={{ transform: `scale(${zoom/100})` }}
             />
           )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-center px-4 border-t border-white/10 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto w-full">
           <Button variant="ghost" disabled={currentPage === 1} onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(1, p-1)); }}>
             <ChevronLeft className="mr-2 h-4 w-4" /> Prev
           </Button>
           
           <div className="flex-1 flex flex-col gap-2 max-w-xs">
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>Page {currentPage}</span>
               <span>{totalPages}</span>
             </div>
             <Slider 
               value={[currentPage]} 
               max={totalPages} 
               step={1} 
               onValueChange={(vals) => setCurrentPage(vals[0])}
               className="cursor-pointer"
             />
           </div>

           <Button variant="ghost" disabled={currentPage === totalPages} onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages, p+1)); }}>
             Next <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
        </div>
      </div>
    </div>
  );
}
