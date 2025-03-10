import api from './api';

export interface Message {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  type: 'text' | 'file' | 'voice';
  fileUrl?: string;
  readBy: Array<{ id: string; username: string }>;
  isFavorite: boolean;
  createdAt: string;
}

export const sendMessage = async (
  conversationId: string,
  content: string,
  type: Message['type'] = 'text',
  fileUrl?: string
): Promise<Message> => {
  const response = await api.post('/messages', {
    conversationId,
    content,
    type,
    fileUrl,
  });
  return response.data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};

export const markAsRead = async (messageId: string): Promise<Message> => {
  const response = await api.put(`/messages/${messageId}/read`);
  return response.data;
};

export const toggleFavorite = async (messageId: string): Promise<Message> => {
  const response = await api.put(`/messages/${messageId}/favorite`);
  return response.data;
};