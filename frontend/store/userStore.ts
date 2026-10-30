import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}

interface UserStore {
  profile: UserProfile | null;
  token: string | null;
  isLoggedIn: boolean;
  isProfileModalOpen: boolean;
  isAuthModalOpen: boolean;
  setProfile: (profile: UserProfile) => void;
  setToken: (token: string | null) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
  /** Called after successful login/signup — stores JWT token and profile */
  login: (profile: UserProfile, token?: string) => void;
  /** Clears token, profile, and auth state — signs out */
  logout: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      token: null,
      isLoggedIn: false,
      isProfileModalOpen: false,
      isAuthModalOpen: false,

      setProfile: (profile) => set({ profile }),

      setToken: (token) => set({ token }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...partial } : (partial as UserProfile),
        })),

      clearProfile: () => set({ profile: null, token: null, isLoggedIn: false }),

      login: (profile, token) => set({
        profile,
        token: token || null,
        isLoggedIn: true,
      }),

      logout: () => set({ profile: null, token: null, isLoggedIn: false }),

      openProfileModal: () => set({ isProfileModalOpen: true }),
      closeProfileModal: () => set({ isProfileModalOpen: false }),

      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: 'tb-luxury-user-store',
    }
  )
);
