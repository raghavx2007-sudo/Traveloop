import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { registerValidation, loginValidation, validate } from '../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
