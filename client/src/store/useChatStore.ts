import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {
  ChatHistoryTypes,
  ChatStoreActionTypes,
  ChatStoreStateTypes,
} from '../types/useChatStoreTypes';
import axios from 'axios';
import {SERVER_API_KEY, BASE_URL} from '@env';
import uuid from 'react-native-uuid';
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
      userChat: null,

      newChat: async (userMessage, setLoading, id, scrollRef) => {
        const {conversationHistory, userChat} = get();

        scrollRef.current?.scrollToEnd({animated: true});

        const url = userChat === null ? 'chat/newChat' : 'chat/continueChat';
        try {
          userChat?.history.push({
            _id: new Date().toString(),
            sender: 'user',
            message: userMessage.message,
          });

          setLoading(true);
          console.log('url', url);

          const response = await fetch(`${BASE_URL}/${url}`, {
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
          });

          const data: ChatHistoryTypes = await response.json();

          console.log('history returned', [...data.history]);

          console.log('history', data.history);
          console.log(data);

          if (!data) {
            throw new Error('API response is undefined');
          }

          scrollRef.current?.scrollToEnd({animated: true});

          if (userChat?.history.length === 0) {
            conversationHistory.unshift(data);
            set({
              conversationHistory: [...conversationHistory, data],
              userChat: data,
            });
          } else {
            set({
              userChat: data,
            });
          }

          setLoading(false);
        } catch (error) {
          console.error(error);
        }
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

        userChat &&
          userChat.history.push({
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
          } else {
            userChat &&
              userChat.history.push({
                _id: uuid.v4().toString(),
                sender: 'bot',
                message: content,
              });

            if (index !== -1) {
              conversationHistory[index].history.push({
                _id: new Date().toString(),
                sender: 'bot',
                message: content,
              });
            }
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
