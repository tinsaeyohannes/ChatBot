import type {ScrollView} from 'react-native';

export type UseImageStoreStateTypes = {
  imagesHistory: ImagesHistoryTypes[];
  currentChat: ImagesHistoryTypes;
  userMessage: string;
  modelProvider: string;
  model: string;
};

export type UseImageStoreActionsTypes = {
  setUserMessage: (message: string) => void;
  generateImage: (
    prompt: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    scrollRef: React.MutableRefObject<ScrollView | null>,
  ) => Promise<void>;
  uploadImage: (
    image: string,
    prompt: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    scrollRef: React.MutableRefObject<ScrollView | null>,
  ) => Promise<void>;
  getAllImageHistories: () => Promise<void>;
};

export type Response = {
  _id: string;
  sender: string;
  prompt?: string;
  generated_Image?: string;
  original_Image?: string;
  createdAt: Date;
};

export type ImagesHistoryTypes = {
  _id: string;
  chatName: string;
  modelName: string;
  modelType: string;
  provider: string;
  history: Response[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
