import type { Request, Response } from 'express';
import ImageHistoryModel from '../models/ai-image-models-schema/imageModel.mongo';

const getAllImageHistories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const imageHistory = await ImageHistoryModel.find().skip(skip).limit(limit);

    if (!imageHistory) {
      res.status(404).json({
        error: 'History not found',
      });
      return;
    }

    res.status(200).json(imageHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};
export { getAllImageHistories };
