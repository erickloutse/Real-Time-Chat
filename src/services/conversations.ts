import api from "./api";
import { Message } from "./messages";

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
  try {
    const response = await api.get("/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const createConversation = async (
  participantId: string
): Promise<Conversation> => {
  try {
    const response = await api.post("/conversations", { participantId });
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const getUnreadCount = async (): Promise<
  Array<{ conversationId: string; count: number }>
> => {
  try {
    const response = await api.get("/conversations/unread");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    throw error;
  }
};
