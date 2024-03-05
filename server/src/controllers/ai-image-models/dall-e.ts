import { Request, Response } from 'express';
import OpenAI from 'openai';
import fs from 'fs';
console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImages = async (req: Request, res: Response) => {
  const { prompt, image }: { prompt: string; image: string } = req.body;
  try {
    if (!image) {
      res.status(400).json({
        error: 'Please upload an image',
      });
      return;
    } else {
      console.log('image', image);

      res.status(200).json({
        message: 'image has successfully uploaded',
      });
      return;
    }
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${prompt}`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      style: 'vivid',
      quality: 'hd',
    });

    const imageData = response.data;
    res.status(200).json(imageData);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      message: 'Internal Server Error!',
    });
  }
};

export { generateImages };
