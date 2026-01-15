import type { User, Manga, Chapter, Transaction, ReadingHistory } from "@shared/schema";

interface AuthResponse {
  user: Omit<User, 'password'>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface UnlockChapterData {
  chapterId: string;
}

interface UpdateReadingHistoryData {
  mangaId: string;
  chapterId: string;
}

interface PurchaseCoinsData {
  amount: number;
}

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/user');
  }

  // Manga
  async getAllManga(): Promise<Manga[]> {
    return this.request<Manga[]>('/manga');
  }

  async getMangaById(id: string): Promise<Manga> {
    return this.request<Manga>(`/manga/${id}`);
  }

  async searchManga(query: string): Promise<Manga[]> {
    return this.request<Manga[]>(`/manga/search?q=${encodeURIComponent(query)}`);
  }

  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    return this.request<Chapter[]>(`/manga/${mangaId}/chapters`);
  }

  async getChapterById(id: string): Promise<Chapter & { locked?: boolean }> {
    return this.request<Chapter & { locked?: boolean }>(`/chapters/${id}`);
  }

  async unlockChapter(chapterId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/chapters/${chapterId}/unlock`, {
      method: 'POST',
    });
  }

  // User
  async getUserProfile(): Promise<Omit<User, 'password'>> {
    return this.request<Omit<User, 'password'>>('/user/profile');
  }

  async getUserHistory(): Promise<ReadingHistory[]> {
    return this.request<ReadingHistory[]>('/user/history');
  }

  async updateReadingHistory(data: UpdateReadingHistoryData): Promise<ReadingHistory> {
    return this.request<ReadingHistory>('/user/history', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserFavorites(): Promise<string[]> {
    return this.request<string[]>('/user/favorites');
  }

  async addFavorite(mangaId: string): Promise<void> {
    await this.request('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ mangaId }),
    });
  }

  async removeFavorite(mangaId: string): Promise<void> {
    await this.request(`/user/favorites/${mangaId}`, {
      method: 'DELETE',
    });
  }

  async getUserTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/user/transactions');
  }

  async purchaseCoins(amount: number): Promise<AuthResponse> {
    return this.request<AuthResponse>('/user/purchase-coins', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Admin
  async getAnalytics(): Promise<{
    totalUsers: number;
    totalManga: number;
    totalRevenue: number;
  }> {
    return this.request('/admin/analytics');
  }

  async createManga(data: Omit<Manga, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviews'>): Promise<Manga> {
    return this.request<Manga>('/admin/manga', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateManga(id: string, data: Partial<Manga>): Promise<Manga> {
    return this.request<Manga>(`/admin/manga/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteManga(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/manga/${id}`, {
      method: 'DELETE',
    });
  }

  async createChapter(data: Omit<Chapter, 'id' | 'createdAt'>): Promise<Chapter> {
    return this.request<Chapter>('/admin/chapters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChapter(id: string, data: Partial<Chapter>): Promise<Chapter> {
    return this.request<Chapter>(`/admin/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChapter(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/chapters/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
