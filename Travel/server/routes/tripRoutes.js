import express from 'express';
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  getDashboardStats
} from '../controllers/tripController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { tripValidation, validate } from '../utils/validation.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// Trip CRUD
router.post('/', upload.single('cover_image'), tripValidation, validate, createTrip);
router.get('/', getTrips);
router.get('/:id', getTrip);
router.put('/:id', upload.single('cover_image'), tripValidation, validate, updateTrip);
router.delete('/:id', deleteTrip);

export default router;
