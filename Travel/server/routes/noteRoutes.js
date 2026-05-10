import express from 'express';
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote
} from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../utils/validation.js';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(authenticate);

// Note validation
const noteValidation = [
  body('note').trim().notEmpty().withMessage('Note content is required')
];

// Routes
router.get('/', getNotes);
router.post('/', noteValidation, validate, addNote);
router.put('/:noteId', noteValidation, validate, updateNote);
router.delete('/:noteId', deleteNote);

export default router;
