import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username avatarUrl lastSeen')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.userId;

    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({
      participants: [userId, participantId]
    });

    await conversation.save();

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'username avatarUrl lastSeen');

    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation', error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await Conversation.find({ participants: userId });
    
    const unreadCounts = await Promise.all(
      conversations.map(async (conv) => {
        const count = await Message.countDocuments({
          conversationId: conv._id,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        });
        return { conversationId: conv._id, count };
      })
    );

    res.json(unreadCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread counts', error: error.message });
  }
};