import express, { Router } from 'express';
import {
  chatWithBot,
  deleteChat,
  getAllChatHistory,
  getChatById,
  newChat,
  deleteMessage,
} from '../controllers/chatBot.controller';
import { generateImages } from '../controllers/imageGenerator.controller';

const BotRouter: Router = express.Router();

BotRouter.post('/chatbot', chatWithBot)
  .post('/new', newChat)
  .post('/generateImg', generateImages)
  .get('/all', getAllChatHistory)
  .get('/:id', getChatById)
  .delete('/delete/:id', deleteChat)
  .delete('/delete/message/:id', deleteMessage);

export default BotRouter;
