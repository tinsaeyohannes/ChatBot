export type ChatStoreStateTypes = {
  history: string[];
};

export type ChatStoreActionTypes = {
  newChat: (text: string) => Promise<void>;
  continueChat: (text: string) => Promise<void>;
  getChatHistory: () => Promise<void>;
  getChatById: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
};
