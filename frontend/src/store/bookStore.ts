import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Book, User, Trade, Notification, AuthResponse } from '../types'
import { auth, githubProvider } from '../utils/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import api, { setAuthToken } from '../utils/api'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'

interface BookStore {
  books: Book[]
  currentUser: User | null
  trades: Trade[]
  notifications: Notification[]
  filters: {
    search: string
    categories: string[]
    condition: string[]
  }
  isAuthenticated: boolean
  isLoading: {
    auth: boolean
    books: boolean
    trades: boolean
  }
  error: string | null
  message: string | null
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  checkAuthStatus: () => Promise<void>
  signInWithGithub: () => Promise<void>
  logout: () => Promise<void>
  setAuthUser: (user: User | null) => void
  
  // Book actions
  fetchBooks: () => Promise<void>
  addBook: (book: Omit<Book, '_id' | 'createdAt' | 'owner'>) => Promise<void>
  searchBooks: (query: string) => void
  filterByCategory: (categories: string[]) => void
  filterByCondition: (conditions: string[]) => void
  
  // User actions
  updateUserSettings: (settings: Partial<User>) => Promise<void>
  toggleFavorite: (bookId: string) => void
  toggleWishlist: (bookId: string) => void
  
  // Trade actions
  fetchUserTrades: () => Promise<void>
  proposeTrade: (proposerBookId: string, receiverBookId: string, message?: string) => Promise<void>
  updateTradeStatus: (tradeId: string, status: Trade['status']) => Promise<void>
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (notificationId: string) => void
  clearNotifications: () => void

  // Error handling
  setError: (error: string | null) => void
  setMessage: (message: string | null) => void
  clearError: () => void
  clearMessage: () => void
}

export const useStore = create<BookStore>()(
  persist(
    (set, get) => ({
      books: [],
      currentUser: null,
      trades: [],
      notifications: [],
      filters: {
        search: '',
        categories: [],
        condition: []
      },
      isAuthenticated: false,
      isLoading: {
        auth: false,
        books: false,
        trades: false
      },
      error: null,
      message: null,

      fetchBooks: async () => {
        set(state => ({ isLoading: { ...state.isLoading, books: true } }));
        try {
          const { data } = await api.get<Book[]>('/books');
          set({ books: data });
        } catch (error) {
          set({ error: 'Failed to fetch books' });
        } finally {
          set(state => ({ isLoading: { ...state.isLoading, books: false } }));
        }
      },

      addBook: async (bookData) => {
        const { currentUser } = get();
        if (!currentUser) {
          set({ message: 'Please set up your profile in Settings first' });
          return;
        }

        set(state => ({ isLoading: { ...state.isLoading, books: true } }));
        try {
          const { data } = await api.post<Book>('/books', bookData);
          set(state => ({
            books: [...state.books, data],
            message: 'Book added successfully'
          }));
        } catch (error) {
          set({ error: 'Failed to add book' });
        } finally {
          set(state => ({ isLoading: { ...state.isLoading, books: false } }));
        }
      },

      searchBooks: (query) => set(state => ({
        filters: { ...state.filters, search: query }
      })),

      filterByCategory: (categories) => set(state => ({
        filters: { ...state.filters, categories }
      })),

      filterByCondition: (conditions) => set(state => ({
        filters: { ...state.filters, condition: conditions }
      })),

      updateUserSettings: async (settings) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        try {
          const { data } = await api.put<User>('/users/profile', settings);
          set({
            currentUser: data,
            message: 'Profile updated successfully'
          });
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(data));
        } catch (error) {
          set({ error: 'Failed to update profile' });
          throw error;
        }
      },

      toggleFavorite: (bookId) => {
        const currentUser = get().currentUser;
        if (!currentUser?.favorites) return;
        
        const favorites = [...currentUser.favorites];
        const index = favorites.indexOf(bookId);
        
        if (index > -1) {
          favorites.splice(index, 1);
        } else {
          favorites.push(bookId);
        }
        
        set({
          currentUser: {
            ...currentUser,
            favorites
          }
        });
      },

      toggleWishlist: (bookId) => {
        const currentUser = get().currentUser;
        if (!currentUser?.wishlist) return;
        
        const wishlist = [...currentUser.wishlist];
        const index = wishlist.indexOf(bookId);
        
        if (index > -1) {
          wishlist.splice(index, 1);
        } else {
          wishlist.push(bookId);
        }
        
        set({
          currentUser: {
            ...currentUser,
            wishlist
          }
        });
      },

      fetchUserTrades: async () => {
        if (!get().currentUser) return;

        set(state => ({ isLoading: { ...state.isLoading, trades: true } }));
        try {
          const { data } = await api.get<Trade[]>('/trades');
          set({ trades: data });
        } catch (error) {
          set({ error: 'Failed to fetch trades' });
        } finally {
          set(state => ({ isLoading: { ...state.isLoading, trades: false } }));
        }
      },

      proposeTrade: async (proposerBookId, receiverBookId, message) => {
        if (!get().currentUser) {
          set({ message: 'Please sign in to propose trades' });
          return;
        }

        try {
          const { data } = await api.post<Trade>('/trades', {
            bookOffered: proposerBookId,
            bookRequested: receiverBookId,
            message
          });

          set(state => ({
            trades: [...state.trades, data],
            message: 'Trade proposed successfully',
            notifications: [
              ...state.notifications,
              {
                id: crypto.randomUUID(),
                userId: typeof data.receiver === 'string' ? data.receiver : data.receiver._id,
                type: 'trade_proposal',
                message: `New trade proposal for your book`,
                createdAt: new Date().toISOString(),
                isRead: false,
                relatedId: data._id
              }
            ]
          }));
        } catch (error) {
          set({ error: 'Failed to propose trade' });
          throw error;
        }
      },

      updateTradeStatus: async (tradeId, status) => {
        try {
          const { data } = await api.put<Trade>(`/trades/${tradeId}`, { status });
          
          set(state => ({
            trades: state.trades.map(trade =>
              trade._id === tradeId ? data : trade
            ),
            message: `Trade ${status} successfully`,
            notifications: [
              ...state.notifications,
              {
                id: crypto.randomUUID(),
                userId: typeof data.initiator === 'string' ? data.initiator : data.initiator._id,
                type: status === 'accepted' ? 'trade_accepted' : 'trade_rejected',
                message: `Your trade proposal has been ${status}`,
                createdAt: new Date().toISOString(),
                isRead: false,
                relatedId: tradeId
              }
            ]
          }));
        } catch (error) {
          set({ error: 'Failed to update trade status' });
          throw error;
        }
      },

      signInWithGithub: async () => {
        set(state => ({ 
          isLoading: { ...state.isLoading, auth: true },
          error: null 
        }));
        
        try {
          const result = await signInWithPopup(auth, githubProvider);
          const githubUser = result.user;
          
          if (!githubUser || !githubUser.email) {
            throw new Error('Could not retrieve required information from GitHub account');
          }
          
          // Exchange Firebase token for our JWT
          const idToken = await githubUser.getIdToken();
          
          // Send comprehensive data to backend
          const { data } = await api.post<AuthResponse>('/auth/login', {
            token: idToken,
            email: githubUser.email,
            displayName: githubUser.displayName || githubUser.email.split('@')[0],
            photoURL: githubUser.photoURL,
            providerId: 'github.com'
          });
          
          // Store the JWT token
          localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
          setAuthToken(data.token);

          const user: User = {
            _id: data._id,
            username: data.username,
            email: data.email,
            fullName: data.fullName || githubUser.displayName || 'GitHub User',
            location: data.location || '',
            books: [],
            githubUsername: githubUser.providerData[0]?.displayName || githubUser.email.split('@')[0],
            githubPhotoUrl: githubUser.photoURL || '',
            favorites: data.favorites || [],
            wishlist: data.wishlist || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
          
          set(state => ({
            currentUser: user,
            isAuthenticated: true,
            isLoading: { ...state.isLoading, auth: false }
          }));
        } catch (error) {
          console.error('GitHub authentication error:', error);
          set(state => ({ 
            error: error instanceof Error ? error.message : 'Failed to sign in with GitHub',
            isLoading: { ...state.isLoading, auth: false }
          }));
          throw error;
        }
      },

      logout: async () => {
        set(state => ({ 
          isLoading: { ...state.isLoading, auth: true },
          error: null 
        }));
        
        try {
          await signOut(auth);
          setAuthToken(null);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          set(state => ({ 
            currentUser: null, 
            isAuthenticated: false,
            isLoading: { ...state.isLoading, auth: false }
          }));
        } catch (error) {
          set(state => ({ 
            error: 'Failed to sign out',
            isLoading: { ...state.isLoading, auth: false }
          }));
          console.error('Error signing out:', error);
        }
      },

      setAuthUser: (user) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
          isLoading: {
            ...get().isLoading,
            auth: false
          }
        });
      },

      addNotification: (notificationData) => set((state) => ({
        notifications: [...state.notifications, {
          ...notificationData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }]
      })),

      markNotificationAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      })),

      clearNotifications: () => set((state) => ({
        notifications: state.notifications.filter(notif => !notif.isRead)
      })),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      setMessage: (message) => {
        set({ message });
        if (message) {
          setTimeout(() => {
            set({ message: null });
          }, 3000);
        }
      },

      clearMessage: () => set({ message: null }),

      login: async (email: string, password: string) => {
        set(state => ({ isLoading: { ...state.isLoading, auth: true }, error: null }));
        try {
          const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
          
          // Store the JWT token
          localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
          setAuthToken(data.token);
          
          const user: User = {
            _id: data._id,
            username: data.username,
            email: data.email,
            fullName: data.fullName || '',
            location: data.location || '',
            books: [],
            favorites: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
          
          set(state => ({
            currentUser: user,
            isAuthenticated: true,
            isLoading: { ...state.isLoading, auth: false }
          }));
        } catch (error) {
          set(state => ({ 
            error: 'Invalid email or password',
            isLoading: { ...state.isLoading, auth: false }
          }));
          throw error;
        }
      },
      
      register: async (username: string, email: string, password: string) => {
        set(state => ({ isLoading: { ...state.isLoading, auth: true }, error: null }));
        try {
          const { data } = await api.post<AuthResponse>('/auth/register', { 
            username, 
            email, 
            password 
          });
          
          // Store the JWT token
          localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
          setAuthToken(data.token);
          
          const user: User = {
            _id: data._id,
            username: data.username,
            email: data.email,
            fullName: '',
            location: '',
            books: [],
            favorites: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
          
          set(state => ({
            currentUser: user,
            isAuthenticated: true,
            isLoading: { ...state.isLoading, auth: false }
          }));
        } catch (error) {
          set(state => ({ 
            error: 'Registration failed. Please try again.',
            isLoading: { ...state.isLoading, auth: false }
          }));
          throw error;
        }
      },
      
      checkAuthStatus: async () => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        
        if (!token) {
          set({ isAuthenticated: false, currentUser: null });
          return;
        }
        
        set(state => ({ isLoading: { ...state.isLoading, auth: true } }));
        
        try {
          // Verify token validity with the server
          await api.get('/auth/verify');
          
          // If token is valid, current user is already set
          set(state => ({ 
            isAuthenticated: !!state.currentUser,
            isLoading: { ...state.isLoading, auth: false }
          }));
        } catch (error) {
          // If token verification fails, clear auth data
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          
          set({ 
            isAuthenticated: false, 
            currentUser: null,
            isLoading: { 
              auth: false,
              books: false,
              trades: false
            }
          });
        }
      },
    }),
    {
      name: 'book-trading-storage',
      version: 1,
      partialize: (state) => ({
        books: state.books,
        filters: state.filters,
        notifications: state.notifications,
        trades: state.trades,
        currentUser: state.currentUser
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.currentUser;
          state.isLoading = {
            auth: false,
            books: false,
            trades: false
          };
          state.error = null;
        }
      }
    }
  )
);