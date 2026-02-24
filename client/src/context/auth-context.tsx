/**
 * Authentication Context for Manga Stream
 * 
 * This context provides authentication functionality using PocketBase, including:
 * - OAuth2 authentication (Google)
 * - Traditional username/password authentication
 * - Automatic token refresh
 * - Auth state management
 * 
 * OAuth2 Usage:
 * ```tsx
 * const { loginWithOAuth2 } = useAuth();
 * 
 * // Initiate OAuth2 flow
 * await loginWithOAuth2('google');
 * ```
 * 
 * Traditional Auth Usage:
 * ```tsx
 * const { login, register } = useAuth();
 * 
 * // Login
 * await login(username, password);
 * 
 * // Register
 * await register(username, email, password);
 * ```
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { pb } from '../lib/pocketbase';
import type { PBUser, OAuth2Provider } from '../lib/pocketbase-types';
import type { RecordModel } from 'pocketbase';

// Convert PocketBase user to our app user format
function convertPBUserToAppUser(pbUser: RecordModel | null): Omit<PBUser, 'password'> | null {
  if (!pbUser) return null;
  
  // Ensure username is always present (fallback to name or email)
  const username = pbUser.username || pbUser.name || pbUser.email?.split('@')[0] || 'User';
  
  return {
    id: pbUser.id,
    email: pbUser.email || '',
    username: username,
    name: pbUser.name,
    avatar: pbUser.avatar,
    role: pbUser.role || 'USER',
    coins: pbUser.coins || 0,
    verified: pbUser.verified || false,
    emailVisibility: pbUser.emailVisibility,
    created: pbUser.created,
    updated: pbUser.updated,
    collectionId: pbUser.collectionId,
    collectionName: pbUser.collectionName,
  };
}

interface AuthContextType {
  user: Omit<PBUser, 'password'> | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  loginWithOAuth2: (provider: OAuth2Provider) => Promise<void>;
  handleOAuth2Callback: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<PBUser, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user from PocketBase auth store
  const fetchUser = async () => {
    try {
      // Check if there's a valid auth token
      if (pb.authStore.isValid) {
        // Refresh the auth state to ensure token is still valid
        await pb.collection('users').authRefresh();
        const pbUser = pb.authStore.model;
        setUser(convertPBUserToAppUser(pbUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Clear invalid auth
      pb.authStore.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up auth state listener and initial fetch
  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = pb.authStore.onChange(() => {
      const pbUser = pb.authStore.model;
      setUser(convertPBUserToAppUser(pbUser));
    });

    // Initial fetch
    fetchUser();

    // Set up periodic token refresh (every 5 minutes)
    const refreshInterval = setInterval(async () => {
      if (pb.authStore.isValid) {
        try {
          await pb.collection('users').authRefresh();
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, clear auth and redirect to login
          pb.authStore.clear();
          setUser(null);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  // OAuth2 login - initiates the OAuth flow
  const loginWithOAuth2 = async (provider: OAuth2Provider) => {
    try {
      setIsLoading(true);
      
      // Initiate OAuth2 flow with PocketBase
      // This will open a popup window for authentication
      const authData = await pb.collection('users').authWithOAuth2({
        provider,
      });

      // Update user state after successful authentication
      setUser(convertPBUserToAppUser(authData.record));
    } catch (error) {
      console.error('OAuth2 error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth2 callback after redirect
  // This is called when the OAuth popup closes or redirect completes
  const handleOAuth2Callback = async () => {
    try {
      setIsLoading(true);
      
      // Check if authentication was successful and refresh the auth state
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        const pbUser = pb.authStore.model;
        setUser(convertPBUserToAppUser(pbUser));
      }
    } catch (error) {
      console.error('OAuth2 callback error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Traditional username/password login (kept for backward compatibility)
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const authData = await pb.collection('users').authWithPassword(username, password);
      setUser(convertPBUserToAppUser(authData.record));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Traditional registration (kept for backward compatibility)
  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Create user
      const userData = {
        username,
        email,
        password,
        passwordConfirm: password,
        role: 'USER',
        coins: 100,
        emailVisibility: true,
      };
      
      await pb.collection('users').create(userData);
      
      // Auto-login after registration
      const authData = await pb.collection('users').authWithPassword(username, password);
      setUser(convertPBUserToAppUser(authData.record));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      pb.authStore.clear();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Refetch user data
  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        refetchUser,
        loginWithOAuth2,
        handleOAuth2Callback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
