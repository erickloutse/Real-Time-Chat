import api from './api';

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  receiver: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const sendFriendRequest = async (email: string): Promise<FriendRequest> => {
  const response = await api.post('/friends/request', { email });
  return response.data;
};

export const respondToFriendRequest = async (
  requestId: string,
  status: 'accepted' | 'rejected'
): Promise<FriendRequest> => {
  const response = await api.put(`/friends/request/${requestId}`, { status });
  return response.data;
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await api.get('/friends/requests');
  return response.data;
};