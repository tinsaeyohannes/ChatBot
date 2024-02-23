import { Request, Response } from 'express';
import OpenAI from 'openai';
import HistoryModel from '../models/ConversationHistory.mongo';
import { translate } from '@vitalets/google-translate-api';

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
    console.log('chatName from addChatName', chatName);
    return chatName;
  } catch (error) {
    console.error(error);
  }
};

const newChat = async (req: Request, res: Response) => {
  const { message }: { message: string } = req.body;
  if (!message) {
    return res.status(400).json('Please enter a message');
  }

  try {
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

    for await (const chunk of stream) {
      const botStream = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(botStream || '');
    }
    const botMessage = (await stream.finalChatCompletion()).choices[0].message
      .content;

    if (botMessage) {
      const chatName = await addChatName(message, botMessage);

      console.log('chatName from newChat', chatName);

      const newChat = new HistoryModel({
        history: [
          {
            chatName: chatName,
            user: message,
            bot: botMessage,
          },
        ],
      });
      await newChat.save();

      const { text } = await translate(botMessage, { to: 'am' });

      res.status(200).json({
        chatName: chatName,
        user: message,
        message: text,
      });
    }
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json('Internal Server Error!');
  }
};

const chatWithBot = async (req: Request, res: Response) => {
  const { message, id }: { message: string; id: string } = req.body;

  if (!id) {
    return res.status(400).json('Please enter an chat id');
  }
  if (!message) {
    return res.status(400).json('Please enter a message');
  }
  const conversationHistory = await HistoryModel.findById(id);

  if (!conversationHistory) {
    return res.status(404).json('Empty History!');
  }

  const history = conversationHistory.history.map((doc) => ({
    role: doc.user,
    content: doc.bot,
  }));

  history.push({
    role: 'user',
    content: message,
  });

  try {
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: history.map((msg) => ({
        role: 'user',
        content: `use the following previous context and use expressive emojis also add a bit of some sarcastic tones when answering :  ${msg.role + msg.content}`,
      })),
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const botStream = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(botStream || '');
    }
    const botMessage = (await stream.finalChatCompletion()).choices[0].message
      .content;

    conversationHistory.history.push({
      chatName: conversationHistory.history[0].chatName,
      user: message,
      bot: botMessage,
    });

    await conversationHistory.save();
    res.status(200).json({
      chatName: conversationHistory.history[0].chatName,
      user: message,
      message: botMessage,
    });
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json('Internal Server Error!');
  }
};

const getAllChatHistory = async (req: Request, res: Response) => {
  try {
    const allChats = await HistoryModel.find();
    if (!allChats) {
      return res.status(404).json({
        message: 'No chats found',
      });
    } else {
      res.status(200).json(allChats);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('id', id);
  try {
    const chat = await HistoryModel.findById(id);

    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found',
      });
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      res.status(400).json({ error: 'Please enter an chat id' });
    }
    const chat = await HistoryModel.findByIdAndDelete(id);

    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found',
      });
    } else {
      res.status(200).json({
        message: 'Chat deleted successfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { chatWithBot, newChat, getAllChatHistory, getChatById, deleteChat };
