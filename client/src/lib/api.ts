import type { User, Manga, Chapter, Transaction, ReadingHistory } from "@shared/schema";

interface AuthResponse {
  user: Omit<User, 'password'>;
}

// Mock data
const mockUsers: Map<string, Omit<User, 'password'> & { password: string }> = new Map([
  ['1', {
    id: '1',
    username: 'demo',
    email: 'demo@inkflow.com',
    password: 'user123',
    role: 'USER',
    coins: 500,
    avatar: null,
    createdAt: new Date()
  }],
  ['2', {
    id: '2',
    username: 'admin',
    email: 'admin@inkflow.com',
    password: 'admin123',
    role: 'ADMIN',
    coins: 10000,
    avatar: null,
    createdAt: new Date()
  }]
]);

const mockManga: Manga[] = [
  {
    id: '1',
    title: 'Shadow Chronicles',
    altTitle: '影之编年史',
    author: 'Akira Tanaka',
    artist: 'Akira Tanaka',
    coverUrl: 'https://picsum.photos/seed/manga1/400/600',
    synopsis: 'In a world where shadows come to life at night, a young warrior discovers they have the power to control darkness itself. As ancient evils awaken, they must master their abilities to save humanity from being consumed by eternal night.',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    status: 'Ongoing',
    releaseYear: 2023,
    rating: '4.8',
    reviews: 1250,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Mystic Academy',
    altTitle: '神秘学院',
    author: 'Luna Park',
    artist: 'Luna Park',
    coverUrl: 'https://picsum.photos/seed/manga2/400/600',
    synopsis: 'A prestigious academy for magic users hides dark secrets. When a transfer student arrives with mysterious powers, they uncover a conspiracy that threatens the entire magical world.',
    genres: ['Fantasy', 'School Life', 'Mystery'],
    status: 'Ongoing',
    releaseYear: 2024,
    rating: '4.6',
    reviews: 890,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Cyber Ronin',
    altTitle: 'サイバー浪人',
    author: 'Kenji Yamamoto',
    artist: 'Kenji Yamamoto',
    coverUrl: 'https://picsum.photos/seed/manga3/400/600',
    synopsis: 'In the neon-lit streets of Neo Tokyo, a cybernetically enhanced samurai fights against corporate tyranny. With a blade that cuts through code and steel alike, they battle to restore honor.',
    genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
    status: 'Ongoing',
    releaseYear: 2024,
    rating: '4.7',
    reviews: 720,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Love in Bloom',
    altTitle: '恋の花',
    author: 'Sakura Matsuda',
    artist: 'Sakura Matsuda',
    coverUrl: 'https://picsum.photos/seed/manga4/400/600',
    synopsis: 'A heartwarming tale of two high school students who discover love through their shared passion for gardening. As they nurture plants together, their feelings blossom into something beautiful.',
    genres: ['Romance', 'School Life', 'Slice of Life'],
    status: 'Completed',
    releaseYear: 2023,
    rating: '4.5',
    reviews: 650,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'Dragon Slayer Academy',
    altTitle: '龍殺学園',
    author: 'Hiro Nakamura',
    artist: 'Hiro Nakamura',
    coverUrl: 'https://picsum.photos/seed/manga5/400/600',
    synopsis: 'In a world where dragons threaten humanity, young warriors train at a legendary academy. Follow our hero as they learn to harness ancient powers and forge unbreakable bonds.',
    genres: ['Action', 'Fantasy', 'Adventure'],
    status: 'Ongoing',
    releaseYear: 2024,
    rating: '4.9',
    reviews: 1800,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    title: 'Ghost Detective',
    altTitle: '幽霊探偵',
    author: 'Yuki Sato',
    artist: 'Yuki Sato',
    coverUrl: 'https://picsum.photos/seed/manga6/400/600',
    synopsis: 'A detective who can see ghosts solves supernatural crimes in modern Tokyo. Each case reveals more about the hidden world that exists alongside our own.',
    genres: ['Mystery', 'Supernatural', 'Horror'],
    status: 'Hiatus',
    releaseYear: 2022,
    rating: '4.4',
    reviews: 520,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Pre-generated static chapters for consistency
const chapterTitlesByManga: Record<string, string[]> = {
  '1': ['The Awakening', 'First Shadow', 'Dark Powers', 'Night Training', 'Shadow Warriors', 'Ancient Evil', 'Battle in Darkness', 'The Prophecy'],
  '2': ['New Beginnings', 'First Day', 'Hidden Powers', 'The Test', 'Secret Society', 'Forbidden Magic'],
  '3': ['Digital Blade', 'Neon Streets', 'Corporate Wars', 'Code Samurai', 'System Override'],
  '4': ['First Encounter', 'Seeds of Friendship', 'Growing Feelings', 'Confession', 'Together Forever'],
  '5': ['Dragon\'s Breath', 'Training Begins', 'First Battle', 'Academy Trials', 'The Tournament', 'Final Exam', 'Dragon\'s Lair'],
  '6': ['The First Case', 'Haunted Manor', 'Spirit Medium', 'Cold Case', 'The Truth']
};

// Cached chapters for consistency
const chaptersCache: Map<string, Chapter[]> = new Map();

const getChaptersForManga = (mangaId: string): Chapter[] => {
  if (chaptersCache.has(mangaId)) {
    return chaptersCache.get(mangaId)!;
  }
  
  const titles = chapterTitlesByManga[mangaId] || ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'];
  
  const chapters: Chapter[] = titles.map((title, i) => ({
    id: `${mangaId}-ch-${i + 1}`,
    mangaId,
    number: i + 1,
    title,
    pageUrls: Array.from({ length: 15 }, (_, j) => `https://picsum.photos/seed/page${mangaId}${i}${j}/800/1200`),
    price: i < 3 ? 0 : 50,
    isFree: i < 3,
    releaseDate: new Date(2024, 0, (i + 1) * 7),
    createdAt: new Date()
  }));
  
  chaptersCache.set(mangaId, chapters);
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
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auth
  async register(data: { username: string; email: string; password: string }): Promise<AuthResponse> {
    await this.delay();
    
    // Check if username exists
    const existingUser = Array.from(mockUsers.values()).find(u => u.username === data.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    const id = String(mockUsers.size + 1);
    const newUser = {
      id,
      username: data.username,
      email: data.email,
      password: data.password,
      role: 'USER' as const,
      coins: 100,
      avatar: null,
      createdAt: new Date()
    };
    mockUsers.set(id, newUser);
    const { password, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;
    return { user: userWithoutPassword };
  }

  async login(data: { username: string; password: string }): Promise<AuthResponse> {
    await this.delay();
    const user = Array.from(mockUsers.values()).find(
      u => u.username === data.username && u.password === data.password
    );
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const { password, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;
    return { user: userWithoutPassword };
  }

  async logout(): Promise<{ message: string }> {
    await this.delay(200);
    currentUser = null;
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(): Promise<AuthResponse> {
    await this.delay(100);
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    return { user: currentUser };
  }

  // Manga
  async getAllManga(): Promise<Manga[]> {
    await this.delay();
    return mockManga;
  }

  async getMangaById(id: string): Promise<Manga> {
    await this.delay();
    const manga = mockManga.find(m => m.id === id);
    if (!manga) {
      throw new Error('Manga not found');
    }
    return manga;
  }

  async searchManga(query: string): Promise<Manga[]> {
    await this.delay();
    const lowerQuery = query.toLowerCase();
    return mockManga.filter(
      m => m.title.toLowerCase().includes(lowerQuery) || 
           m.author.toLowerCase().includes(lowerQuery) ||
           m.genres.some(g => g.toLowerCase().includes(lowerQuery))
    );
  }

  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    await this.delay();
    return getChaptersForManga(mangaId);
  }

  async getChapterById(id: string): Promise<Chapter & { locked?: boolean }> {
    await this.delay();
    const [mangaId] = id.split('-ch-');
    const chapters = getChaptersForManga(mangaId);
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    
    // If chapter is free, return it
    if (chapter.isFree) {
      return { ...chapter, locked: false };
    }
    
    // If user is not authenticated, return locked
    if (!currentUser) {
      return { ...chapter, pageUrls: [], locked: true };
    }
    
    // Check if user has unlocked this chapter
    const userState = getOrCreateUserState(currentUser.id);
    const isUnlocked = userState.unlockedChapters.has(id);
    
    if (!isUnlocked) {
      return { ...chapter, pageUrls: [], locked: true };
    }
    
    return { ...chapter, locked: false };
  }

  async unlockChapter(chapterId: string): Promise<{ message: string }> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const [mangaId] = chapterId.split('-ch-');
    const chapters = getChaptersForManga(mangaId);
    const chapter = chapters.find(c => c.id === chapterId);
    
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    
    const userState = getOrCreateUserState(currentUser.id);
    
    if (userState.unlockedChapters.has(chapterId) || chapter.isFree) {
      throw new Error('Chapter already unlocked');
    }
    
    if (currentUser.coins < chapter.price) {
      throw new Error('Insufficient coins');
    }
    
    // Update user coins
    currentUser = { ...currentUser, coins: currentUser.coins - chapter.price };
    const mockUser = mockUsers.get(currentUser.id);
    if (mockUser) {
      mockUser.coins = currentUser.coins;
    }
    
    userState.unlockedChapters.add(chapterId);
    
    userState.transactions.push({
      id: String(userState.transactions.length + 1),
      userId: currentUser.id,
      type: 'CHAPTER_UNLOCK',
      amount: -chapter.price,
      description: `Unlocked Chapter ${chapter.number}`,
      relatedChapterId: chapterId,
      createdAt: new Date()
    });
    
    return { message: 'Chapter unlocked successfully' };
  }

  // User
  async getUserProfile(): Promise<Omit<User, 'password'>> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    return currentUser;
  }

  async getUserHistory(): Promise<ReadingHistory[]> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    const userState = getOrCreateUserState(currentUser.id);
    return userState.readingHistory;
  }

  async updateReadingHistory(data: { mangaId: string; chapterId: string }): Promise<ReadingHistory> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const userState = getOrCreateUserState(currentUser.id);
    const existing = userState.readingHistory.find(
      h => h.mangaId === data.mangaId && h.chapterId === data.chapterId
    );
    
    if (existing) {
      existing.lastRead = new Date();
      return existing;
    }
    
    const newHistory: ReadingHistory = {
      id: String(userState.readingHistory.length + 1),
      userId: currentUser.id,
      mangaId: data.mangaId,
      chapterId: data.chapterId,
      lastRead: new Date()
    };
    userState.readingHistory.push(newHistory);
    return newHistory;
  }

  async getUserFavorites(): Promise<string[]> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    const userState = getOrCreateUserState(currentUser.id);
    return Array.from(userState.favorites);
  }

  async addFavorite(mangaId: string): Promise<void> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    const userState = getOrCreateUserState(currentUser.id);
    userState.favorites.add(mangaId);
  }

  async removeFavorite(mangaId: string): Promise<void> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    const userState = getOrCreateUserState(currentUser.id);
    userState.favorites.delete(mangaId);
  }

  async getUserTransactions(): Promise<Transaction[]> {
    await this.delay();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    const userState = getOrCreateUserState(currentUser.id);
    return userState.transactions;
  }

  async purchaseCoins(amount: number): Promise<AuthResponse> {
    await this.delay(500);
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    currentUser = { ...currentUser, coins: currentUser.coins + amount };
    const mockUser = mockUsers.get(currentUser.id);
    if (mockUser) {
      mockUser.coins = currentUser.coins;
    }
    
    const userState = getOrCreateUserState(currentUser.id);
    userState.transactions.push({
      id: String(userState.transactions.length + 1),
      userId: currentUser.id,
      type: 'COIN_PURCHASE',
      amount: amount,
      description: `Purchased ${amount} coins`,
      relatedChapterId: null,
      createdAt: new Date()
    });
    
    return { user: currentUser };
  }

  // Admin
  async getAnalytics(): Promise<{
    totalUsers: number;
    totalManga: number;
    totalRevenue: number;
  }> {
    await this.delay();
    return {
      totalUsers: mockUsers.size,
      totalManga: mockManga.length,
      totalRevenue: 15420
    };
  }

  async createManga(data: Omit<Manga, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviews'>): Promise<Manga> {
    await this.delay();
    const newManga: Manga = {
      ...data,
      id: String(mockManga.length + 1),
      rating: '0.0',
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockManga.push(newManga);
    return newManga;
  }

  async updateManga(id: string, data: Partial<Manga>): Promise<Manga> {
    await this.delay();
    const index = mockManga.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Manga not found');
    }
    mockManga[index] = { ...mockManga[index], ...data, updatedAt: new Date() };
    return mockManga[index];
  }

  async deleteManga(id: string): Promise<{ message: string }> {
    await this.delay();
    const index = mockManga.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Manga not found');
    }
    mockManga.splice(index, 1);
    return { message: 'Manga deleted successfully' };
  }

  async createChapter(data: Omit<Chapter, 'id' | 'createdAt'>): Promise<Chapter> {
    await this.delay();
    const newChapter: Chapter = {
      ...data,
      id: `${data.mangaId}-ch-new-${Date.now()}`,
      createdAt: new Date()
    };
    const chapters = getChaptersForManga(data.mangaId);
    chapters.push(newChapter);
    return newChapter;
  }

  async updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter> {
    await this.delay();
    const [mangaId] = id.split('-ch-');
    const chapters = getChaptersForManga(mangaId);
    const index = chapters.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Chapter not found');
    }
    chapters[index] = { ...chapters[index], ...data };
    return chapters[index];
  }

  async deleteChapter(id: string): Promise<{ message: string }> {
    await this.delay();
    const [mangaId] = id.split('-ch-');
    const chapters = getChaptersForManga(mangaId);
    const index = chapters.findIndex(c => c.id === id);
    if (index !== -1) {
      chapters.splice(index, 1);
    }
    return { message: 'Chapter deleted successfully' };
  }
}

export const api = new ApiClient();
