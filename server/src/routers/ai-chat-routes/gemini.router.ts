import express, { Router } from 'express';
import {
  geminiContinueChat,
  geminiNewChat,
} from '../../controllers/ai-chat-models/gemini';

const GeminiRouter: Router = express.Router();

GeminiRouter.post('/chat/newChat', geminiNewChat).post(
  '/chat/continueChat',
  geminiContinueChat,
);

export default GeminiRouter;
