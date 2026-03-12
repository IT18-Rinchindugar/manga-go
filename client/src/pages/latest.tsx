import Layout from "@/components/layout";
import MangaCard from "@/components/manga-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/services/manga-api";
import type { PBManga } from "@/lib/pocketbase-types";

function groupByRecency(manga: PBManga[]) {
  const now = Date.now();
  const thisWeek: PBManga[] = [];
  const thisMonth: PBManga[] = [];
  const older: PBManga[] = [];

  for (const m of manga) {
    const diffDays = Math.floor((now - new Date(m.updated).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) thisWeek.push(m);
    else if (diffDays <= 30) thisMonth.push(m);
    else older.push(m);
  }

  return { thisWeek, thisMonth, older };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

export default function Latest() {
  const { data: allManga = [], isLoading } = useQuery({
    queryKey: ["latest-manga"],
    queryFn: () => mangaApi.getLatestManga(60),
    staleTime: 2 * 60 * 1000,
  });

  const { thisWeek, thisMonth, older } = groupByRecency(allManga);

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
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Latest Updates</h1>
              <p className="text-muted-foreground">Recently updated manga series</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-12">
              <SkeletonGrid />
              <SkeletonGrid />
            </div>
          ) : (
            <>
              {thisWeek.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">This Week</h2>
                    <span className="text-sm text-muted-foreground ml-2">({thisWeek.length} titles)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {thisWeek.map((manga, index) => (
                      <motion.div
                        key={manga.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MangaCard manga={manga} />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Updated {formatDate(manga.updated)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {thisMonth.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-bold">This Month</h2>
                    <span className="text-sm text-muted-foreground ml-2">({thisMonth.length} titles)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {thisMonth.map((manga, index) => (
                      <motion.div
                        key={manga.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MangaCard manga={manga} />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Updated {formatDate(manga.updated)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {older.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-bold">Earlier</h2>
                    <span className="text-sm text-muted-foreground ml-2">({older.length} titles)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {older.map((manga, index) => (
                      <motion.div
                        key={manga.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MangaCard manga={manga} />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Updated {formatDate(manga.updated)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {allManga.length === 0 && (
                <div className="text-center py-20">
                  <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Updates Yet</h2>
                  <p className="text-muted-foreground">Check back later for new manga updates!</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
