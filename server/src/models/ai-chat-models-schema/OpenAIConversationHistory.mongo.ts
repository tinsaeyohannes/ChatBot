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

const OpenAIHistorySchema: Schema = new mongoose.Schema(
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
        translatedMessage: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const OpenAIHistoryModel = mongoose.model<ConversationHistoryDocument>(
  'OpenAIChatHistory',
  OpenAIHistorySchema,
);

export default OpenAIHistoryModel;
