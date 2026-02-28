// client/src/context/user-context.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { pb } from '@/lib/pocketbase';
import { subscriptionApi } from '@/services/subscription-api';
import type {
  PBManga,
  PBChapter,
  PBSubscriptionExpanded,
  PBFavorite,
  PBReadingHistory,
  PBUnlockedChapter,
} from '@/lib/pocketbase-types';

interface HistoryItem {
  id: string;
  manga: PBManga;
  chapter: PBChapter;
  lastRead: string;
}

interface UserContextType {
  // Data
  favorites: PBManga[];
  history: HistoryItem[];
  unlockedChapters: Set<string>;
  subscription: PBSubscriptionExpanded | null;
  
  // Loading states
  isLoadingFavorites: boolean;
  isLoadingHistory: boolean;
  isLoadingSubscription: boolean;
  
  // Favorite actions
  addFavorite: (mangaId: string) => Promise<void>;
  removeFavorite: (mangaId: string) => Promise<void>;
  isFavorite: (mangaId: string) => boolean;
  
  // History actions
  addToHistory: (mangaId: string, chapterId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  
  // Chapter access
  hasChapterAccess: (chapter: PBChapter) => boolean;
  unlockChapter: (chapter: PBChapter) => Promise<void>;
  
  // Subscription access
  hasSubscriptionAccess: (feature?: string) => boolean;
  canReadPremiumChapters: () => boolean;
  
  // Refresh functions
  refreshAll: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshUnlockedChapters: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<PBManga[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [unlockedChapters, setUnlockedChapters] = useState<Set<string>>(new Set());
  const [subscription, setSubscription] = useState<PBSubscriptionExpanded | null>(null);
  
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  // Initial data load when user logs in
  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      // Clear data when user logs out
      setFavorites([]);
      setHistory([]);
      setUnlockedChapters(new Set());
      setSubscription(null);
    }
  }, [user?.id]);

  // Fetch all user data
  const refreshAll = async () => {
    await Promise.all([
      refreshFavorites(),
      refreshHistory(),
      refreshUnlockedChapters(),
      refreshSubscription(),
    ]);
  };

  // Fetch favorites
  const refreshFavorites = async () => {
    if (!user) return;

    try {
      setIsLoadingFavorites(true);
      
      // const records = await pb.collection('favorites').getFullList({
      //   filter: `user = "${user.id}"`,
      //   expand: 'manga',
      //   sort: '-created',
      // });
      const records: PBFavorite[] = [];

      const favoriteManga = records
        .map(record => record?.expand?.manga)
        .filter(Boolean) as PBManga[];
      
      setFavorites(favoriteManga);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Fetch reading history
  const refreshHistory = async () => {
    if (!user) return;

    try {
      setIsLoadingHistory(true);
      
      // const records = await pb.collection('reading_history').getFullList({
      //   filter: `user = "${user.id}"`,
      //   expand: 'manga,chapter',
      //   sort: '-lastRead',
      //   limit: 50,
      // });
      const records: PBReadingHistory[] = [];
      const historyItems: HistoryItem[] = records
        .filter(record => record.expand?.manga && record.expand?.chapter)
        .map(record => ({
          id: record.id,
          manga: record.expand!.manga as PBManga,
          chapter: record.expand!.chapter as PBChapter,
          lastRead: record.lastRead,
        }));
      
      setHistory(historyItems);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch unlocked chapters
  const refreshUnlockedChapters = async () => {
    if (!user) return;

    try {
      // const records = await pb.collection('unlocked_chapters').getFullList({
      //   filter: `user = "${user.id}"`,
      // });

      const records: PBUnlockedChapter[] = [];
      const unlocked = new Set(records.map(r => r.chapter));
      setUnlockedChapters(unlocked);
    } catch (error) {
      console.error('Error fetching unlocked chapters:', error);
    }
  };

  // Fetch subscription
  const refreshSubscription = async () => {
    if (!user) return;

    try {
      setIsLoadingSubscription(true);
      const activeSub = await subscriptionApi.getUserActiveSubscription();
      setSubscription(activeSub);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Add favorite
  const addFavorite = async (mangaId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await pb.collection('favorites').create({
        user: user.id,
        manga: mangaId,
      });
      
      await refreshFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  // Remove favorite
  const removeFavorite = async (mangaId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const records = await pb.collection('favorites').getFullList({
        filter: `user = "${user.id}" && manga = "${mangaId}"`,
      });

      if (records.length > 0) {
        await pb.collection('favorites').delete(records[0].id);
        await refreshFavorites();
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  // Check if manga is favorited
  const isFavorite = (mangaId: string): boolean => {
    return favorites.some(manga => manga.id === mangaId);
  };

  // Add to history
  const addToHistory = async (mangaId: string, chapterId: string) => {
    if (!user) return;

    try {
      // Check if record exists
      const existing = await pb.collection('reading_history').getFullList({
        filter: `user = "${user.id}" && manga = "${mangaId}" && chapter = "${chapterId}"`,
      });

      if (existing.length > 0) {
        // Update existing record
        await pb.collection('reading_history').update(existing[0].id, {
          lastRead: new Date().toISOString(),
        });
      } else {
        // Create new record
        await pb.collection('reading_history').create({
          user: user.id,
          manga: mangaId,
          chapter: chapterId,
          lastRead: new Date().toISOString(),
        });
      }
      
      await refreshHistory();
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  // Clear history
  const clearHistory = async () => {
    if (!user) return;

    try {
      const records = await pb.collection('reading_history').getFullList({
        filter: `user = "${user.id}"`,
      });

      await Promise.all(
        records.map(record => pb.collection('reading_history').delete(record.id))
      );
      
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  };

  // Check if user has access to a chapter
  const hasChapterAccess = (chapter: PBChapter): boolean => {
    // Free chapters are always accessible
    if (chapter.isFree) return true;
    
    // Check if user has unlocked this specific chapter
    if (unlockedChapters.has(chapter.id)) return true;
    
    // Check subscription access
    if (subscription && subscription?.status === 'ACTIVE') {
      return true;
    }
    
    return false;   
  };

  // Unlock a chapter with coins
  const unlockChapter = async (chapter: PBChapter) => {
    if (!user) throw new Error('User not authenticated');
    if (chapter.isFree) return;

    try {
      // Check if user has enough coins
      const currentUser = await pb.collection('users').getOne(user.id);
      if (currentUser.coins < chapter.price) {
        throw new Error(`Insufficient coins. You need ${chapter.price} coins but have ${currentUser.coins}`);
      }

      // Deduct coins
      await pb.collection('users').update(user.id, {
        coins: currentUser.coins - chapter.price,
      });

      // Create unlocked chapter record
      await pb.collection('unlocked_chapters').create({
        user: user.id,
        chapter: chapter.id,
        unlockedAt: new Date().toISOString(),
      });

      // Create transaction record
      await pb.collection('transactions').create({
        user: user.id,
        type: 'CHAPTER_UNLOCK',
        amount: -chapter.price,
        description: `Unlocked chapter ${chapter.number}`,
        relatedChapter: chapter.id,
      });

      // Refresh data
      await refreshUnlockedChapters();
    } catch (error) {
      console.error('Error unlocking chapter:', error);
      throw error;
    }
  };

  // Check if user has active subscription
  const hasSubscriptionAccess = (feature?: string): boolean => {
    const isActive = subscription && subscription.status === 'ACTIVE' && new Date(subscription?.end_date || '') > new Date();
    if (!isActive) return false;
    
    return true;
  };

  // Check if user can read premium chapters (via subscription)
  const canReadPremiumChapters = (): boolean => {
    return hasSubscriptionAccess('unlimitedReading');
  };

  return (
    <UserContext.Provider
      value={{
        favorites,
        history,
        unlockedChapters,
        subscription,
        isLoadingFavorites,
        isLoadingHistory,
        isLoadingSubscription,
        addFavorite,
        removeFavorite,
        isFavorite,
        addToHistory,
        clearHistory,
        hasChapterAccess,
        unlockChapter,
        hasSubscriptionAccess,
        canReadPremiumChapters,
        refreshAll,
        refreshFavorites,
        refreshHistory,
        refreshSubscription,
        refreshUnlockedChapters,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}