import express, { Router } from 'express';
import {
  deleteChat,
  getAllChatHistory,
  getChatById,
  deleteMessage,
} from '../controllers/chatBot.controller';

const BotRouter: Router = express.Router();

BotRouter.get('/all', getAllChatHistory)
  .get('/chat/:id', getChatById)
  .delete('/delete/:id', deleteChat)
  .delete('/delete/message/:id', deleteMessage);

export default BotRouter;
