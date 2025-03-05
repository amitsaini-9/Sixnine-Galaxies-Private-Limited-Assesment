import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import gameRoutes from './routes/gameRoutes';
import playerRoutes from './routes/playerRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/players', playerRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Log before attempting database connection
    console.log('Starting server...');

    // Connect to database
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log(`- GET  http://localhost:${PORT}/test`);
      console.log(`- POST http://localhost:${PORT}/api/players`);
      console.log(`- GET  http://localhost:${PORT}/api/players/:playerId/balance`);
      console.log(`- POST http://localhost:${PORT}/api/game/roll-dice`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

start();