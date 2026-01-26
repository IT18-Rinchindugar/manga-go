export type UserRole = 'USER' | 'ADMIN';
export type MangaStatus = 'Ongoing' | 'Completed' | 'Hiatus';
export type TransactionType = 'COIN_PURCHASE' | 'CHAPTER_UNLOCK';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  coins: number;
  avatar: string | null;
  createdAt: Date;
}

export interface Manga {
  id: string;
  title: string;
  altTitle: string | null;
  author: string;
  artist: string | null;
  coverUrl: string;
  synopsis: string;
  genres: string[];
  status: MangaStatus;
  releaseYear: number;
  rating: string;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
  title: string;
  pageUrls: string[];
  price: number;
  isFree: boolean;
  releaseDate: Date;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  relatedChapterId: string | null;
  createdAt: Date;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  mangaId: string;
  chapterId: string;
  lastRead: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  mangaId: string;
  createdAt: Date;
}

export interface UnlockedChapter {
  id: string;
  userId: string;
  chapterId: string;
  unlockedAt: Date;
}
