import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {
  ChatStoreActionTypes,
  ChatStoreStateTypes,
} from '../types/useChatStoreTypes';
import axios from 'axios';
import {SERVER_API_KEY, BASE_URL} from '@env';

console.log('SERVER_API_KEY', SERVER_API_KEY);
console.log('BASE_URL', BASE_URL);

axios.defaults.baseURL = 'http://localhost:3000/api';

export const useChatStore = create(
  persist<ChatStoreStateTypes & ChatStoreActionTypes>(
    (set, get) => ({
      history: [],

      newChat: async text => {
        try {
          const response = await axios({
            method: 'POST',
            url: '/new',
            data: {
              message: text,
            },
            headers: {
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },
            responseType: 'stream',
          });

          response.data.on('data', (chunk: Buffer) => {
            const botStream = chunk;
            process.stdout.write(botStream);
            console.log('botStream', botStream.toString());
          });

          response.data.on('end', () => {
            console.log('Stream ended');
          });
          console.log('text', text);
        } catch (error) {
          console.error(error);
        }
      },
      continueChat: async text => {
        try {
          console.log('text', text);
        } catch (error) {
          console.error(error);
        }
      },
      getChatHistory: async () => {
        console.log('getChatHistory called');
        try {
          // const {data} = await axios({
          //   method: 'GET',
          //   url: '/all',
          //   headers: {
          //     Accept: 'application/json',
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${SERVER_API_KEY}`,
          //   },
          // });

          // console.log('data', data);

          // set({
          //   history: data,
          // });

          const response = await fetch(`${BASE_URL}/all`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },
          });

          const data = await response.json();
          console.log('data', data);
        } catch (error) {
          console.error(error);
        }
      },
      getChatById: async id => {
        try {
          console.log('id', id);
        } catch (error) {
          console.error(error);
        }
      },
      deleteChat: async id => {
        try {
          console.log('id', id);
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: 'chat',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
