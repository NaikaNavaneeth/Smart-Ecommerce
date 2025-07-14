import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;; // ⚠️ store securely in env file for production

if (!GROQ_API_KEY) {
  throw new Error('Missing Groq API Key. Set VITE_GROQ_API_KEY in .env');
}

export const fetchGroqResponse = async (message: string) => {
  const payload = {
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content:
          'You are a smart and friendly shopping assistant for an e-commerce platform. Suggest relevant product categories, price ranges, or items based on user queries like "I need sports shoes" or "show me something under ₹500".',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  };

  const headers = {
    Authorization: `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(GROQ_API_URL, payload, { headers });
  return response.data.choices[0].message.content.trim();
};
