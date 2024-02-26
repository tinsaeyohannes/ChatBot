import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {
  ChatStoreActionTypes,
  ChatStoreStateTypes,
} from '../types/useChatStoreTypes';
import axios from 'axios';
import {SERVER_API_KEY, BASE_URL} from '@env';
import EventSource, {
  type CloseEvent,
  type ErrorEvent,
  type ExceptionEvent,
  type MessageEvent,
  type OpenEvent,
  type TimeoutEvent,
} from 'react-native-sse';

interface ExtendedEventSource extends EventSource {
  onmessage?: (event: MessageEvent) => void;
  onopen?: (event: OpenEvent) => void;
  onclose?: (event: CloseEvent) => void;
  ontimeout?: (event: TimeoutEvent) => void;
  onerror?: (error: Event) => void;
}
console.log('SERVER_API_KEY', SERVER_API_KEY);
console.log('BASE_URL', BASE_URL);

axios.defaults.baseURL = BASE_URL;

export const useChatStore = create(
  persist<ChatStoreStateTypes & ChatStoreActionTypes>(
    (set, get) => ({
      conversationHistory: [],

      newChat: async (userMessage, setMessages, setLoading) => {
        setLoading(true);

        let newContent = '';
        const eventSource: ExtendedEventSource = new EventSource(
          `${BASE_URL}/new`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
              connection: 'keep-alive',
            },
            method: 'POST',
            body: JSON.stringify({
              message: userMessage.message,
            }),
            pollingInterval: 25000,
          },
        );

        const openListener = (event: OpenEvent) => {
          if (event.type === 'open') {
            console.log('Open SSE connection.');
            setLoading(false);
          } else {
            console.log('error while opening SSE connection.');
          }
        };

        const messageListener = (event: MessageEvent) => {
          if (event.data && event.data !== '[DONE]') {
            const newWord = JSON.parse(event.data);
            newContent = newContent + newWord;
            // console.log(newContent);
            setMessages((prev: string) => prev + newWord);
          } else {
            setLoading(false);
            eventSource.close();
          }
        };

        const errorListener = (
          event: ErrorEvent | TimeoutEvent | ExceptionEvent,
        ) => {
          if ('data' in event) {
            console.error('Connection error:', event.data);
          } else if (event.type === 'error') {
            console.error('Connection error:', event.message);
          }
          setLoading(false);
          eventSource.close();
        };

        eventSource.addEventListener('open', openListener);
        eventSource.addEventListener('message', messageListener);
        eventSource.addEventListener('error', errorListener);

        return () => {
          eventSource.removeAllEventListeners();
          eventSource.close();
        };
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
          const {data} = await axios({
            method: 'GET',
            url: '/all',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
            },
          });

          set({
            conversationHistory:
              data as ChatStoreStateTypes['conversationHistory'],
          });

          // const response = await fetch(`${BASE_URL}/all`, {
          //   method: 'GET',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${SERVER_API_KEY}`,
          //   },
          // });

          // const data = await response.json();
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
