import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signUp: (userData: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    address: Omit<Address, 'id' | 'isDefault'>;
  }) => boolean;
  signOut: () => void;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  getDefaultAddress: () => Address | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      signIn: (email, password) => {
        // Mock authentication - in real app, this would call an API
        const mockUser: User = {
          id: 'user-' + Date.now(),
          fullName: 'Guest User',
          email,
          mobile: '1234567890',
          addresses: [],
        };

        set({
          user: mockUser,
          isAuthenticated: true,
        });
        return true;
      },

      signUp: (userData) => {
        const newAddress: Address = {
          id: 'addr-' + Date.now(),
          ...userData.address,
          isDefault: true,
        };

        const newUser: User = {
          id: 'user-' + Date.now(),
          fullName: userData.fullName,
          email: userData.email,
          mobile: userData.mobile,
          addresses: [newAddress],
        };

        set({
          user: newUser,
          isAuthenticated: true,
        });
        return true;
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      addAddress: (address) => {
        const user = get().user;
        if (!user) return;

        const newAddress: Address = {
          id: 'addr-' + Date.now(),
          ...address,
          isDefault: user.addresses.length === 0,
        };

        set({
          user: {
            ...user,
            addresses: [...user.addresses, newAddress],
          },
        });
      },

      updateAddress: (addressId, updatedFields) => {
        const user = get().user;
        if (!user) return;

        set({
          user: {
            ...user,
            addresses: user.addresses.map((addr) =>
              addr.id === addressId ? { ...addr, ...updatedFields } : addr
            ),
          },
        });
      },

      deleteAddress: (addressId) => {
        const user = get().user;
        if (!user) return;

        const addressToDelete = user.addresses.find((a) => a.id === addressId);
        const remainingAddresses = user.addresses.filter((a) => a.id !== addressId);

        // If deleted address was default and there are other addresses, make the first one default
        if (addressToDelete?.isDefault && remainingAddresses.length > 0) {
          remainingAddresses[0].isDefault = true;
        }

        set({
          user: {
            ...user,
            addresses: remainingAddresses,
          },
        });
      },

      setDefaultAddress: (addressId) => {
        const user = get().user;
        if (!user) return;

        set({
          user: {
            ...user,
            addresses: user.addresses.map((addr) => ({
              ...addr,
              isDefault: addr.id === addressId,
            })),
          },
        });
      },

      getDefaultAddress: () => {
        const user = get().user;
        if (!user) return null;
        return user.addresses.find((addr) => addr.isDefault) || user.addresses[0] || null;
      },
    }),
    {
      name: 'luxebed-auth-storage',
    }
  )
);
