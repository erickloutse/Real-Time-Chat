import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const senderId = req.user.userId;

    const receiver = await User.findOne({ email });
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiver._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const request = new FriendRequest({
      sender: senderId,
      receiver: receiver._id
    });

    await request.save();

    const populatedRequest = await FriendRequest.findById(request._id)
      .populate('sender', 'username avatarUrl')
      .populate('receiver', 'username avatarUrl');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request', error: error.message });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await FriendRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate('sender', 'username avatarUrl')
      .populate('receiver', 'username avatarUrl');

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to friend request', error: error.message });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    })
      .populate('sender', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend requests', error: error.message });
  }
};