import express from 'express';
import {
  getActivities,
  createActivity,
  deleteActivity,
  addActivityToTrip,
  removeActivityFromTrip
} from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../utils/validation.js';

const router = express.Router();
router.use(authenticate);

const activityValidation = [
  body('name').trim().notEmpty().withMessage('Activity name is required'),
  body('category')
    .isIn(['sightseeing', 'food', 'adventure', 'nightlife', 'shopping', 'culture', 'nature', 'other'])
    .withMessage('Invalid category'),
  body('avg_cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer (minutes)')
];

// Catalog CRUD
router.get('/', getActivities);
router.post('/', activityValidation, validate, createActivity);
router.delete('/:id', deleteActivity);

// Trip activity routes (nested under trip/stop routes)
export const tripActivityRoutes = express.Router({ mergeParams: true });
tripActivityRoutes.use(authenticate);
tripActivityRoutes.post('/', addActivityToTrip);
tripActivityRoutes.delete('/:activityId', removeActivityFromTrip);

export default router;
