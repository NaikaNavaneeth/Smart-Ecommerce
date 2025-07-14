import { useState } from 'react';
import { ChatMessage } from '../types/message';
import { fetchGroqResponse } from '../services/groqClient';

export const useGenAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      content: "Hi! I'm your AI shopping assistant. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userInput: string) => {
    const userMessage: ChatMessage = {
      sender: 'user',
      content: userInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiContent = await fetchGroqResponse(userInput);

      const aiMessage: ChatMessage = {
        sender: 'ai',
        content: aiContent,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Groq error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          content: 'Sorry, something went wrong. Try again later.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};
