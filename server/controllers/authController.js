import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      email,
      password,
      username,
      avatarUrl: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    await User.findByIdAndUpdate(user._id, { lastSeen: new Date() });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, avatarUrl },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};