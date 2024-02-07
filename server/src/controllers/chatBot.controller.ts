import { Request, Response } from 'express';
import OpenAI from 'openai';
import HistoryModel from '../models/ConversationHistory.mongo';

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    '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', // This is the default and can be omitted
});

const newChat = async (req: Request, res: Response) => {
  const { message }: { message: string } = req.body;

  if (!message) {
    return res.status(400).json('Please enter a message');
  }

  try {
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const botStream = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(botStream || '');
    }

    const newChat = new HistoryModel({
      history: [
        {
          chatName: '',
          user: message,
          bot: (await stream.finalChatCompletion()).choices[0].message.content,
        },
      ],
    });

    await newChat.save();

    res
      .status(200)
      .json((await stream.finalChatCompletion()).choices[0].message.content);
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
    content: message as string,
  });

  try {
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: history.map((msg) => ({
        role: 'user',
        content: msg.role + msg.content,
      })),
      stream: true,
    });

    for await (const chunk of stream) {
      const botStream = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(botStream || '');
    }

    conversationHistory.history.push({
      chatName: '',
      user: message,
      bot: (await stream.finalChatCompletion()).choices[0].message.content,
    });

    await conversationHistory.save();
    res
      .status(200)
      .json((await stream.finalChatCompletion()).choices[0].message);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json('Internal Server Error!');
  }
};

export { chatWithBot, newChat };
