export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  sender: MessageSender;
  content: string;
  timestamp: number;
}
