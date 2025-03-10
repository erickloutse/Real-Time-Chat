import Call from '../models/Call.js';

export const createCall = async (req, res) => {
  try {
    const { receiverId, type } = req.body;
    const callerId = req.user.userId;

    const call = new Call({
      caller: callerId,
      receiver: receiverId,
      type,
      status: 'missed',
      startedAt: new Date()
    });

    await call.save();

    const populatedCall = await Call.findById(call._id)
      .populate('caller', 'username avatarUrl')
      .populate('receiver', 'username avatarUrl');

    res.status(201).json(populatedCall);
  } catch (error) {
    res.status(500).json({ message: 'Error creating call', error: error.message });
  }
};

export const updateCallStatus = async (req, res) => {
  try {
    const { callId } = req.params;
    const { status, duration } = req.body;

    const call = await Call.findByIdAndUpdate(
      callId,
      {
        status,
        endedAt: new Date(),
        duration
      },
      { new: true }
    );

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Error updating call status', error: error.message });
  }
};

export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const calls = await Call.find({
      $or: [{ caller: userId }, { receiver: userId }]
    })
      .populate('caller', 'username avatarUrl')
      .populate('receiver', 'username avatarUrl')
      .sort({ startedAt: -1 });

    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call history', error: error.message });
  }
};