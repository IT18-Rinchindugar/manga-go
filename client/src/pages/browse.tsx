import { Link } from "wouter";
import { MOCK_MANGA, MOCK_USER } from "@/lib/mock-data";
import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [minRating, setMinRating] = useState([0]);
  const [yearRange, setYearRange] = useState([2000, 2025]);

  const allGenres = Array.from(new Set(MOCK_MANGA.flatMap(m => m.genre))).sort();

  const filteredManga = MOCK_MANGA.filter(manga => {
    const matchesSearch = manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manga.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.every(g => manga.genre.includes(g));
    const matchesStatus = statusFilter === "all" || manga.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRating = manga.rating >= minRating[0];
    const matchesYear = manga.releaseYear >= yearRange[0] && manga.releaseYear <= yearRange[1];

    return matchesSearch && matchesGenre && matchesStatus && matchesRating && matchesYear;
  }).sort((a, b) => {
    if (sortOrder === "latest") return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    if (sortOrder === "popular") return b.rating - a.rating; // Mock popularity by rating for now
    if (sortOrder === "az") return a.title.localeCompare(b.title);
    if (sortOrder === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-3">Sort By</h3>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest Updates</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
            <SelectItem value="za">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-bold mb-3">Status</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="hiatus">Hiatus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-bold mb-3">Rating ({minRating[0]}+)</h3>
        <Slider 
          value={minRating} 
          onValueChange={setMinRating} 
          max={5} 
          step={0.5} 
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>5</span>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Genres</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {allGenres.map(genre => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox 
                id={`genre-${genre}`} 
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
              />
              <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Browse Manga</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Sheet */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" /> Filters & Sort
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <div className="py-4">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 p-6 rounded-xl border border-white/5 bg-card/50 backdrop-blur-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by title, author, or artist..." 
                className="pl-10 h-12 bg-secondary/50 border-transparent focus-visible:ring-primary text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
              <span>Showing {filteredManga.length} results</span>
              {(selectedGenres.length > 0 || searchTerm || statusFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedGenres([]);
                    setStatusFilter("all");
                    setMinRating([0]);
                  }}
                  className="text-primary hover:text-primary/80"
                >
                  Clear All Filters <X className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>

            {filteredManga.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredManga.map(manga => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No manga found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedGenres([]);
                    setStatusFilter("all");
                    setMinRating([0]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
