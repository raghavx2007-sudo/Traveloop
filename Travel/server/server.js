import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force Node.js to use Google DNS (8.8.8.8) for all lookups.
// This fixes querySrv ECONNREFUSED errors on networks where the
// system DNS can't resolve MongoDB Atlas SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { seedActivities } from './utils/seedActivities.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import tripStopRoutes from './routes/tripStopRoutes.js';
import activityRoutes, { tripActivityRoutes } from './routes/activityRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

// Load environment variables
dotenv.config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB, then start server
await connectDB();

// Seed sample activities if collection is empty
await seedActivities();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Traveloop API is running', version: '2.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/stops', tripStopRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/trips/:tripId/stops/:stopId/activities', tripActivityRoutes);
app.use('/api/trips/:tripId/budget', budgetRoutes);
app.use('/api/trips/:tripId/checklist', checklistRoutes);
app.use('/api/trips/:tripId/notes', noteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
