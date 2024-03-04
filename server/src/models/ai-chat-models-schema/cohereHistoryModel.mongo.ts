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

const CohereHistorySchema: Schema = new mongoose.Schema(
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

const CohereHistoryModel = mongoose.model<ConversationHistoryDocument>(
  'CohereChatHistory',
  CohereHistorySchema,
);

export default CohereHistoryModel;
