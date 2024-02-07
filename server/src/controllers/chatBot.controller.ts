import { Request, Response } from 'express';
import OpenAI from 'openai';

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    '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', // This is the default and can be omitted
});

const chatWithBot = async (req: Request, res: Response) => {
  const { message }: { message: string } = req.body;

  if (!message) {
    return res.status(400).json('Please enter a message');
  }

  try {
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      stream: true,
    });

    // stream.on('content', (delta, snapshot) => {
    //   process.stdout.write(delta);

    //   if (snapshot) {
    //     process.stdout.write(snapshot);
    //   }
    // });

    // or, equivalently:

    for await (const chunk of stream) {
      const botStream = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(botStream || '');
      res.write(botStream);
    }
    res.end();
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json('Internal Server Error!');
  }
};

export { chatWithBot };
