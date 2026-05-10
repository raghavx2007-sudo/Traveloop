import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  updateNotifications,
  updatePrivacy
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { body } from 'express-validator';
import { validate } from '../utils/validation.js';

const router = express.Router();
router.use(authenticate);

const profileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
];

router.get('/',                getProfile);
router.put('/',                profileValidation, validate, updateProfile);
router.post('/avatar',         upload.single('avatar'), uploadProfileImage);
router.put('/password',        changePassword);
router.put('/notifications',   updateNotifications);
router.put('/privacy',         updatePrivacy);

export default router;
