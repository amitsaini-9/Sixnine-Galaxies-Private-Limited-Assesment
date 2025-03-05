import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
    default: 1000,
  },
  clientSeed: {
    type: String,
    required: true,
  },
  serverSeed: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);