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

import {DropdownAlertType} from 'react-native-dropdownalert';

console.log('SERVER_API_KEY', SERVER_API_KEY);
console.log('BASE_URL', BASE_URL);

axios.defaults.baseURL = BASE_URL;

export const useChatStore = create(
  persist<ChatStoreStateTypes & ChatStoreActionTypes>(
    (set, get) => ({
      conversationHistory: [],
      userMessage: '',
      setUserMessage: (message: string) => set({userMessage: message}),
      userChat: {
        _id: '',
        history: [],
        chatName: '',
        modelName: '',
        createdAt: new Date(),
      },
      currentModel: '',

      newChat: async (userMessage, setLoading, id, scrollRef, alert) => {
        const {conversationHistory, userChat, currentModel} = get();
        if (!currentModel) {
          await alert({
            type: DropdownAlertType.Info,
            title: 'INFO',
            message: 'Please select a model.',
          });
          return;
        }
        if (!userMessage) {
          await alert({
            type: DropdownAlertType.Info,
            title: 'INFO',
            message: 'Please enter a message.',
          });
          return;
        }

        scrollRef.current?.scrollToEnd({animated: true});

        const url =
          userChat.history.length === 0 ? 'chat/newChat' : 'chat/continueChat';

        try {
          const updatedUserChat = {
            ...userChat,
            history: [
              ...userChat.history,
              {
                _id: uuid.v4().toString(),
                sender: 'user',
                message: userMessage,
              },
            ] as ChatConversationTypes[],
          } as ChatHistoryTypes;

          set({userChat: updatedUserChat});

          setLoading(true);

          const response = await fetch(`${BASE_URL}/${currentModel}/${url}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SERVER_API_KEY}`,
              connection: 'keep-alive',
            },

            method: 'POST',
            body: JSON.stringify({
              chatId: id,
              prompt: userMessage,
            }),
          });

          if (response.status === 200) {
            const data: ChatHistoryTypes = await response.json();

            if (!data) {
              throw new Error('API response is undefined');
            }

            scrollRef.current?.scrollToEnd({animated: true});

            if (userChat?.history.length === 0) {
              set({
                conversationHistory: [data, ...conversationHistory],
                userChat: data,
              });
            } else {
              const chatIndex = conversationHistory.findIndex(
                chat => chat._id === id,
              );

              set({
                conversationHistory: [
                  ...conversationHistory.slice(0, chatIndex),
                  data,
                  ...conversationHistory.slice(chatIndex + 1),
                ],
                userChat: data,
              });
            }
          } else {
            setLoading(false);

            await alert({
              type: DropdownAlertType.Error,
              title: 'Error',
              message: 'Something went wrong. Please try again.',
            });
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(error);
          await alert({
            type: DropdownAlertType.Error,
            title: 'Error',
            message: 'Something went wrong.',
          });
        }
      },

      getChatHistory: async model => {
        console.log('getChatHistory called');
        try {
          const {data} = await axios({
            method: 'GET',
            url: `/all?model=${model}`,
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
      emptyUserChat: () => {
        set({
          userChat: {
            _id: '',
            modelName: '',
            history: [],
            chatName: '',
          },
        });
      },
    }),
    {
      name: 'chat',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
