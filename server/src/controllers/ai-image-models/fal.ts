import type { Request, Response } from 'express';

const fal = async (req: Request, res: Response) => {
  const { image }: { prompt: string; image: string } = req.body;

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
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { fal };
