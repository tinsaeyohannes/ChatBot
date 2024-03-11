import type {ScrollView} from 'react-native';
import type {DropdownAlertData} from 'react-native-dropdownalert';

export type ChatStoreStateTypes = {
  conversationHistory: ChatHistoryTypes[];
  userMessage: string;
  userChat: ChatHistoryTypes;
  currentModel: string;
};

export type ChatStoreActionTypes = {
  setUserMessage: (message: string) => void;
  newChat: (
    userMessage: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    id: string,
    scrollRef: React.MutableRefObject<ScrollView | null>,
    alert: (_data: DropdownAlertData) => Promise<DropdownAlertData>,
  ) => Promise<void>;
  getChatHistory: (model: string) => Promise<void>;
  getChatById: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  emptyUserChat: () => void;
};

export type ChatConversationTypes = {
  _id?: string;
  sender: string;
  message: string;
  createdAt: string;
};

export type ChatHistoryTypes = {
  __v?: number;
  _id: string;
  chatName: string;
  botName: string;
  history: ChatConversationTypes[];
  createdAt?: Date;
  updatedAt?: Date;
};
