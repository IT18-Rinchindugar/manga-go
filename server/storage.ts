import { 
  users, 
  manga, 
  chapters, 
  transactions, 
  readingHistory, 
  favorites, 
  unlockedChapters,
  type User, 
  type InsertUser,
  type Manga,
  type InsertManga,
  type Chapter,
  type InsertChapter,
  type Transaction,
  type InsertTransaction,
  type ReadingHistory,
  type InsertReadingHistory,
  type Favorite,
  type InsertFavorite,
  type UnlockedChapter,
  type InsertUnlockedChapter
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(userId: string, amount: number): Promise<User>;
  
  // Manga
  getAllManga(): Promise<Manga[]>;
  getMangaById(id: string): Promise<Manga | undefined>;
  createManga(manga: InsertManga): Promise<Manga>;
  updateManga(id: string, manga: Partial<InsertManga>): Promise<Manga>;
  deleteManga(id: string): Promise<void>;
  searchManga(query: string): Promise<Manga[]>;
  
  // Chapters
  getChaptersByMangaId(mangaId: string): Promise<Chapter[]>;
  getChapterById(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapter(id: string, chapter: Partial<InsertChapter>): Promise<Chapter>;
  deleteChapter(id: string): Promise<void>;
  
  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  
  // Reading History
  updateReadingHistory(history: InsertReadingHistory): Promise<ReadingHistory>;
  getUserReadingHistory(userId: string): Promise<ReadingHistory[]>;
  
  // Favorites
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, mangaId: string): Promise<void>;
  getUserFavorites(userId: string): Promise<string[]>;
  isFavorite(userId: string, mangaId: string): Promise<boolean>;
  
  // Unlocked Chapters
  unlockChapter(unlock: InsertUnlockedChapter): Promise<UnlockedChapter>;
  isChapterUnlocked(userId: string, chapterId: string): Promise<boolean>;
  getUserUnlockedChapters(userId: string): Promise<string[]>;
  
  // Analytics (Admin)
  getTotalUsers(): Promise<number>;
  getTotalManga(): Promise<number>;
  getTotalRevenue(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserCoins(userId: string, amount: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ coins: sql`${users.coins} + ${amount}` })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Manga
  async getAllManga(): Promise<Manga[]> {
    return await db.select().from(manga).orderBy(desc(manga.createdAt));
  }

  async getMangaById(id: string): Promise<Manga | undefined> {
    const [result] = await db.select().from(manga).where(eq(manga.id, id));
    return result || undefined;
  }

  async createManga(insertManga: InsertManga): Promise<Manga> {
    const [result] = await db.insert(manga).values(insertManga).returning();
    return result;
  }

  async updateManga(id: string, updateData: Partial<InsertManga>): Promise<Manga> {
    const [result] = await db
      .update(manga)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(manga.id, id))
      .returning();
    return result;
  }

  async deleteManga(id: string): Promise<void> {
    await db.delete(manga).where(eq(manga.id, id));
  }

  async searchManga(query: string): Promise<Manga[]> {
    return await db
      .select()
      .from(manga)
      .where(
        sql`${manga.title} ILIKE ${'%' + query + '%'} OR ${manga.author} ILIKE ${'%' + query + '%'}`
      );
  }

  // Chapters
  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    return await db
      .select()
      .from(chapters)
      .where(eq(chapters.mangaId, mangaId))
      .orderBy(chapters.number);
  }

  async getChapterById(id: string): Promise<Chapter | undefined> {
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id));
    return chapter || undefined;
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const [chapter] = await db.insert(chapters).values(insertChapter).returning();
    return chapter;
  }

  async updateChapter(id: string, updateData: Partial<InsertChapter>): Promise<Chapter> {
    const [chapter] = await db
      .update(chapters)
      .set(updateData)
      .where(eq(chapters.id, id))
      .returning();
    return chapter;
  }

  async deleteChapter(id: string): Promise<void> {
    await db.delete(chapters).where(eq(chapters.id, id));
  }

  // Transactions
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  // Reading History
  async updateReadingHistory(insertHistory: InsertReadingHistory): Promise<ReadingHistory> {
    // Upsert: update if exists, insert if not
    const existing = await db
      .select()
      .from(readingHistory)
      .where(
        and(
          eq(readingHistory.userId, insertHistory.userId),
          eq(readingHistory.mangaId, insertHistory.mangaId),
          eq(readingHistory.chapterId, insertHistory.chapterId)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(readingHistory)
        .set({ lastRead: new Date() })
        .where(eq(readingHistory.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(readingHistory).values(insertHistory).returning();
      return inserted;
    }
  }

  async getUserReadingHistory(userId: string): Promise<ReadingHistory[]> {
    return await db
      .select()
      .from(readingHistory)
      .where(eq(readingHistory.userId, userId))
      .orderBy(desc(readingHistory.lastRead));
  }

  // Favorites
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }

  async removeFavorite(userId: string, mangaId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.mangaId, mangaId)));
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    const results = await db
      .select({ mangaId: favorites.mangaId })
      .from(favorites)
      .where(eq(favorites.userId, userId));
    return results.map(r => r.mangaId);
  }

  async isFavorite(userId: string, mangaId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.mangaId, mangaId)));
    return !!result;
  }

  // Unlocked Chapters
  async unlockChapter(insertUnlock: InsertUnlockedChapter): Promise<UnlockedChapter> {
    const [unlock] = await db.insert(unlockedChapters).values(insertUnlock).returning();
    return unlock;
  }

  async isChapterUnlocked(userId: string, chapterId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(unlockedChapters)
      .where(
        and(eq(unlockedChapters.userId, userId), eq(unlockedChapters.chapterId, chapterId))
      );
    return !!result;
  }

  async getUserUnlockedChapters(userId: string): Promise<string[]> {
    const results = await db
      .select({ chapterId: unlockedChapters.chapterId })
      .from(unlockedChapters)
      .where(eq(unlockedChapters.userId, userId));
    return results.map(r => r.chapterId);
  }

  // Analytics
  async getTotalUsers(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result.count);
  }

  async getTotalManga(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(manga);
    return Number(result.count);
  }

  async getTotalRevenue(): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`sum(${transactions.amount})` })
      .from(transactions)
      .where(eq(transactions.type, 'COIN_PURCHASE'));
    return Number(result.total || 0);
  }
}

export const storage = new DatabaseStorage();
