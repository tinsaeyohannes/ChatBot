import mongoose, { type Schema } from 'mongoose';

export interface ConversationTurn {
  chatName: string;
  user: string;
  bot: string | null;
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
