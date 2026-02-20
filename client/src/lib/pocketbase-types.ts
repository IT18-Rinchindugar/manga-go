import type { RecordModel } from 'pocketbase';

// Base PocketBase record fields
export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

// User role and status types
export type UserRole = 'USER' | 'ADMIN';
export type MangaStatus = 'Ongoing' | 'Completed' | 'Hiatus';
export type TransactionType = 'COIN_PURCHASE' | 'CHAPTER_UNLOCK';

// PocketBase Auth User (extends built-in users collection)
export interface PBUser extends BaseRecord {
  email: string;
  username: string; // Made required - fallback will be email prefix or 'User'
  name?: string;
  avatar?: string;
  role: UserRole;
  coins: number;
  verified: boolean;
  emailVisibility?: boolean;
}

// Manga record in PocketBase
export interface PBManga extends BaseRecord {
  title: string;
  altTitle?: string;
  author: string;
  artist?: string;
  coverUrl: string;
  synopsis: string;
  genres: string[]; // JSON array
  status: MangaStatus;
  releaseYear: number;
  rating: string;
  reviews: number;
}

// Chapter record in PocketBase
export interface PBChapter extends BaseRecord {
  manga: string; // Relation to manga collection
  number: number;
  title: string;
  pageUrls: string[]; // JSON array
  price: number;
  isFree: boolean;
  releaseDate: string;
}

// Transaction record in PocketBase
export interface PBTransaction extends BaseRecord {
  user: string; // Relation to users collection
  type: TransactionType;
  amount: number;
  description: string;
  relatedChapter?: string; // Relation to chapters collection
}

// Reading History record in PocketBase
export interface PBReadingHistory extends BaseRecord {
  user: string; // Relation to users collection
  manga: string; // Relation to manga collection
  chapter: string; // Relation to chapters collection
  lastRead: string;
}

// Favorite record in PocketBase
export interface PBFavorite extends BaseRecord {
  user: string; // Relation to users collection
  manga: string; // Relation to manga collection
}

// Unlocked Chapter record in PocketBase
export interface PBUnlockedChapter extends BaseRecord {
  user: string; // Relation to users collection
  chapter: string; // Relation to chapters collection
  unlockedAt: string;
}

// Legacy types for backward compatibility (will be migrated)
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

// Helper type for PocketBase Collections
export interface PBCollections {
  users: PBUser;
  manga: PBManga;
  chapters: PBChapter;
  transactions: PBTransaction;
  reading_history: PBReadingHistory;
  favorites: PBFavorite;
  unlocked_chapters: PBUnlockedChapter;
}

// OAuth2 Provider types
export type OAuth2Provider = 'google';

// OAuth2 authentication data
export interface OAuth2AuthData {
  meta?: {
    avatarUrl?: string;
    name?: string;
    email?: string;
  };
}

