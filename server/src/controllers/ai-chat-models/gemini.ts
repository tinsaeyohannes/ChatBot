import { GoogleGenerativeAI } from '@google/generative-ai';

import { Request, Response } from 'express';
import HistoryModel from '../../models/ConversationHistory.mongo';

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
async function gemini(req: Request, res: Response) {
  const { prompt } = req.body;
  try {
    if (!prompt) {
      return res.json({
        error: 'no prompt',
      });
    }

    // For text-only input, use the gemini-pro model
    const model = genAIInit.getGenerativeModel({
      model: 'gemini-pro',
    });

    const geminiResult = await model.generateContent(prompt);

    if (geminiResult && geminiResult.response) {
      const geminiResultText = geminiResult.response;
      if (geminiResultText.candidates) {
        const botMessage = geminiResultText.candidates[0].content.parts[0].text;

        if (botMessage) {
          const chatName = await addChatName(prompt, botMessage);

          const newChat = new HistoryModel({
            chatName: chatName,
            botName: 'gemini',
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
    }
  } catch (err) {
    console.log('error in Gemini chat: ', err);
    res.status(500).json({
      message: (err as Error).message,
    });
  }
}

export { gemini };
