import type {ImageModelTypes} from '../types/ModelTypes';

export const ImageModels: ImageModelTypes[] = [
  {
    id: 1,
    name: 'DALL-E 2',
    modelType: 'txt2img',
    provider: 'openai',
    backgroundImage:
      'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F685021f3-6489-43db-a9cf-fa6717a40255_1280x720.png',
  },
  {
    id: 2,
    name: 'Fast Image',
    modelType: 'txt2img',
    provider: 'fal',
    backgroundImage:
      'https://fal-cdn.batuhan-941.workers.dev/files/rabbit/P322iQXlz2jOOuRFBWK-q.jpeg',
  },
  {
    id: 3,
    name: 'Stable Diffusion XL Lightning',
    modelType: 'txt2img',
    provider: 'fal',
    backgroundImage:
      'https://fal-cdn.batuhan-941.workers.dev/files/panda/jxu2YokPy8YB9crzOhsiM.jpeg',
  },
  {
    id: 4,
    name: 'Stable DiffusionXL',
    modelType: 'txt2img',
    provider: 'fal',
    backgroundImage:
      'https://blog.runpod.io/content/images/size/w2000/2023/07/FsHUsTaaIAAIAYa.jpg',
  },
  {
    id: 6,
    name: 'CCSRUpscaler',
    modelType: 'img2img',
    provider: 'fal',
    backgroundImage:
      'https://storage.googleapis.com/falserverless/gallery/blue-bird-upscale.png',
  },
  {
    id: 7,
    name: 'Face Retoucher',
    modelType: 'img2img',
    provider: 'fal',
    backgroundImage:
      'https://storage.googleapis.com/falserverless/model_tests/retoucher/Screenshot%20from%202024-02-13%2011-40-09.png',
  },
  {
    id: 8,
    name: 'Creative Upscaler',
    modelType: 'img2img',
    provider: 'fal',
    backgroundImage:
      'https://storage.googleapis.com/falserverless/gallery/owl_upscale.jpg',
  },
  {
    id: 9,
    name: 'Remove Background',
    modelType: 'img2img',
    provider: 'fal',
    backgroundImage:
      'https://static.clipdrop.co/web/apis/remove-background/social-remove-background.png',
  },
  {
    id: 10,
    name: 'Stable Cascade',
    modelType: 'txt2img',
    provider: 'fal',
    backgroundImage:
      'https://storage.googleapis.com/falserverless/gallery/stable-cascade.jpeg',
  },
  {
    id: 11,
    name: 'InstantID',
    modelType: 'img2img',
    provider: 'fal',
    backgroundImage:
      'https://storage.googleapis.com/falserverless/gallery/instantid.jpeg',
  },
];
