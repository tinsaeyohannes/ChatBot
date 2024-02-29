import type {ScrollView} from 'react-native';

export type ChatStoreStateTypes = {
  conversationHistory: ChatHistoryTypes[];
  userChat: ChatHistoryTypes | null;
};

export type ChatStoreActionTypes = {
  newChat: (
    userMessage: ChatConversationTypes,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    id: string,
    scrollRef: React.MutableRefObject<ScrollView | null>,
  ) => Promise<void>;
  continueChat: (
    userMessage: ChatConversationTypes,
    setMessages: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    id: string,
  ) => Promise<() => void>;
  getChatHistory: () => Promise<void>;
  getChatById: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
};

export type ChatConversationTypes = {
  _id?: string;
  sender: string;
  message: string;
  translatedMessage?: string;
};

export type ChatHistoryTypes = {
  __v: number;
  _id: string;
  chatName: string;
  history: ChatConversationTypes[];
  createdAt: Date;
  updatedAt: Date;
};
