import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  rollResult: {
    type: Number,
    required: true,
  },
  isWin: {
    type: Boolean,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  serverSeed: String,
  clientSeed: String,
  nonce: Number,
}, { timestamps: true });

export default mongoose.model('Game', gameSchema);