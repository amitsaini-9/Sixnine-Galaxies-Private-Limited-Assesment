import axios from 'axios';

const API_URL = 'https://sixnine-galaxies-private-limited.onrender.com/api';

export interface Player {
  id: string;
  balance: number;
  clientSeed: string;
}

export interface RollResult {
  roll: number;
  isWin: boolean;
  profit: number;
  newBalance: number;
}

const api = {
  // Player endpoints
  createPlayer: async (): Promise<Player> => {
    const response = await axios.post(`${API_URL}/players`);
    return response.data.player;
  },

  getBalance: async (playerId: string): Promise<number> => {
    const response = await axios.get(`${API_URL}/players/${playerId}/balance`);
    return response.data.balance;
  },

  // Game endpoints
  rollDice: async (playerId: string, betAmount: number): Promise<RollResult> => {
    const response = await axios.post(`${API_URL}/game/roll-dice`, {
      playerId,
      betAmount
    });
    return response.data;
  }
};

export default api;
