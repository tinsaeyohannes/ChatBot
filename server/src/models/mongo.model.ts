import mongoose, { type Schema } from 'mongoose';

const ChatSchema: Schema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
