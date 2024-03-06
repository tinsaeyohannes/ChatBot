import { uploadPicture } from '../../services/imageUpload';
import type { Request, Response } from 'express';
import {
  UploadPictureResponse,
  type FalResponseTypes,
  type FalResponseTypes2,
} from '../../types/uploadPictureResponseTypes';
import * as falClient from '@fal-ai/serverless-client';
import { Models } from '../../constants/models';

falClient.config({
  credentials: process.env.FAL_API_KEY,
});

const negative_prompt = 'ugly, deformed';

const fal = async (req: Request, res: Response) => {
  const {
    image,
    prompt,
    model,
  }: { prompt: string; image: string; model: string } = req.body;
  if (!model) {
    res.status(400).json({
      error: 'Please specify model',
    });
    return;
  }
  console.log('model', model);

  try {
    const updatedImage = `data:image/png;base64,${image}`;

    for (const m of Models) {
      if (model === m.label && m.modelType === 'txt2img') {
        const falResponse: FalResponseTypes = await falClient.subscribe(
          m.modelName,
          {
            input: {
              prompt:
                '(masterpiece:1.4), (best quality), (detailed), ' + prompt,
              negative_prompt,
            },
          },
        );

        res.status(200).json({ image: falResponse.images[0].url });
        return;
      } else if (model === m.label && m.modelType === 'img2img') {
        const { secureUrl } = (await uploadPicture(
          updatedImage,
        )) as UploadPictureResponse;

        const falResponse: FalResponseTypes & FalResponseTypes2 =
          await falClient.subscribe(m.modelName, {
            input: {
              image_url: secureUrl,
              prompt: prompt,
            },
          });

        if (falResponse.images) {
          res.status(200).json({ image: falResponse.images[0].url });
        } else if (falResponse.image) {
          res.status(200).json({ image: falResponse.image.url });
        } else {
          res
            .status(500)
            .json({ error: 'No images returned from the AI model' });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export { fal };
