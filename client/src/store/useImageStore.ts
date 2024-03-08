import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BASE_URL, SERVER_API_KEY} from '@env';
import type {
  UseImageStoreActionsTypes,
  UseImageStoreStateTypes,
} from '../types/useImageStoreTypes';

export const useImageStore = create(
  persist<UseImageStoreStateTypes & UseImageStoreActionsTypes>(
    set => ({
      imagesHistory: [],
      currentChat: null,

      uploadImage: async (image, model, prompt) => {
        try {
          const response = await fetch(`${BASE_URL}/image/fal/createImage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },

            body: JSON.stringify({
              image: image,
              model: model,
              prompt: prompt,
            }),
          });

          const data = await response.json();
          set({imagesHistory: data});
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      },
      getAllImageHistories: async () => {
        try {
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: 'image-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
