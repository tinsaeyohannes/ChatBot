import mongoose, { type Schema } from 'mongoose';
import type { ConversationHistoryDocument } from 'types/mongo.schema.types';

const GeminiHistorySchema: Schema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    botName: {
      type: String,
      required: true,
    },
    history: [
      {
        sender: {
          type: String,
          required: true,
        },
        message: {
          type: String || null,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const GeminiHistoryModel = mongoose.model<ConversationHistoryDocument>(
  'GeminiChatHistory',
  GeminiHistorySchema,
);

export default GeminiHistoryModel;
