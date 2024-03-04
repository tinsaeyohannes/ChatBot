import mongoose, { type ObjectId, type Schema } from 'mongoose';

export interface ConversationTurn {
  _id?: ObjectId;
  sender: string;
  message: string | null;
  translatedMessage?: string;
}

interface ConversationHistoryDocument extends Document {
  _id?: ObjectId;
  chatName: string;
  botName: string;
  history: ConversationTurn[];
}

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
