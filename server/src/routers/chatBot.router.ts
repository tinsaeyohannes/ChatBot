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
  .delete('/delete/message/:id', deleteMessage)
  .get('/stream', (req, res) => {
    console.log('Streaming...');
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    });

    // Example of sending a message every second
    let count = 0;
    const interval = setInterval(() => {
      res.write(`data: ${count++}\n\n`);
      console.log(count);
      if (count > 7) {
        clearInterval(interval);
        console.log('Done!');
        res.write('data: [DONE]\n\n');
      }
    }, 1000);
  });

export default BotRouter;
