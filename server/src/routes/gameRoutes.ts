import express, { Router } from 'express';
import * as gameController from '../controllers/gameController';

const router: Router = express.Router();

// POST /api/game/roll-dice
router.post('/roll-dice', async (req, res, next) => {
  try {
    await gameController.rollDice(req, res);
  } catch (error) {
    next(error);
  }
});

// Add a test GET route
router.get('/roll-dice', (req, res) => {
  res.json({ message: 'Use POST method for rolling dice' });
});

export default router;