import type { Request, Response } from 'express';
import { CohereClient, type Cohere } from 'cohere-ai';
import CohereHistoryModel from '../../models/ai-chat-models-schema/cohereHistoryModel.mongo';
import OpenAI from 'openai';

const cohereApiKey = process.env.COHERE_API_KEY;

if (!cohereApiKey) {
  throw new Error('COHERE_API_KEY is not set in the environment variables.');
}

const cohere = new CohereClient({
  token: cohereApiKey,
});
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
const cohereNewChat = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({
      error: 'no prompt',
    });
    return;
  }
  try {
    const cohereResponse = await cohere.generate({
      prompt: `respond to this prompt in a very short and clear way don't write verbosely make it conservative and here is the prompt:${prompt}`,
      maxTokens: 1000,
      temperature: 0.5,
    });

    const cohereMessage = cohereResponse.generations[0].text;

    const chatName = await addChatName(prompt, cohereMessage);
    const newChat = new CohereHistoryModel({
      chatName: chatName,
      modelName: 'Cohere',
      history: [
        {
          sender: 'user',
          message: prompt,
        },
      ],
    });

    newChat.history.push({
      sender: 'bot',
      message: cohereMessage,
    });
    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};
const cohereContinueChat = async (req: Request, res: Response) => {
  const { prompt, chatId } = req.body;
  if (!prompt) {
    res.status(400).json({
      error: 'no prompt',
    });
    return;
  }

  if (!chatId) {
    res.status(400).json({
      error: 'no chat id',
    });
    return;
  }
  const conversationalHistory = await CohereHistoryModel.findById(chatId);

  if (!conversationalHistory) {
    res.status(404).json({
      error: 'No chat found',
    });
    return;
  }

  const history = conversationalHistory.history.map((doc) => ({
    role:
      doc.sender === 'user'
        ? ('USER' as Cohere.ChatMessageRole)
        : ('CHATBOT' as Cohere.ChatMessageRole),
    message: doc.message!,
  }));

  try {
    const chat = await cohere.chat({
      chatHistory: history,
      message: `respond to this prompt in a very short and clear way don't write verbosely make it conservative and here is the prompt:${prompt}`,
      maxTokens: 1000,
      temperature: 0.5,
      connectors: [{ id: 'web-search', continueOnFailure: true }],
    });

    const botMessage = chat.text;

    conversationalHistory?.history.push({
      sender: 'user',
      message: prompt,
    });

    conversationalHistory?.history.push({
      sender: 'bot',
      message: botMessage,
    });

    const response = await conversationalHistory?.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

export { cohereNewChat, cohereContinueChat };
