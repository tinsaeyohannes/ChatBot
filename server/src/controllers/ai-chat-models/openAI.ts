import { Request, Response } from 'express';
import OpenAI from 'openai';
import asyncHandler from 'express-async-handler';

import {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  RateLimitError,
} from 'openai/error';
import OpenAIHistoryModel from '../../models/ai-chat-models-schema/openAIConversationHistory.mongo';

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

const openAiNewChat = asyncHandler(async (req: Request, res: Response) => {
  const { prompt }: { prompt: string } = req.body;

  console.log('prompt', prompt);
  if (!prompt) {
    res.status(400).json('Please enter a prompt');
    return;
  }

  try {
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `use expressive emojis also add a bit of some sarcastic tones when answering : ${prompt}`,
        },
      ],
      stream: true,
    });

    const botMessage = (await stream.finalChatCompletion()).choices[0].message
      .content;

    if (botMessage) {
      const chatName = await addChatName(prompt, botMessage);

      const newChat = new OpenAIHistoryModel({
        chatName: chatName,
        botName: 'ChatGPT',
        history: [
          {
            sender: 'user',
            message: prompt,
          },
        ],
      });

      newChat.history.push({
        sender: 'bot',
        message: botMessage,
      });

      const response = await newChat.save();

      res.status(200).json(response);
    }
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

const openAiContinueChat = asyncHandler(async (req: Request, res: Response) => {
  const { prompt, chatId }: { prompt: string; chatId: string } = req.body;

  console.log('prompt', prompt);
  console.log('chatId', chatId);

  if (!chatId) {
    res.status(400).json('Please enter an chatId');
    return;
  }
  if (!prompt) {
    res.status(400).json('Please enter a prompt');
    return;
  }

  const conversationHistory = await OpenAIHistoryModel.findById(chatId);

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
    content: prompt,
  });

  try {
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: history.map((msg) => ({
        role: 'user',
        content: `use the following previous context and use expressive emojis also add a bit of some sarcastic tones when answering. Don’t justify your answers. Don’t give information not mentioned in the CONTEXT INFORMATION:  ${msg.role + msg.content}`,
      })),
      stream: true,
    });

    const botMessage = (await stream.finalChatCompletion()).choices[0].message
      .content;

    if (botMessage) {
      conversationHistory.history.push({
        sender: 'user',
        message: prompt,
      });

      conversationHistory.history.push({
        sender: 'bot',
        message: botMessage,
      });

      const response = await conversationHistory.save();
      res.status(200).json(response);
      return;
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      message: (error as Error).message,
    });
    return;
  }
});

export { openAiNewChat, openAiContinueChat };
