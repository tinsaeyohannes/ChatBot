import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BASE_URL, SERVER_API_KEY} from '@env';
import type {
  ImagesHistoryTypes,
  UseImageStoreActionsTypes,
  UseImageStoreStateTypes,
} from '../types/useImageStoreTypes';

export const useImageStore = create(
  persist<UseImageStoreStateTypes & UseImageStoreActionsTypes>(
    (set, get) => ({
      imagesHistory: [],
      currentChat: null,
      userMessage: '',
      currentModel: '',
      setUserMessage: (message: string) => set({userMessage: message}),

      generateImage: async (model, prompt, setLoading) => {
        const {currentModel} = get();

        if (!currentModel) {
          console.log('model is undefined');
          return;
        }
        setLoading(true);

        try {
          const response = await fetch(
            `${BASE_URL}/image/${currentModel}/createImage`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SERVER_API_KEY}`,
              },

              body: JSON.stringify({
                model: model,
                prompt: prompt,
              }),
            },
          );

          const data = await response.json();
          set({imagesHistory: data});
          console.log(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      },
      uploadImage: async (image, model, prompt, setLoading) => {
        const {currentModel} = get();

        if (!currentModel) {
          console.log('model is undefined');
          return;
        }
        setLoading(true);
        try {
          const response = await fetch(
            `${BASE_URL}/image/${currentModel}/createImage`,
            {
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
            },
          );

          const data = await response.json();
          set({imagesHistory: data});
          console.log(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      },
      getAllImageHistories: async () => {
        try {
          const response = await fetch(`${BASE_URL}/image/getImagesHistory`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },
          });

          const data = await response.json();

          set({imagesHistory: data as ImagesHistoryTypes[]});
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
