import dotenv from 'dotenv';
dotenv.config();

import * as http from 'http';
import app from './app';
import { connectMongo } from './services/mongo';

const server = http.createServer(app);
const Port = process.env.PORT;

console.log(`port: ${Port}`);
console.log(`MONGO_URL: ${process.env.MONGO_URL}`);

const startServer = async () => {
  try {
    await connectMongo();
    server.listen(Port, () => {
      console.log(`Server listening at http://localhost:${Port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
