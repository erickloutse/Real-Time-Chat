import api from './api';
import { Message } from './messages';

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    username: string;
    avatarUrl: string;
    lastSeen: string;
  }>;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/conversations');
  return response.data;
};

export const createConversation = async (participantId: string): Promise<Conversation> => {
  const response = await api.post('/conversations', { participantId });
  return response.data;
};

export const getUnreadCount = async (): Promise<Array<{ conversationId: string; count: number }>> => {
  const response = await api.get('/conversations/unread');
  return response.data;
};