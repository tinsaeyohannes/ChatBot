import express, { Express } from 'express';
import BotRouter from './routers/chatBot.router';
import morgan from 'morgan';
import apiKeyMiddleware from './middleware/ApiKeyMiddleWare';
import cors from 'cors';
import GeminiRouter from './routers/ai-chat-routes/gemini.router';
import OpenAIRouter from './routers/ai-chat-routes/openAI.router';
import CohereRouter from './routers/ai-chat-routes/cohere.router';
import ImagesRouter from './routers/ai-image-routes/images.router';

const app: Express = express();

app.use(cors());

app.use(morgan('tiny'));

app.use(express.json({ limit: '50mb' }));

// Apply API key authentication middleware to all routes
app.use(apiKeyMiddleware);

app.use('/api', BotRouter);
app.use('/api/openai', OpenAIRouter);
app.use('/api/gemini', GeminiRouter);
app.use('/api/cohere', CohereRouter);
app.use('/api/image', ImagesRouter);

export default app;
