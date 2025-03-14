import api from "./api";

export interface Call {
  id: string;
  caller: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  receiver: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  type: "audio" | "video";
  status: "missed" | "completed";
  startedAt: string;
  endedAt?: string;
  duration?: number;
}

export const createCall = async (
  receiverId: string,
  type: Call["type"]
): Promise<Call> => {
  try {
    const response = await api.post("/calls", { receiverId, type });
    return response.data;
  } catch (error) {
    console.error("Error creating call:", error);
    throw error;
  }
};

export const updateCallStatus = async (
  callId: string,
  status: Call["status"],
  duration?: number
): Promise<Call> => {
  try {
    const response = await api.put(`/calls/${callId}`, { status, duration });
    return response.data;
  } catch (error) {
    console.error("Error updating call status:", error);
    throw error;
  }
};

export const getCallHistory = async (): Promise<Call[]> => {
  try {
    const response = await api.get("/calls/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching call history:", error);
    throw error;
  }
};
