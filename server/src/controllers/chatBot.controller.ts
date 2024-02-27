import { Request, Response } from 'express';
import OpenAI from 'openai';
import HistoryModel from '../models/ConversationHistory.mongo';
import asyncHandler from 'express-async-handler';
import {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  RateLimitError,
} from 'openai/error';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const addChatName = async (userMessage: string, botMessage: string) => {
  try {
    const titleStream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `make a very short and clear title about this chat from this message:${userMessage} and this message: ${botMessage} but don't mention about user and bot just summarize the whole conversation in one sentence and if possible in four words!`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of titleStream) {
      const botStream = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(botStream || '');
    }
    const chatName = (await titleStream.finalChatCompletion()).choices[0]
      .message.content;
    return chatName;
  } catch (error) {
    console.error(error);
  }
};

const newChat = asyncHandler(async (req: Request, res: Response) => {
  const { message }: { message: string; language: string } = req.body;

  console.log('message', message);
  if (!message) {
    res.status(400).json('Please enter a message');
    return;
  }

  try {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    });

    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `use expressive emojis also add a bit of some sarcastic tones when answering : ${message}`,
        },
      ],
      stream: true,
    });

    try {
      for await (const chunk of stream) {
        const { choices } = chunk;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          process.stdout.write(content || '');
          res.write(`data: ${JSON.stringify(content)}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
    } catch (streamError: any) {
      console.error('Stream error:', streamError);
      if (
        streamError.code === 'EAI_AGAIN' ||
        streamError.code === 'ECONNRESET' ||
        streamError.code === 'ETIMEDOUT' ||
        streamError.code === 'rate_limit_exceeded'
      ) {
        res.status(503).json({
          message: 'Service temporarily unavailable. Please try again later.',
        });
        return;
      }
      res.status(500).json({
        message: 'An error occurred while streaming chat completions.',
      });
      return;
    }

    const botMessage = (await stream.finalChatCompletion()).choices[0].message
      .content;

    if (botMessage) {
      const chatName = await addChatName(message, botMessage);

      // console.log('chatName from newChat', chatName);

      const newChat = new HistoryModel({
        chatName: chatName,
        history: [
          {
            sender: 'user',
            message: message,
          },
        ],
      });

      newChat.history.push({
        sender: 'bot',
        message: botMessage,
      });

      await newChat.save();
    }
    res.end();
  } catch (error) {
    console.error((error as Error).message);
    if (error instanceof APIConnectionError) {
      console.error('Connection error. Please try again later.');
      res.status(503).json({
        message: 'Service temporarily unavailable. Please try again later.',
      });
      return;
    }
    if (error instanceof APIConnectionTimeoutError) {
      console.error('Connection error. Please try again later.');
      res.status(503).json({
        message: 'Service temporarily unavailable. Please try again later.',
      });
      return;
    }
    if (error instanceof APIError) {
      console.error('Connection error. Please try again later.');
      res.status(503).json({
        message: 'Service temporarily unavailable. Please try again later.',
      });
      return;
    }
    if (error instanceof RateLimitError) {
      console.error('Rate limit exceeded. Please try again later.');
      res.status(429).json({
        message: 'Rate limit exceeded. Please try again later.',
      });
      return;
    }
    res.status(500).json({
      message: (error as Error).message,
    });
    return;
  }
});

const chatWithBot = asyncHandler(async (req: Request, res: Response) => {
  const { message, id }: { message: string; id: string } = req.body;

  console.log('message', message);

  if (!id) {
    res.status(400).json('Please enter an chat id');
    return;
  }
  if (!message) {
    res.status(400).json('Please enter a message');
    return;
  }

  const conversationHistory = await HistoryModel.findById(id);

  if (!conversationHistory) {
    res.status(404).json('Empty History!');
    return;
  }

  const history = conversationHistory.history.map((doc) => ({
    role: doc.sender,
    content: doc.message,
  }));

  history.push({
    role: 'user',
    content: message,
  });

  try {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    });
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: history.map((msg) => ({
        role: 'user',
        content: `use the following previous context and use expressive emojis also add a bit of some sarcastic tones when answering :  ${msg.role + msg.content}`,
      })),
      stream: true,
    });

    try {
      for await (const chunk of stream) {
        const { choices } = chunk;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          process.stdout.write(content || '');
          res.write(`data: ${JSON.stringify(content)}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
    } catch (streamError) {
      console.error('Stream error:', streamError);
      res.status(500).json({
        message: 'An error occurred while streaming chat completions.',
      });
      return;
    }

    const botMessage = (await stream.finalChatCompletion()).choices[0].message
      .content;

    if (botMessage) {
      conversationHistory.history.push({
        sender: 'user',
        message: message,
      });

      conversationHistory.history.push({
        sender: 'bot',
        message: botMessage,
      });

      await conversationHistory.save();
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
});

const getAllChatHistory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allChats = await HistoryModel.find();
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
});

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

export {
  chatWithBot,
  newChat,
  getAllChatHistory,
  getChatById,
  deleteChat,
  deleteMessage,
  chatgpt,
};
