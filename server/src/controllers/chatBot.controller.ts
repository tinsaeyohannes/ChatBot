import { Request, Response } from 'express';
import HistoryModel from '../models/ai-chat-models-schema/OpenAIConversationHistory.mongo';
import asyncHandler from 'express-async-handler';
import OpenAiHistoryModel from '../models/ai-chat-models-schema/OpenAIConversationHistory.mongo';
import GeminiHistoryModel from '../models/ai-chat-models-schema/GeminiHistoryModel.mongo';
import type { ConversationHistoryDocument } from 'models/ai-chat-models-schema/cohereHistoryModel.mongo';

const getAllChatHistory = async (req: Request, res: Response) => {
  const model = req.query.model;

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
      allChats = await OpenAiHistoryModel.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
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

const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: 'Please enter an chat id',
    });
    return;
  }
  console.log('id', id);
  try {
    const chat = await HistoryModel.findById(id);

    if (!chat) {
      res.status(404).json({
        message: 'Chat not found',
      });
      return;
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
});

const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: 'Please enter an chat id' });
      return;
    }

    const chat = await HistoryModel.findByIdAndDelete(id);

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
const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: 'Please enter message id' });
      return;
    }

    const chat = await HistoryModel.findById(id);

    if (!chat) {
      res.status(404).json({
        message: 'Chat not found',
      });
      return;
    }

    const index = chat.history.findIndex(
      (chat) => chat?._id!.toString() === id,
    );

    chat.history[index].sender = '';

    await chat.save();

    res.status(200).json({
      message: 'message deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
});

export { getAllChatHistory, getChatById, deleteChat, deleteMessage };
