import express, { Router } from 'express';
import {
  newChatStream,
  newChat,
  continueChatStream,
  continueChat,
  deleteChat,
  getAllChatHistory,
  getChatById,
  deleteMessage,
} from '../controllers/chatBot.controller';
import { generateImages } from '../controllers/imageGenerator.controller';

const BotRouter: Router = express.Router();

BotRouter.post('/chat/continueChat', continueChat)
  .post('/chat/continueChatStream', continueChatStream)
  .post('/chat/newChat', newChat)
  .post('/chat/newChatStream', newChatStream)
  .post('/generateImg', generateImages)
  .get('/all', getAllChatHistory)
  .get('/chat/:id', getChatById)
  .delete('/delete/:id', deleteChat)
  .delete('/delete/message/:id', deleteMessage);

export default BotRouter;
