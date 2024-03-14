import { GoogleGenerativeAI } from '@google/generative-ai';

import { Request, Response } from 'express';
import GeminiHistoryModel from '../../models/ai-chat-models-schema/geminiHistoryModel.mongo';

const genAIInit = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

const addChatName = async (userMessage: string, botMessage: string) => {
  try {
    const model = genAIInit.getGenerativeModel({
      model: 'gemini-pro',
    });

    const geminiResult = await model.generateContent(
      `make a very short and clear title about this chat from this message:${userMessage} and this message: ${botMessage} but don't mention about user and bot just summarize the whole conversation in one sentence and if possible in four words!`,
    );
    if (geminiResult && geminiResult.response) {
      const geminiResultText = geminiResult.response;
      if (geminiResultText.candidates) {
        const chatName = geminiResultText.candidates[0].content.parts[0].text;
        return chatName;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
async function geminiNewChat(req: Request, res: Response) {
  const { prompt } = req.body;
  try {
    if (!prompt) {
      return res.json({
        error: 'no prompt',
      });
    }

    const model = genAIInit.getGenerativeModel({
      model: 'gemini-pro',
    });

    const geminiResult = await model.generateContent(prompt);

    if (geminiResult && geminiResult.response) {
      const geminiResultText = geminiResult.response;

      const botMessage = geminiResultText.text();

      if (botMessage) {
        const chatName = await addChatName(prompt, botMessage);

        const newChat = new GeminiHistoryModel({
          chatName: chatName,
          modelName: 'Gemini',
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
    }
  } catch (err) {
    console.log('error in Gemini chat: ', err);
    res.status(500).json({
      message: (err as Error).message,
    });
  }
}
async function geminiContinueChat(req: Request, res: Response) {
  const { prompt, chatId } = req.body;
  try {
    if (!prompt) {
      return res.json({
        error: 'no prompt',
      });
    }

    const model = genAIInit.getGenerativeModel({
      model: 'gemini-pro',
    });

    const conversationHistory = await GeminiHistoryModel.findById(chatId);

    if (!conversationHistory) {
      res.status(404).json('Empty History!');
      return;
    }

    const chatHistory = conversationHistory?.history.map((doc) => ({
      role: doc.sender === 'user' ? 'user' : 'model',
      parts: Array.isArray(doc.message) ? doc.message : [doc.message || ''],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(prompt);

    console.log('result', result.response.text());
    const history = await chat.getHistory();
    console.log('history', history);
    history.forEach((item) => console.log(item));

    const botMessage = result.response.text();

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
    }
  } catch (err) {
    console.log('error in Gemini chat: ', err);
    res.status(500).json({
      message: (err as Error).message,
    });
  }
}

export { geminiNewChat, geminiContinueChat };
