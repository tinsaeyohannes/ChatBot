import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BASE_URL, SERVER_API_KEY} from '@env';
import type {
  ImagesHistoryTypes,
  Response,
  UseImageStoreActionsTypes,
  UseImageStoreStateTypes,
} from '../types/useImageStoreTypes';
import uuid from 'react-native-uuid';

export const useImageStore = create(
  persist<UseImageStoreStateTypes & UseImageStoreActionsTypes>(
    (set, get) => ({
      imagesHistory: [],
      currentChat: {
        _id: '',
        chatName: '',
        modelName: '',
        modelType: '',
        provider: '',
        history: [],
      },
      userMessage: '',
      modelProvider: '',
      setUserMessage: (message: string) => set({userMessage: message}),

      generateImage: async (model, prompt, setLoading) => {
        console.log('generateImage called');
        const {modelProvider, currentChat, imagesHistory} = get();

        if (!model) {
          console.log('model is undefined');
          return;
        }
        if (!modelProvider) {
          console.log('modelProvider is undefined');
          return;
        }
        if (!prompt) {
          console.log('prompt is undefined');
          return;
        }

        const updatedUserChat = {
          ...currentChat,
          history: [
            ...currentChat.history,
            {
              _id: uuid.v4().toString(),
              sender: 'user',
              prompt: prompt,
            },
          ] as Response[],
        } as ImagesHistoryTypes;

        set({currentChat: updatedUserChat});
        setLoading(true);
        let url = '';
        if (currentChat.history.length === 0) {
          url = `${BASE_URL}/image/${modelProvider}/createImage`;
        } else {
          url = `${BASE_URL}/image/${modelProvider}/continueCreateImage`;
        }
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },

            body: JSON.stringify({
              chatId: currentChat._id,
              model: model,
              prompt: prompt,
            }),
          });

          if (!response.ok) {
            console.log('error', response);
            throw new Error(response.statusText);
          }

          const data = await response.json();
          if (currentChat.history.length === 0) {
            set({imagesHistory: [data, ...imagesHistory], currentChat: data});
          } else {
            set({
              imagesHistory: [
                ...imagesHistory.slice(0, currentChat.history.length),
                data,
                ...imagesHistory.slice(currentChat.history.length + 1),
              ],
              currentChat: data,
            });
          }
          console.log('data generateImage', data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      },

      uploadImage: async (image, model, prompt, setLoading) => {
        console.log('uploadImage called');
        const {modelProvider, currentChat, imagesHistory} = get();
        if (!model) {
          console.log('model is undefined');
          return;
        }
        if (!modelProvider) {
          console.log('model is undefined');
          return;
        }

        const updatedUserChat = {
          ...currentChat,
          history: [
            ...currentChat.history,
            {
              _id: uuid.v4().toString(),
              sender: 'user',
              prompt: prompt,
            },
          ] as Response[],
        } as ImagesHistoryTypes;

        set({currentChat: updatedUserChat});
        setLoading(true);
        let url = '';
        if (currentChat.history.length === 0) {
          url = `${BASE_URL}/image/${modelProvider}/createImage`;
        } else {
          url = `${BASE_URL}/image/${modelProvider}/continueCreateImage`;
        }

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },

            body: JSON.stringify({
              chatId: currentChat._id,
              image: image,
              model: model,
              prompt: prompt,
            }),
          });

          const data = await response.json();
          if (currentChat.history.length === 0) {
            set({imagesHistory: [data, ...imagesHistory], currentChat: data});
          } else {
            set({
              imagesHistory: [
                ...imagesHistory.slice(0, currentChat.history.length),
                data,
                ...imagesHistory.slice(currentChat.history.length + 1),
              ],
              currentChat: data,
            });
          }
          console.log('data uploadImage', data);
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
