import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Import routers
import authRoutes from './routes/authRoutes';
import devisRoutes from './routes/devisRoutes';
import reclamationRoutes from './routes/reclamationRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/reclamations', reclamationRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    message: 'Groupe Seghaier Backend API is running.',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[Server]: API is running at http://localhost:${PORT}`);
});
