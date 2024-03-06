export const Models = [
  {
    label: 'fastImage',
    modelName: 'fal-ai/fast-lcm-diffusion',
    modelType: 'txt2img',
    prompt: 'a_prompt',
    negative_prompt: 'n_prompt',
  },
  {
    label: 'removeBg',
    modelName: 'fal-ai/imageutils/rembg',
    modelType: 'img2img',
  },
  {
    label: 'stableDiffusionXL',
    modelName: 'fal-ai/fast-sdxl',
    modelType: 'txt2img',
  },
  {
    label: 'stableCascade',
    modelName: 'fal-ai/stable-cascade',
    modelType: 'txt2img',
  },
  {
    label: 'esrganUpscale',
    modelName: 'fal-ai/esrgan',
    modelType: 'img2img',
  },

  {
    label: 'supirUpscaler',
    modelName: 'fal-ai/supir',
    modelType: 'img2img',
  },
  {
    label: 'ccsrUpscaler',
    modelName: 'fal-ai/ccsr',
    modelType: 'img2img',
  },
  {
    label: 'faceRetoucher',
    modelName: 'fal-ai/retoucher',
    modelType: 'img2img',
  },
];
