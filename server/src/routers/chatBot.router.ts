import express, { Router } from 'express';
import {
  chatWithBot,
  getAllChatHistory,
  getChatById,
  newChat,
} from '../controllers/chatBot.controller';
import { generateImages } from '../controllers/imageGenerator.controller';

const BotRouter: Router = express.Router();

BotRouter.post('/chatbot', chatWithBot)
  .post('/new', newChat)
  .post('/generateImg', generateImages)
  .get('/all', getAllChatHistory)
  .get('/:id', getChatById);

export default BotRouter;
