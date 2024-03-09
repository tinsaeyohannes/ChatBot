import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import OpenAiHistoryModel from '../models/ai-chat-models-schema/openAIConversationHistory.mongo';
import type { ConversationHistoryDocument } from 'types/mongo.schema.types';
import GeminiHistoryModel from '../models/ai-chat-models-schema/geminiHistoryModel.mongo';

const getAllChatHistory = async (req: Request, res: Response) => {
  const model = req.query.model;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  console.log('model', model);

  if (!model) {
    res.status(400).json({
      message: 'Please enter a model',
    });
    return;
  }

  try {
    let allChats: ConversationHistoryDocument[] = [];

    if (model === 'openai') {
      allChats = await OpenAiHistoryModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order
    } else if (model === 'gemini') {
      allChats = await GeminiHistoryModel.find().sort({ createdAt: -1 });
    }

    if (!allChats) {
      res.status(404).json({
        message: 'No chats found',
      });
      return;
    } else {
      res.status(200).json(allChats);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};

const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { id, model } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: 'Please enter an chat id' });
      return;
    }

    let chat: any = {};
    if (model === 'openai') {
      chat = await OpenAiHistoryModel.findById(id);
    } else if (model === 'gemini') {
      chat = await GeminiHistoryModel.findById(id);
    }

    if (!chat) {
      res.status(404).json({
        message: 'Chat not found',
      });
      return;
    } else {
      res.status(200).json({
        message: 'Chat deleted successfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
});

export { getAllChatHistory, deleteChat };
