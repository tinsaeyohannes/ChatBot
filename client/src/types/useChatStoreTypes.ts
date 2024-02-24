export type ChatStoreStateTypes = {
  conversationHistory: ChatHistoryTypes[];
};

export type ChatStoreActionTypes = {
  newChat: (
    userMessage: {sender: string; message: string},
    id?: string,
  ) => Promise<void>;
  continueChat: (text: string) => Promise<void>;
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
