import mongoose, { type Schema } from 'mongoose';
import type { ImagesHistory } from 'types/mongo.schema.types';

const ImageHistorySchema: Schema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    modelName: {
      type: String,
      required: true,
    },
    modelType: {
      type: String,
    },
    provider: {
      type: String,
    },
    history: [
      {
        sender: {
          type: String,
          required: true,
        },
        prompt: {
          type: String || null,
        },
        original_Image: {
          type: String,
        },
        generated_Image: {
          type: String,
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

const ImageHistoryModel = mongoose.model<ImagesHistory>(
  'ImageHistory',
  ImageHistorySchema,
);

export default ImageHistoryModel;
