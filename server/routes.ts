import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, requireAdmin, hashPassword } from "./auth";
import passport from "passport";
import { insertUserSchema, insertMangaSchema, insertChapterSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ===== Authentication Routes =====
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });
  
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Error during login" });
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in" });
        }
        
        const { password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/user", requireAuth, (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });
  
  // ===== Web User Routes (Public & Authenticated) =====
  
  // Get all manga (public)
  app.get("/api/manga", async (req, res) => {
    try {
      const allManga = await storage.getAllManga();
      res.json(allManga);
    } catch (error) {
      res.status(500).json({ message: "Error fetching manga" });
    }
  });
  
  // Search manga (public)
  app.get("/api/manga/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      const results = await storage.searchManga(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Error searching manga" });
    }
  });
  
  // Get manga by ID (public)
  app.get("/api/manga/:id", async (req, res) => {
    try {
      const manga = await storage.getMangaById(req.params.id);
      if (!manga) {
        return res.status(404).json({ message: "Manga not found" });
      }
      res.json(manga);
    } catch (error) {
      res.status(500).json({ message: "Error fetching manga" });
    }
  });
  
  // Get chapters for manga (public)
  app.get("/api/manga/:id/chapters", async (req, res) => {
    try {
      const chapters = await storage.getChaptersByMangaId(req.params.id);
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chapters" });
    }
  });
  
  // Get chapter by ID (requires auth to check unlocked status)
  app.get("/api/chapters/:id", requireAuth, async (req, res) => {
    try {
      const chapter = await storage.getChapterById(req.params.id);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      // Check if chapter is unlocked for this user
      const isUnlocked = chapter.isFree || 
                        await storage.isChapterUnlocked(req.user!.id, chapter.id);
      
      if (!isUnlocked) {
        // Return chapter info without pages
        return res.json({
          ...chapter,
          pageUrls: [],
          locked: true
        });
      }
      
      res.json({ ...chapter, locked: false });
    } catch (error) {
      res.status(500).json({ message: "Error fetching chapter" });
    }
  });
  
  // Unlock chapter (requires auth)
  app.post("/api/chapters/:id/unlock", requireAuth, async (req, res) => {
    try {
      const chapter = await storage.getChapterById(req.params.id);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      // Check if already unlocked
      const alreadyUnlocked = await storage.isChapterUnlocked(req.user!.id, chapter.id);
      if (alreadyUnlocked || chapter.isFree) {
        return res.status(400).json({ message: "Chapter already unlocked" });
      }
      
      // Check if user has enough coins
      const user = await storage.getUser(req.user!.id);
      if (!user || user.coins < chapter.price) {
        return res.status(400).json({ message: "Insufficient coins" });
      }
      
      // Deduct coins
      await storage.updateUserCoins(req.user!.id, -chapter.price);
      
      // Unlock chapter
      await storage.unlockChapter({
        userId: req.user!.id,
        chapterId: chapter.id
      });
      
      // Create transaction record
      await storage.createTransaction({
        userId: req.user!.id,
        type: 'CHAPTER_UNLOCK',
        amount: -chapter.price,
        description: `Unlocked chapter ${chapter.number}`,
        relatedChapterId: chapter.id
      });
      
      res.json({ message: "Chapter unlocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error unlocking chapter" });
    }
  });
  
  // User profile routes
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });
  
  // Get user reading history
  app.get("/api/user/history", requireAuth, async (req, res) => {
    try {
      const history = await storage.getUserReadingHistory(req.user!.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reading history" });
    }
  });
  
  // Update reading history
  app.post("/api/user/history", requireAuth, async (req, res) => {
    try {
      const { mangaId, chapterId } = req.body;
      if (!mangaId || !chapterId) {
        return res.status(400).json({ message: "mangaId and chapterId required" });
      }
      
      const history = await storage.updateReadingHistory({
        userId: req.user!.id,
        mangaId,
        chapterId,
        lastRead: new Date()
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Error updating reading history" });
    }
  });
  
  // Get user favorites
  app.get("/api/user/favorites", requireAuth, async (req, res) => {
    try {
      const favoriteIds = await storage.getUserFavorites(req.user!.id);
      res.json(favoriteIds);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });
  
  // Add favorite
  app.post("/api/user/favorites", requireAuth, async (req, res) => {
    try {
      const { mangaId } = req.body;
      if (!mangaId) {
        return res.status(400).json({ message: "mangaId required" });
      }
      
      const favorite = await storage.addFavorite({
        userId: req.user!.id,
        mangaId
      });
      
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Error adding favorite" });
    }
  });
  
  // Remove favorite
  app.delete("/api/user/favorites/:mangaId", requireAuth, async (req, res) => {
    try {
      await storage.removeFavorite(req.user!.id, req.params.mangaId);
      res.json({ message: "Favorite removed" });
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite" });
    }
  });
  
  // Get user transactions
  app.get("/api/user/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.user!.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });
  
  // Purchase coins
  app.post("/api/user/purchase-coins", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid coin amount" });
      }
      
      // In a real app, this would integrate with a payment processor
      // For now, we'll just add the coins
      const updatedUser = await storage.updateUserCoins(req.user!.id, amount);
      
      // Create transaction record
      await storage.createTransaction({
        userId: req.user!.id,
        type: 'COIN_PURCHASE',
        amount: amount,
        description: `Purchased ${amount} coins`
      });
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Error purchasing coins" });
    }
  });
  
  // ===== Admin Routes (Require Admin Role) =====
  
  // Get analytics
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const [totalUsers, totalManga, totalRevenue] = await Promise.all([
        storage.getTotalUsers(),
        storage.getTotalManga(),
        storage.getTotalRevenue()
      ]);
      
      res.json({
        totalUsers,
        totalManga,
        totalRevenue
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });
  
  // Create manga (admin only)
  app.post("/api/admin/manga", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMangaSchema.parse(req.body);
      const manga = await storage.createManga(validatedData);
      res.status(201).json(manga);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating manga" });
    }
  });
  
  // Update manga (admin only)
  app.put("/api/admin/manga/:id", requireAdmin, async (req, res) => {
    try {
      const manga = await storage.updateManga(req.params.id, req.body);
      res.json(manga);
    } catch (error) {
      res.status(500).json({ message: "Error updating manga" });
    }
  });
  
  // Delete manga (admin only)
  app.delete("/api/admin/manga/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteManga(req.params.id);
      res.json({ message: "Manga deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting manga" });
    }
  });
  
  // Create chapter (admin only)
  app.post("/api/admin/chapters", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertChapterSchema.parse(req.body);
      const chapter = await storage.createChapter(validatedData);
      res.status(201).json(chapter);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating chapter" });
    }
  });
  
  // Update chapter (admin only)
  app.put("/api/admin/chapters/:id", requireAdmin, async (req, res) => {
    try {
      const chapter = await storage.updateChapter(req.params.id, req.body);
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ message: "Error updating chapter" });
    }
  });
  
  // Delete chapter (admin only)
  app.delete("/api/admin/chapters/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteChapter(req.params.id);
      res.json({ message: "Chapter deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting chapter" });
    }
  });

  return httpServer;
}
