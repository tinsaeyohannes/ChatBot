import { Request, Response } from 'express';
import ImageHistoryModel from '../../models/ai-image-models-schema/imageModel.mongo';
import OpenAI from 'openai';
console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImage = async (req: Request, res: Response) => {
  const { prompt }: { prompt: string } = req.body;
  let statusCode = 500;
  try {
    if (!prompt) {
      statusCode = 400;
      throw new Error('Please enter a prompt');
    }
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${prompt}`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      style: 'vivid',
      quality: 'hd',
    });

    const imageData = response.data[0].url;
    console.log('imageData', imageData);
    if (imageData) {
      const newChat = new ImageHistoryModel({
        chatName: prompt,
        modelName: 'DALL-E',
        provider: 'openai',
        modelType: 'txt2img',
        history: [
          {
            sender: 'user',
            prompt: prompt,
          },
        ],
      });

      newChat.history.push({
        sender: 'model',
        generated_Image: imageData,
        createdAt: new Date(),
      });

      const response = await newChat.save();

      res.status(200).json(response);
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(statusCode).json({
      error: (error as Error).message,
    });
  }
};
const continueToGenerateImages = async (req: Request, res: Response) => {
  const { chatId, prompt }: { chatId: string; prompt: string } = req.body;
  let statusCode = 500;
  try {
    if (!chatId) {
      statusCode = 400;
      throw new Error('Chat ID Required!');
    }
    if (!prompt) {
      res.status(400).json({
        error: 'Please enter a prompt',
      });
      return;
    }
    const chat = await ImageHistoryModel.findById(chatId);
    if (!chat) {
      statusCode = 404;
      throw new Error('Chat not found');
    }
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${prompt}`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      style: 'vivid',
      quality: 'hd',
    });

    const imageData = response.data[0].url;

    console.log('imageData', imageData);

    if (imageData) {
      chat.history.push({
        sender: 'user',
        prompt: prompt,
        createdAt: new Date(),
      });

      chat.history.push({
        sender: 'model',
        generated_Image: imageData,
        createdAt: new Date(),
      });

      const response = await chat.save();

      res.status(200).json(response);
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(statusCode).json({
      error: (error as Error).message,
    });
  }
};

export { generateImage, continueToGenerateImages };
