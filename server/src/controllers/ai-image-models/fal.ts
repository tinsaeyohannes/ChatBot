import { uploadPicture } from '../../services/imageUpload';
import type { Request, Response } from 'express';
import {
  UploadPictureResponse,
  type FalResponseTypes,
  type FalResponseTypes2,
} from '../../types/uploadPictureResponseTypes';
import * as falClient from '@fal-ai/serverless-client';
import { Models } from '../../constants/models';
import ImageHistoryModel from '../../models/ai-image-models-schema/imageModel.mongo';

falClient.config({
  credentials: process.env.FAL_API_KEY,
});

const negative_prompt = 'ugly, deformed';

const generateWithFal = async (req: Request, res: Response) => {
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

        const newChat = new ImageHistoryModel({
          chatName: prompt,
          modelName: m.label,
          provider: 'fal',
          modelType: m.modelType,
          history: [
            {
              sender: 'user',
              prompt: prompt,
            },
          ],
        });

        newChat.history.push({
          createdAt: new Date(),
          sender: 'model',
          generated_Image: falResponse.images[0].url,
        });

        const response = await newChat.save();
        console.log('response', response);
        res.status(200).json(response);
        return;
      } else if (model === m.label && m.modelType === 'img2img') {
        const { secureUrl } = (await uploadPicture(
          updatedImage,
        )) as UploadPictureResponse;

        let falResponse: FalResponseTypes & FalResponseTypes2;
        if (m.imgUrlInput === 'face_image_url') {
          falResponse = await falClient.subscribe(m.modelName, {
            input: {
              face_image_url: secureUrl,
              prompt: prompt,
            },
          });
        } else {
          falResponse = await falClient.subscribe(m.modelName, {
            input: {
              image_url: secureUrl,
              prompt: prompt,
            },
          });
        }

        const newChat = new ImageHistoryModel({
          chatName: prompt,
          modelName: m.label,
          provider: 'fal',
          modelType: m.modelType,
          history: [
            {
              sender: 'user',
              prompt: prompt,
            },
          ],
        });

        if (falResponse.images) {
          newChat.history.push({
            sender: 'model',
            generated_Image: falResponse.images[0].url,
            original_Image: secureUrl,
            createdAt: new Date(),
          });

          const response = await newChat.save();
          console.log('response', response);

          res.status(200).json(response);
          return;
        } else if (falResponse.image) {
          newChat.history.push({
            sender: 'model',
            generated_Image: falResponse.image.url,
            original_Image: secureUrl,
            createdAt: new Date(),
          });

          const response = await newChat.save();
          console.log('response', response);

          res.status(200).json(response);
          return;
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

const continueWithFal = async (req: Request, res: Response) => {
  const {
    chatId,
    image,
    prompt,
    model,
  }: {
    chatId: string;
    prompt: string;
    image: string;
    model: string;
  } = req.body;

  if (!model) {
    res.status(400).json({
      error: 'Please specify model',
    });
    return;
  }

  console.log('model', model);
  console.log('prompt', prompt);
  console.log('chatId', chatId);
  if (!image) {
    console.log('image not uploaded1');
  }
  let statusCode = 500;

  try {
    const chat = await ImageHistoryModel.findById(chatId);

    if (!chat) {
      statusCode = 404;
      throw new Error('Chat not found');
    }

    const updatedImage = `data:image/png;base64,${image}`;

    for (const m of Models) {
      if (model === m.label && m.modelType === 'txt2img') {
        if (prompt) {
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

          chat.history.push({
            sender: 'user',
            prompt: prompt,
            createdAt: new Date(),
          });

          chat.history.push({
            sender: 'model',
            generated_Image: falResponse.images[0].url,
            createdAt: new Date(),
          });

          const response = await chat.save();
          console.log('response', response);

          res.status(200).json(response);
          return;
        } else {
          statusCode = 400;
          throw new Error('Please enter a prompt');
        }
      } else if (model === m.label && m.modelType === 'img2img') {
        const { secureUrl } = (await uploadPicture(
          updatedImage,
        )) as UploadPictureResponse;

        const falResponse: FalResponseTypes & FalResponseTypes2 =
          await falClient.subscribe(m.modelName, {
            input: {
              image_url: secureUrl,
              prompt: prompt || 'No Prompt',
            },
          });

        chat.history.push({
          sender: 'user',
          prompt: prompt,
          createdAt: new Date(),
        });

        if (falResponse.images) {
          console.log('images', falResponse.images);
          chat.history.push({
            sender: 'model',
            generated_Image: falResponse.images[0].url,
            original_Image: secureUrl,
            createdAt: new Date(),
          });

          const response = await chat.save();
          res.status(200).json(response);
          return;
        } else if (falResponse.image) {
          console.log('image', image);

          chat.history.push({
            sender: 'model',
            generated_Image: falResponse.image.url,
            original_Image: secureUrl,
            createdAt: new Date(),
          });

          const response = await chat.save();
          res.status(200).json(response);
          return;
        } else {
          statusCode = 500;
          throw new Error('No images returned from the AI model');
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(statusCode).json({ error: (error as Error).message });
  }
};

export { generateWithFal, continueWithFal };
