import type { Request, Response } from 'express';
import ImageHistoryModel from '../models/ai-image-models-schema/imageModel.mongo';

const getAllImageHistories = async (req: Request, res: Response) => {
  const model = req.query.model;

  console.log('model', model);

  // if (!model) {
  //   res.status(400).json({
  //     message: 'Please enter a model',
  //   });
  //   return;
  // }

  try {
    const imageHistory = await ImageHistoryModel.find();

    if (!imageHistory) {
      res.status(404).json({
        error: 'History not found',
      });
      return;
    }

    console.log('imageHistory', imageHistory);

    res.status(200).json(imageHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};
export { getAllImageHistories };
