export const Models = [
  {
    label: 'Stable Diffusion XL Lightning',
    modelName: 'fal-ai/fast-lightning-sdxl',
    modelType: 'txt2img',
    prompt: 'a_prompt',
    negative_prompt: 'n_prompt',
  },
  {
    label: 'Fast Image',
    modelName: 'fal-ai/fast-lcm-diffusion',
    modelType: 'txt2img',
    prompt: 'a_prompt',
    negative_prompt: 'n_prompt',
  },
  {
    label: 'Remove Background',
    modelName: 'fal-ai/imageutils/rembg',
    modelType: 'img2img',
    imgUrlInput: 'image_url',
  },
  {
    label: 'Stable DiffusionXL',
    modelName: 'fal-ai/fast-sdxl',
    modelType: 'txt2img',
  },
  {
    label: 'Stable Cascade',
    modelName: 'fal-ai/stable-cascade',
    modelType: 'txt2img',
  },
  {
    label: 'InstantID',
    modelName: 'fal-ai/instantid/lcm',
    modelType: 'img2img',
    imgUrlInput: 'face_image_url',
  },
  {
    label: 'CCSRUpscaler',
    modelName: 'fal-ai/ccsr',
    modelType: 'img2img',
    imgUrlInput: 'image_url',
  },
  {
    label: 'Face Retoucher',
    modelName: 'fal-ai/retoucher',
    modelType: 'img2img',
    imgUrlInput: 'image_url',
  },
  {
    label: 'Creative Upscaler',
    modelName: 'fal-ai/creative-upscaler',
    modelType: 'img2img',
    imgUrlInput: 'image_url',
  },
];
