import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, SERVER_API_KEY} from '@env';

export const useImageStore = create(
  persist(
    (set, get) => ({
      image: '',

      uploadImage: async (image: string) => {
        try {
          const response = await fetch(`${BASE_URL}/image/dalle/createImage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },
            body: JSON.stringify({
              image,
            }),
          });

          const data = await response.json();
          console.log(data);
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
