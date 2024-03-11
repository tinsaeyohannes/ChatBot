import type {TextModelTypes} from '../types/ModelTypes';

export const TextModel: TextModelTypes[] = [
  {
    id: 1,
    name: 'ChatGPT',
    modelType: 'GPT-3.5',
    endPoint: 'openai',
  },
  {
    id: 2,
    name: 'Gemini',
    modelType: 'Gemini Pro',
    endPoint: 'gemini',
  },
  {
    id: 3,
    name: 'Cohere',
    modelType: 'Cohere Web',
    endPoint: 'cohere',
  },
];
