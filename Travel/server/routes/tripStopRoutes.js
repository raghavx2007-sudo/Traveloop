import express from 'express';
import {
  addStop,
  updateStop,
  deleteStop,
  reorderStops
} from '../controllers/tripStopController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../utils/validation.js';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(authenticate);

// Stop validation
const stopValidation = [
  body('city_name').trim().notEmpty().withMessage('City name is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('arrival_date').optional().isISO8601().withMessage('Invalid arrival date'),
  body('departure_date').optional().isISO8601().withMessage('Invalid departure date')
];

// Routes
router.post('/', stopValidation, validate, addStop);
router.put('/reorder', reorderStops);
router.put('/:stopId', stopValidation, validate, updateStop);
router.delete('/:stopId', deleteStop);

export default router;
