import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthService } from '@/services/auth';
import { AuthState, LoginRequest, RegisterRequest } from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true });

          const response = await AuthService.login(credentials);

          if (response.success && response.token && response.user) {
            AuthService.saveAuthData(response);

            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true, message: response.message };
          } else {
            set({ isLoading: false });
            return { success: false, message: response.message || '登录失败' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, message: error.message || '登录失败，请稍后重试' };
        }
      },

      register: async (userData: RegisterRequest) => {
        try {
          set({ isLoading: true });

          const response = await AuthService.register(userData);

          if (response.success && response.token && response.user) {
            AuthService.saveAuthData(response);

            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true, message: response.message };
          } else {
            set({ isLoading: false });
            return { success: false, message: response.message || '注册失败' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, message: error.message || '注册失败，请稍后重试' };
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initializeAuth: () => {
        const { token, user } = AuthService.loadAuthData();

        if (token && user) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);