import { Request, Response } from 'express';
import ImageHistoryModel from '../../models/ai-image-models-schema/imageModel.mongo';
import OpenAI from 'openai';
console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImage = async (req: Request, res: Response) => {
  const { prompt }: { prompt: string } = req.body;
  try {
    if (!prompt) {
      res.status(400).json({
        error: 'Please enter a prompt',
      });
      return;
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
        modelName: 'dalle',
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
      });

      const response = await newChat.save();

      res.status(200).json(response);
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      message: 'Internal Server Error!',
    });
  }
};
const continueToGenerateImages = async (req: Request, res: Response) => {
  const { chatId, prompt }: { chatId: string; prompt: string } = req.body;
  try {
    if (!chatId) {
      res.status(400).json({
        error: 'Chat ID Required!',
      });
      return;
    }
    if (!prompt) {
      res.status(400).json({
        error: 'Please enter a prompt',
      });
      return;
    }
    const chat = await ImageHistoryModel.findById(chatId);
    if (!chat) {
      res.status(404).json({
        error: 'Chat not found',
      });
      return;
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
      });

      chat.history.push({
        sender: 'model',
        generated_Image: imageData,
      });

      const response = await chat.save();

      res.status(200).json(response);
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      message: 'Internal Server Error!',
    });
  }
};

export { generateImage, continueToGenerateImages };
