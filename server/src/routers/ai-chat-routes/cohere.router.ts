import {
  cohereContinueChat,
  cohereNewChat,
} from '../../controllers/ai-chat-models/cohere';
import express, { Router } from 'express';

const CohereRouter: Router = express.Router();

CohereRouter.post('/chat/newChat', cohereNewChat).post(
  '/chat/continueChat',
  cohereContinueChat,
);

export default CohereRouter;
