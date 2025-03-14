import api from "./api";

export interface Message {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  type: "text" | "file" | "voice";
  fileUrl?: string;
  readBy: Array<{ id: string; username: string }>;
  isFavorite: boolean;
  createdAt: string;
}

export const sendMessage = async (
  conversationId: string,
  content: string,
  type: Message["type"] = "text",
  fileUrl?: string
): Promise<Message> => {
  try {
    const response = await api.post("/messages", {
      conversationId,
      content,
      type,
      fileUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessages = async (
  conversationId: string
): Promise<Message[]> => {
  try {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const markAsRead = async (messageId: string): Promise<Message> => {
  try {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

export const toggleFavorite = async (messageId: string): Promise<Message> => {
  try {
    const response = await api.put(`/messages/${messageId}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};
