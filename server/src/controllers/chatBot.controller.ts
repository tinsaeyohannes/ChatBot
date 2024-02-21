import { Request, Response } from 'express';
import OpenAI from 'openai';
import HistoryModel from '../models/ConversationHistory.mongo';

console.log(process.env.OPENAI_API_KEY);

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
          content: `make a very short and clear title about this chat from this message:${userMessage} and this message: ${botMessage} but don't mention about user and bot just summarize the whole conversation in one sentence`,
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

      res.status(200).json({
        chatName: chatName,
        user: message,
        message: botMessage,
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

const generateImages = async (req: Request, res: Response) => {
  const { prompt }: { prompt: string } = req.body;
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${prompt}`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      style: 'vivid',
      quality: 'hd',
    });

    const imageData = response.data;
    res.status(200).json(imageData);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      message: 'Internal Server Error!',
    });
  }
};

export { chatWithBot, newChat, generateImages };
