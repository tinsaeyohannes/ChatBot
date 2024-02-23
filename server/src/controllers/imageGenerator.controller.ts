import { Request, Response } from 'express';
import OpenAI from 'openai';

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImages = async (req: Request, res: Response) => {
  const { prompt }: { prompt: string } = req.body;
  try {
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