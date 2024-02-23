import mongoose, { type ObjectId, type Schema } from 'mongoose';

export interface ConversationTurn {
  _id?: ObjectId;
  chatName: string;
  user: string;
  bot: string | null;
  translatedMessage?: string;
}

interface ConversationHistoryDocument extends Document {
  history: ConversationTurn[];
}

const HistorySchema: Schema = new mongoose.Schema(
  {
    history: [
      {
        chatName: {
          type: String,
        },
        user: {
          type: String,
          required: true,
        },
        bot: {
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
