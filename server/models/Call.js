import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  status: {
    type: String,
    enum: ['missed', 'completed'],
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  endedAt: Date,
  duration: Number
});

export default mongoose.model('Call', callSchema);