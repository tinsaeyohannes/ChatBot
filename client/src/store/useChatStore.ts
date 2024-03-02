import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {
  ChatConversationTypes,
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
import {DropdownAlertType} from 'react-native-dropdownalert';

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
      userChat: {
        _id: '',
        history: [],
        chatName: '',
      },

      newChat: async (userMessage, setLoading, id, scrollRef, alert) => {
        console.log('newChat called');
        const {conversationHistory, userChat} = get();
        if (!userMessage) {
          await alert({
            type: DropdownAlertType.Info,
            title: 'INFO',
            message: 'Please enter a message.',
          });
          return;
        }
        console.log('userMessage', userMessage);
        scrollRef.current?.scrollToEnd({animated: true});

        const url =
          userChat.history.length === 0 ? 'chat/newChat' : 'chat/continueChat';

        try {
          const newHistory = [
            ...userChat.history,
            {
              _id: uuid.v4().toString(),
              sender: 'user',
              message: userMessage,
            },
          ] as ChatConversationTypes[];

          const updatedUserChat = {
            ...userChat,
            history: newHistory,
          } as ChatHistoryTypes;

          set({userChat: updatedUserChat});

          console.log('userChat added', userChat);
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
              message: userMessage,
            }),
          });

          if (response.status === 200) {
            const data: ChatHistoryTypes = await response.json();

            if (!data) {
              throw new Error('API response is undefined');
            }

            scrollRef.current?.scrollToEnd({animated: true});

            if (userChat?.history.length === 0) {
              // conversationHistory.unshift(data);
              set({
                conversationHistory: [data, ...conversationHistory],
                userChat: data,
              });
            } else {
              set({
                userChat: data,
              });
            }
          } else {
            set({
              userChat: {
                ...userChat,
                history: [],
              },
            });
          }
          setLoading(false);
        } catch (error) {
          console.error(error);
          await alert({
            type: DropdownAlertType.Error,
            title: 'Error',
            message: 'Something went wrong.',
          });
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
