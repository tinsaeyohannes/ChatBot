import express, { Router } from 'express';
import {
  deleteChat,
  getAllChatHistory,
} from '../controllers/chatBot.controller';

const BotRouter: Router = express.Router();

BotRouter.get('/all', getAllChatHistory)

  .delete('/delete/:id', deleteChat);

export default BotRouter;
