import mongoose from 'mongoose';
const mongoUri = process.env.MONGO_URI;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.off('error', (error) => {
  console.error(error);
});

mongoose.connection.on('close', () => {
  console.log('MongoDB connection closed');
});

console.log('mongoUri', mongoUri);
export const connectMongo = async () => {
  try {
    await mongoose.connect(mongoUri as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
  }
};
