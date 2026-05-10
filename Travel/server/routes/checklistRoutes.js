import express from 'express';
import {
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem
} from '../controllers/checklistController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../utils/validation.js';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(authenticate);

// Checklist validation
const checklistValidation = [
  body('item_name').trim().notEmpty().withMessage('Item name is required'),
  body('category').isIn(['clothing', 'electronics', 'documents', 'essentials', 'toiletries', 'other'])
    .withMessage('Invalid category')
];

// Routes
router.get('/', getChecklistItems);
router.post('/', checklistValidation, validate, addChecklistItem);
router.put('/:itemId', updateChecklistItem);
router.delete('/:itemId', deleteChecklistItem);

export default router;
