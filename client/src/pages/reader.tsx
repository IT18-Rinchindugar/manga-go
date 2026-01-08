import { useRoute, Link } from "wouter";
import { MOCK_MANGA, MOCK_CHAPTERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Menu, Settings, MessageSquare, List } from "lucide-react";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Reader() {
  const [match, params] = useRoute("/read/:mangaId/:chapterId");
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);

  if (!params) return <NotFound />;

  const manga = MOCK_MANGA.find(m => m.id === params.mangaId);
  const chapter = MOCK_CHAPTERS.find(c => c.id === params.chapterId);
  
  if (!manga || !chapter) return <NotFound />;

  // Mock total pages since we only have one image repeated
  const totalPages = 20;

  // Toggle controls on click
  const toggleControls = () => setShowControls(!showControls);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  return (
    <div className="min-h-screen bg-[#111] text-foreground flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-white/10 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-4">
          <Link href={`/manga/${manga.id}`}>
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h2 className="font-bold text-sm md:text-base line-clamp-1">{manga.title}</h2>
            <p className="text-xs text-muted-foreground">{chapter.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <h3 className="font-bold mb-4">Chapters</h3>
              <ScrollArea className="h-[calc(100vh-100px)]">
                <div className="space-y-1">
                   {MOCK_CHAPTERS.map(c => (
                     <Link key={c.id} href={`/read/${manga.id}/${c.id}`}>
                        <Button 
                          variant={c.id === chapter.id ? "secondary" : "ghost"} 
                          className="w-full justify-start"
                        >
                          Chapter {c.number}
                        </Button>
                     </Link>
                   ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Reader Area */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center py-20 cursor-pointer"
        onClick={toggleControls}
      >
        <div className="max-w-3xl w-full px-2 md:px-0 space-y-2">
           {/* Mocking multiple pages by mapping the single image */}
           {Array.from({length: 3}).map((_, i) => (
             <img 
              key={i}
              src={chapter.pages[0]} 
              alt={`Page ${i+1}`}
              className="w-full h-auto shadow-2xl"
              loading="lazy"
             />
           ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-center px-4 border-t border-white/10 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto w-full">
           <Button variant="ghost" disabled={chapter.number === 1}>
             <ChevronLeft className="mr-2 h-4 w-4" /> Prev
           </Button>
           
           <div className="flex-1 flex flex-col gap-2 max-w-xs">
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>Page {currentPage}</span>
               <span>{totalPages}</span>
             </div>
             <Slider 
               defaultValue={[currentPage]} 
               max={totalPages} 
               step={1} 
               onValueChange={(vals) => setCurrentPage(vals[0])}
               className="cursor-pointer"
             />
           </div>

           <Button variant="ghost">
             Next <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
        </div>
      </div>
    </div>
  );
}
