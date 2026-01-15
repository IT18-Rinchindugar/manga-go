import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRole = pgEnum('user_role', ['USER', 'ADMIN']);
export const mangaStatus = pgEnum('manga_status', ['Ongoing', 'Completed', 'Hiatus']);
export const transactionType = pgEnum('transaction_type', ['COIN_PURCHASE', 'CHAPTER_UNLOCK']);

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRole("role").notNull().default('USER'),
  coins: integer("coins").notNull().default(0),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Manga Table
export const manga = pgTable("manga", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  altTitle: text("alt_title"),
  author: text("author").notNull(),
  artist: text("artist"),
  coverUrl: text("cover_url").notNull(),
  synopsis: text("synopsis").notNull(),
  genres: text("genres").array().notNull(),
  status: mangaStatus("status").notNull().default('Ongoing'),
  releaseYear: integer("release_year").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull().default('0.0'),
  reviews: integer("reviews").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMangaSchema = createInsertSchema(manga).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviews: true
});

export type InsertManga = z.infer<typeof insertMangaSchema>;
export type Manga = typeof manga.$inferSelect;

// Chapters Table
export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mangaId: varchar("manga_id").notNull().references(() => manga.id, { onDelete: 'cascade' }),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  pageUrls: text("page_urls").array().notNull(),
  price: integer("price").notNull().default(0),
  isFree: boolean("is_free").notNull().default(false),
  releaseDate: timestamp("release_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChapterSchema = createInsertSchema(chapters).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;

// Transactions Table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: transactionType("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  relatedChapterId: varchar("related_chapter_id").references(() => chapters.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Reading History Table
export const readingHistory = pgTable("reading_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  mangaId: varchar("manga_id").notNull().references(() => manga.id, { onDelete: 'cascade' }),
  chapterId: varchar("chapter_id").notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  lastRead: timestamp("last_read").notNull().defaultNow(),
});

export const insertReadingHistorySchema = createInsertSchema(readingHistory).omit({ 
  id: true
});

export type InsertReadingHistory = z.infer<typeof insertReadingHistorySchema>;
export type ReadingHistory = typeof readingHistory.$inferSelect;

// Favorites Table
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  mangaId: varchar("manga_id").notNull().references(() => manga.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Unlocked Chapters Table (tracks which chapters users have purchased)
export const unlockedChapters = pgTable("unlocked_chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: varchar("chapter_id").notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const insertUnlockedChapterSchema = createInsertSchema(unlockedChapters).omit({ 
  id: true, 
  unlockedAt: true 
});

export type InsertUnlockedChapter = z.infer<typeof insertUnlockedChapterSchema>;
export type UnlockedChapter = typeof unlockedChapters.$inferSelect;
