export type ImageModelTypes = {
  id: number;
  name: string;
  modelType: string;
};
export const ImageModels: ImageModelTypes[] = [
  {
    id: 1,
    name: 'DALL-E',
    modelType: 'txt2img',
  },
  {
    id: 2,
    name: 'Fast Image',
    modelType: 'txt2img',
  },
  {
    id: 3,
    name: 'Stable Diffusion XL Lightning',
    modelType: 'txt2img',
  },
  {
    id: 4,
    name: 'Stable DiffusionXL',
    modelType: 'txt2img',
  },
  {
    id: 5,
    name: 'Esrgan Upscale',
    modelType: 'img2img',
  },
  {
    id: 6,
    name: 'CCSRUpscaler',
    modelType: 'img2img',
  },
  {
    id: 7,
    name: 'Face Retoucher',
    modelType: 'img2img',
  },
  {
    id: 8,
    name: 'Creative Upscaler',
    modelType: 'img2img',
  },
  {
    id: 9,
    name: 'Remove Background',
    modelType: 'img2img',
  },
  {
    id: 10,
    name: 'Stable Cascade',
    modelType: 'txt2img',
  },
  {
    id: 11,
    name: 'Supir Upscaler',
    modelType: 'img2img',
  },
];
