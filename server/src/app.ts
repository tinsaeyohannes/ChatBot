import express, { Express } from 'express';
import BotRouter from './routers/chatBot.router';
import morgan from 'morgan';
import apiKeyMiddleware from './middleware/ApiKeyMiddleWare';
import cors from 'cors';

const app: Express = express();

app.use(cors());

app.use(morgan('tiny'));

app.use(express.json());

// Apply API key authentication middleware to all routes
app.use(apiKeyMiddleware);

app.use('/api', BotRouter);

export default app;
