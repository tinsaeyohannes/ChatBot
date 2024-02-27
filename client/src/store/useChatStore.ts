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
      userChat: [],

      newChat: async (userMessage, setMessages, setLoading, id) => {
        console.log();
        const {conversationHistory, userChat} = get();
        const index = conversationHistory.findIndex(chat => chat._id === id);

        setLoading(true);
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

        userChat.push({
          _id: userMessage._id,
          sender: userMessage.sender,
          message: userMessage.message,
        });

        if (index !== -1) {
          conversationHistory[index].history.push({
            _id: userMessage._id,
            sender: userMessage.sender,
            message: userMessage.message,
          });
        }

        let content = '';

        const messageListener = (event: MessageEvent) => {
          if (event.data && event.data !== '[DONE]') {
            const newWord = JSON.parse(event.data);
            content += newWord;

            setMessages((prev: string) => prev + newWord);

            if (index !== -1) {
              conversationHistory[index].history.push({
                _id: new Date().toString(),
                sender: 'bot',
                message: content,
              });
            }
          } else {
            userChat.push({
              _id: new Date().toString(),
              sender: 'bot',
              message: content,
            });
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
      continueChat: async (userMessage, setMessages, setLoading, id) => {
        if (!id) {
          return () => {
            console.log('id undefined');
          };
        }
        console.log('id', id);
        const {conversationHistory, userChat} = get();
        const index = conversationHistory.findIndex(chat => chat._id === id);

        setLoading(true);
        const eventSource: ExtendedEventSource = new EventSource(
          `${BASE_URL}/chatbot`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
              connection: 'keep-alive',
            },
            method: 'POST',
            body: JSON.stringify({
              id: id,
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

        userChat.push({
          _id: userMessage._id,
          sender: userMessage.sender,
          message: userMessage.message,
        });

        if (index !== -1) {
          conversationHistory[index].history.push({
            _id: userMessage._id,
            sender: userMessage.sender,
            message: userMessage.message,
          });
        }

        let content = '';

        const messageListener = (event: MessageEvent) => {
          if (event.data && event.data !== '[DONE]') {
            const newWord = JSON.parse(event.data);
            content += newWord;

            setMessages((prev: string) => prev + newWord);

            if (index !== -1) {
              conversationHistory[index].history.push({
                _id: new Date().toString(),
                sender: 'bot',
                message: content,
              });
            }
          } else {
            userChat.push({
              _id: new Date().toString(),
              sender: 'bot',
              message: content,
            });
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
