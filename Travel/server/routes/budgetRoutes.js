import express from 'express';
import {
  getBudgetItems,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem
} from '../controllers/budgetController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../utils/validation.js';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(authenticate);

// Budget validation
const budgetValidation = [
  body('category').isIn(['transport', 'accommodation', 'food', 'activities', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('item_name').trim().notEmpty().withMessage('Item name is required'),
  body('estimated_cost').isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number')
];

// Routes
router.get('/', getBudgetItems);
router.post('/', budgetValidation, validate, addBudgetItem);
router.put('/:itemId', budgetValidation, validate, updateBudgetItem);
router.delete('/:itemId', deleteBudgetItem);

export default router;
