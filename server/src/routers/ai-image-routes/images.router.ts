import { fal } from '../../controllers/ai-image-models/fal';
import { generateImages } from '../../controllers/ai-image-models/dall-e';
import express, { Router } from 'express';

const ImagesRouter: Router = express.Router();

ImagesRouter.post('/dalle/createImage', generateImages).post(
  '/fal/createImage',
  fal,
);

export default ImagesRouter;
