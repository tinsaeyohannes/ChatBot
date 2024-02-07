import express, { Router } from 'express';
import { chatWithBot, newChat } from '../controllers/chatBot.controller';

const BotRouter: Router = express.Router();

BotRouter.post('/chatbot', chatWithBot).post('/new', newChat);
console.log('chatbot router loaded');
export default BotRouter;
