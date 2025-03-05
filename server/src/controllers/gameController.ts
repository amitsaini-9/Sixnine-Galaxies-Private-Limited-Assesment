import { Request, Response } from 'express';
import Player from '../models/Player';
import Game from '../models/Game';
import { generateRoll } from '../utils/provablyFair';

export const rollDice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playerId, betAmount } = req.body;

    const player = await Player.findById(playerId);
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (player.balance < betAmount) {
      res.status(400).json({ message: 'Insufficient balance' });
      return;
    }

    // Generate roll
    const roll = generateRoll(player.serverSeed, player.clientSeed, player.nonce);
    const isWin = roll >= 50;
    const profit = isWin ? betAmount : -betAmount;

    // Update player balance and nonce
    player.balance += profit;
    player.nonce += 1;
    await player.save();

    // Record game
    const game = await Game.create({
      playerId,
      betAmount,
      rollResult: roll,
      isWin,
      profit,
      serverSeed: player.serverSeed,
      clientSeed: player.clientSeed,
      nonce: player.nonce - 1,
    });

    res.json({
      roll,
      isWin,
      profit,
      newBalance: player.balance,
      game,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};