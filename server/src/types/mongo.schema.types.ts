import type { ObjectId } from 'mongoose';

export interface ConversationTurn {
  _id?: ObjectId;
  sender: string;
  message: string | null;
  translatedMessage?: string;
}

export interface ConversationHistoryDocument extends Document {
  _id?: ObjectId;
  chatName: string;
  botName: string;
  history: ConversationTurn[];
}
