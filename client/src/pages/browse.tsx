import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { mangaApi } from "@/services/manga-api";
import { useTranslation } from "react-i18next";

const ALL_GENRES = [
  "Action", "Adventure", "Fantasy", "Supernatural", "Romance",
  "Comedy", "Drama", "Horror", "Mystery", "Sci-Fi",
  "Slice of Life", "Psychological", "Martial Arts", "Isekai", "School",
  "Historical", "Reincarnation", "Cultivation", "Sports", "Thriller",
];

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [minRating, setMinRating] = useState([0]);
  const [yearRange] = useState<[number, number]>([2000, 2026]);

  const { t } = useTranslation();

  // Debounce search input by 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["browse", debouncedSearch, selectedGenres, statusFilter, sortOrder, minRating, yearRange],
    queryFn: () =>
      mangaApi.getBrowseManga({
        search: debouncedSearch || undefined,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        status: statusFilter,
        sortOrder,
        minRating: minRating[0] > 0 ? minRating[0] : undefined,
        yearRange,
      }),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const mangaList = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setStatusFilter("all");
    setMinRating([0]);
  };

  const hasActiveFilters =
    selectedGenres.length > 0 || searchTerm || statusFilter !== "all" || minRating[0] > 0;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-3">{t('manga.sortBy')}</h3>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder={t('manga.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">{t('manga.latestUpdates')}</SelectItem>
            <SelectItem value="popular">{t('manga.mostPopular')}</SelectItem>
            <SelectItem value="az">{t('manga.aToZ')}</SelectItem>
            <SelectItem value="za">{t('manga.zToA')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-bold mb-3">{t('manga.status')}</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t('manga.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('manga.allStatus')}</SelectItem>
            <SelectItem value="ongoing">{t('manga.ongoing')}</SelectItem>
            <SelectItem value="completed">{t('manga.completed')}</SelectItem>
            <SelectItem value="hiatus">{t('manga.hiatus')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* <div>
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
      </div> */}

      <div>
        <h3 className="font-bold mb-3">{t('genres.genres')}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {ALL_GENRES.map(genre => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
              />
              <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                {t(`genres.${genre.toLowerCase().replace(' ', '')}`)}
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
        <h1 className="text-3xl font-display font-bold mb-8">{t('manga.browseManga')}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Sheet */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" /> {t('navigation.filtersAndSort')}
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
                placeholder={t('manga.searchByTitleOrAuthor')}
                className="pl-10 h-12 bg-secondary/50 border-transparent focus-visible:ring-primary text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
              <span>
                {isLoading ? t('common.loading') : `${t('common.showing')} ${totalItems} ${t('common.results')}`}
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-primary hover:text-primary/80"
                >
                  {t('navigation.clearAllFilters')} <X className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>

            {isError && (
              <div className="text-center py-10 text-destructive">
                <p>{t('manga.failedToLoadManga')}</p>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : !isError && mangaList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {mangaList.map(manga => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            ) : !isError ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">{t('manga.noMangaFoundMatchingYourCriteria')}</p>
                <Button variant="link" onClick={clearFilters}>
                  {t('navigation.resetFilters')}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
