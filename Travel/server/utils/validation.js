import { body, validationResult } from 'express-validator';

/**
 * Validation middleware wrapper
 * Checks validation results and returns errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * User registration validation rules
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

/**
 * User login validation rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Trip creation validation rules
 */
export const tripValidation = [
  body('trip_name')
    .trim()
    .notEmpty().withMessage('Trip name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Trip name must be between 3 and 200 characters'),
  
  body('start_date')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format'),
  
  body('end_date')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date format')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];
