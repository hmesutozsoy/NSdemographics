import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import proofRoutes from './routes/proofs';
import groupRoutes from './routes/groups';
import demographicsRoutes from './routes/demographics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/proofs', proofRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/demographics', demographicsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

