import mongoose, { type Schema } from 'mongoose';
import type { ConversationHistoryDocument } from 'types/mongo.schema.types';

const CohereHistorySchema: Schema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    modelName: {
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
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const CohereHistoryModel = mongoose.model<ConversationHistoryDocument>(
  'CohereChatHistory',
  CohereHistorySchema,
);

export default CohereHistoryModel;
