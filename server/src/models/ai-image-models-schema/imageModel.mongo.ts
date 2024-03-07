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
