export type UseImageStoreStateTypes = {
  imagesHistory: ImagesHistoryTypes[];
  currentChat: ImagesHistoryTypes | null;
  userMessage: string;
  currentModel: string;
};

export type UseImageStoreActionsTypes = {
  setUserMessage: (message: string) => void;
  generateImage: (
    model: string,
    prompt: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  uploadImage: (
    image: string,
    model: string,
    prompt: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  getAllImageHistories: () => Promise<void>;
};

export type UserResponse = {
  _id: string;
  sender: string;
  prompt?: string;
  generated_Image?: string;
  original_Image?: string;
  createdAt: Date;
};

// export type ModelResponse = {
//   _id: string;
//   sender: string;
//   generated_Image: string;
//   original_Image?: string;
//   prompt?: undefined;
//   createdAt: Date;
// };

export type ImagesHistoryTypes = {
  _id: string;
  chatName: string;
  modelName: string;
  modelType: string;
  provider: string;
  history: UserResponse[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
