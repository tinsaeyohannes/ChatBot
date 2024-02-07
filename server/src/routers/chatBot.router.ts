import express, { Router } from 'express';
import {
  chatWithBot,
  generateImages,
  newChat,
} from '../controllers/chatBot.controller';

const BotRouter: Router = express.Router();

BotRouter.post('/chatbot', chatWithBot)
  .post('/new', newChat)
  .post('/generateImg', generateImages);
console.log('chatbot router loaded');
export default BotRouter;
