import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {StoreTypes} from '../types/useStoreTypes';

export const userStore = create(
  persist<StoreTypes>(
    set => ({
      isDarkMode: false,
      setIsDarkMode: boolean => set({isDarkMode: boolean}),
    }),
    {
      name: 'store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
