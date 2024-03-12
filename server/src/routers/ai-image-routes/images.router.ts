import {
  continueWithFal,
  generateWithFal,
} from '../../controllers/ai-image-models/fal';
import {
  continueToGenerateImages,
  generateImage,
} from '../../controllers/ai-image-models/dall-e';
import express, { Router } from 'express';
import { getAllImageHistories } from '../../controllers/images.controller';

const ImagesRouter: Router = express.Router();

ImagesRouter.post('/dalle/createImage', generateImage)
  .post('/dalle/continueCreateImage', continueToGenerateImages)
  .post('/fal/createImage', generateWithFal)
  .post('/fal/continueCreateImage', continueWithFal)
  .get('/getImagesHistory', getAllImageHistories);

export default ImagesRouter;
