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
  history: ConversationTurn[];
}

const HistorySchema: Schema = new mongoose.Schema(
  {
    chatName: {
      type: String,
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

const HistoryModel = mongoose.model<ConversationHistoryDocument>(
  'ChatHistory',
  HistorySchema,
);

export default HistoryModel;
