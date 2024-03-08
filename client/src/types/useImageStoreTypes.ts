export type UseImageStoreStateTypes = {
  imagesHistory: [];
};

export type UseImageStoreActionsTypes = {
  uploadImage: (image: string, model: string, prompt: string) => Promise<void>;
  getAllImageHistories: () => Promise<void>;
};

export type UserResponse = {
  sender: string;
  prompt: string;
  _id: string;
};

export type ModelResponse = {
  sender: string;
  generated_Image: string;
  _id: string;
  prompt?: undefined;
};

export type data = {
  _id: string;
  chatName: string;
  modelName: string;
  history: UserResponse[] | ModelResponse[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
