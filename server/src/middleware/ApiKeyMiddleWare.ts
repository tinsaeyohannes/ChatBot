import type { Request, Response, NextFunction } from 'express';

// API key authentication middleware
const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string | undefined;

  // Check if Authorization header is provided
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  // Split the Authorization header to get the API key and format should be "Bearer <API_KEY>"
  const [bearer, apiKey] = authHeader.split(' ');

  // Check if API key is provided
  if (!apiKey || bearer.toLowerCase() !== 'bearer') {
    return res
      .status(401)
      .json({ error: 'Invalid Authorization header format' });
  }

  // Check if API key is valid
  const validApiKey = process.env.CHATBOT_API_KEY; // Get API key from environment variable
  if (apiKey !== validApiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // API key is valid, allow request to proceed
  next();
};

export default apiKeyMiddleware;
