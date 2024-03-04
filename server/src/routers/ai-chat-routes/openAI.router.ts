import express, { Router } from 'express';
import {
  openAiContinueChat,
  openAiNewChat,
} from '../../controllers/ai-chat-models/openAi';

const OpenAIRouter: Router = express.Router();

OpenAIRouter.post('/chat/newChat', openAiNewChat).post(
  '/chat/continueChat',
  openAiContinueChat,
);

export default OpenAIRouter;
