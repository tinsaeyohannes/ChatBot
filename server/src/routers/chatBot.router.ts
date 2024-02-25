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
  .get('/chat/:id', getChatById)
  .delete('/delete/:id', deleteChat)
  .delete('/delete/message/:id', deleteMessage)
  .get('/stream', (req, res) => {
    console.log('Streaming...');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Example of sending a message every second
    let count = 0;
    const interval = setInterval(() => {
      res.write(`data: ${count++}\n\n`);
      if (count > 5) {
        clearInterval(interval);
        res.write('data: [DONE]\n\n');
        res.end();
      }
    }, 1000);
  });

export default BotRouter;
