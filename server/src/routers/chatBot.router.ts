import express, { Router } from 'express';
import { chatWithBot } from '../controllers/chatBot.controller';

const BotRouter: Router = express.Router();

BotRouter.post('/chatbot', chatWithBot);
console.log('chatbot router loaded');
export default BotRouter;
