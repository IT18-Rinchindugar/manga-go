import type { User, Transaction, ReadingHistory, PBChapterExpanded } from "../lib/types";
import { pb } from "../lib/pocketbase";
import type { PBChapter, PBManga } from "../lib/pocketbase-types";

export interface BrowseFilters {
  search?: string;
  genres?: string[];
  status?: string;
  sortOrder?: string;
  minRating?: number;
  yearRange?: [number, number];
  page?: number;
  perPage?: number;
}

const getChaptersForManga = async (mangaId: string): Promise<PBChapter[]> => {
  const chapters = await pb.collection('chapters').getFullList<PBChapter>({
    filter: `manga = "${mangaId}"`,
    sort: '-created', // descending order
  });
  return chapters;  
};

// Per-user state storage
interface UserState {
  favorites: Set<string>;
  unlockedChapters: Set<string>;
  transactions: Transaction[];
  readingHistory: ReadingHistory[];
}

const userStates: Map<string, UserState> = new Map();

const getOrCreateUserState = (userId: string): UserState => {
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      favorites: new Set(['1', '3']),
      unlockedChapters: new Set(),
      transactions: [],
      readingHistory: []
    });
  }
  return userStates.get(userId)!;
};

// Session state
let currentUser: Omit<User, 'password'> | null = null;

class ApiClient {
  async getAllPopularManga(): Promise<PBManga[]> {
    const records = await pb.collection('mangas').getList<PBManga>(1, 20, {
      sort: '-created',
      filter: 'isPopular = true && status != "Draft"',
    });
    return records.items;
  }

  async getNewManga(): Promise<PBManga[]> {
    const records = await pb.collection('mangas').getList<PBManga>(1, 20, {
      sort: '-created',
      filter: 'status != "Draft"',
    });
    return records.items;
  }

  async getFeaturedManga(): Promise<PBManga | null> {
    const records = await pb.collection('mangas').getList<PBManga>(1, 1, {
      sort: '-created',
      filter: 'isFeatured = true && status != "Draft"',
    });
    return records.items[0] || null;
  }

  async getMangaById(id: string): Promise<PBManga> {
    const manga = await pb.collection('mangas').getOne<PBManga>(id);
    return manga;
  }

  async getChaptersByMangaId(mangaId: string): Promise<PBChapter[]> {
    return getChaptersForManga(mangaId);
  }

  async getChapterById(chapterId: string): Promise<PBChapter> {
    let chapter = await pb.collection('chapters').getOne<PBChapter>(chapterId);

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    if (chapter?.pageUrls?.length > 0) {
      return { ...chapter, pageUrls: chapter.pageUrls.map(url => `${import.meta.env.VITE_CLOUDFRONT_URL}/${url}`) };
    }

    return { ...chapter, pageUrls: [] };
  }
  

  async getBrowseManga(filters: BrowseFilters): Promise<{ items: PBManga[]; totalItems: number }> {
    const parts: string[] = ['status != "Draft"'];

    console.log(filters);

    if (filters.status && filters.status !== 'all') {
      const statusMap: Record<string, string> = { ongoing: 'Ongoing', completed: 'Completed', hiatus: 'Hiatus' };
      parts.push(`status = "${statusMap[filters.status]}"`);
    }

    filters.genres?.forEach(g => parts.push(`genres ~ "${g}"`));

    if (filters.search) {
      parts.push(`(title ~ "${filters.search}" || author ~ "${filters.search}")`);
    }

    if (filters.minRating && filters.minRating > 0) {
      parts.push(`rating >= "${filters.minRating}"`);
    }

    // if (filters.yearRange) {
    //   parts.push(`releaseYear >= ${filters.yearRange[0]} && releaseYear <= ${filters.yearRange[1]}`);
    // }

    const sortMap: Record<string, string> = {
      latest: '-updated',
      popular: '-reviews',
      az: 'title',
      za: '-title',
    };

    const result = await pb.collection('mangas').getList<PBManga>(
      filters.page ?? 1,
      filters.perPage ?? 24,
      { filter: parts.join(' && '), sort: sortMap[filters.sortOrder ?? 'latest'] }
    );

    return { items: result.items, totalItems: result.totalItems };
  }

  async getLatestManga(limit: number = 60): Promise<PBManga[]> {
    const records = await pb.collection('mangas').getList<PBManga>(1, limit, {
      sort: '-updated',
      filter: 'status != "Draft"',
    });
    return records.items;
  }

  async getNewChapters(page: number = 1, limit: number = 30): Promise<PBChapterExpanded[]> {
    const records = await pb.collection('chapters').getList<PBChapterExpanded>(page, limit, {
      sort: '-created',
      expand: 'manga',
      filter: 'manga.status != "Draft"',
    });
    return records.items;
  }
}

export const mangaApi = new ApiClient();
