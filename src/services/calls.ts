import api from './api';

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
  type: 'audio' | 'video';
  status: 'missed' | 'completed';
  startedAt: string;
  endedAt?: string;
  duration?: number;
}

export const createCall = async (receiverId: string, type: Call['type']): Promise<Call> => {
  const response = await api.post('/calls', { receiverId, type });
  return response.data;
};

export const updateCallStatus = async (
  callId: string,
  status: Call['status'],
  duration?: number
): Promise<Call> => {
  const response = await api.put(`/calls/${callId}`, { status, duration });
  return response.data;
};

export const getCallHistory = async (): Promise<Call[]> => {
  const response = await api.get('/calls/history');
  return response.data;
};