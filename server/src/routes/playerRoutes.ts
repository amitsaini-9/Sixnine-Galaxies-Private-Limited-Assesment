import express, { Router } from 'express';
import * as playerController from '../controllers/playerController';

const router: Router = express.Router();

// GET all players
router.get('/', async (req, res, next) => {
  try {
    const players = await playerController.getAllPlayers(req, res);
  } catch (error) {
    next(error);
  }
});

// GET player balance
router.get('/:playerId/balance', async (req, res, next) => {
  try {
    await playerController.getBalance(req, res);
  } catch (error) {
    next(error);
  }
});

// Create new player
router.post('/', async (req, res, next) => {
  try {
    await playerController.createPlayer(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;