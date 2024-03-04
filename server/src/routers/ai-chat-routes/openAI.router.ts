import {
  openAiContinueChat,
  openAiNewChat,
} from '../../controllers/ai-chat-models/openAI';
import express, { Router } from 'express';

const OpenAIRouter: Router = express.Router();

OpenAIRouter.post('/chat/newChat', openAiNewChat).post(
  '/chat/continueChat',
  openAiContinueChat,
);

export default OpenAIRouter;
