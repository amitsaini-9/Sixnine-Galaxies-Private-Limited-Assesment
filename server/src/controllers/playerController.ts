import { Request, Response } from 'express';
import Player from '../models/Player';
import { generateServerSeed } from '../utils/provablyFair';

export const getAllPlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playerId } = req.params;

    // Validate playerId format
    if (!playerId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid player ID format' });
      return;
    }

    const player = await Player.findById(playerId);

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    res.json({ balance: player.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createPlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientSeed = req.body.clientSeed || Math.random().toString(36).substring(7);
    const serverSeed = generateServerSeed();

    const player = await Player.create({
      clientSeed,
      serverSeed,
      balance: 1000, // Starting balance
    });

    res.status(201).json({
      message: 'Player created successfully',
      player: {
        id: player._id,
        balance: player.balance,
        clientSeed: player.clientSeed
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};