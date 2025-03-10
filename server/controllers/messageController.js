import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type, fileUrl } = req.body;
    const senderId = req.user.userId;

    const message = new Message({
      conversationId,
      sender: senderId,
      content,
      type,
      fileUrl,
      readBy: [senderId]
    });

    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatarUrl')
      .populate('readBy', 'username');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate('sender', 'username avatarUrl')
      .populate('readBy', 'username')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    
    message.isFavorite = !message.isFavorite;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling favorite', error: error.message });
  }
};