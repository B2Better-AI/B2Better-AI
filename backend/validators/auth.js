const { body } = require('express-validator');

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot be more than 100 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters')
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot be more than 100 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters')
];

// Preferences update validation
const validatePreferencesUpdate = [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean value'),
  
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean value'),
  
  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean value'),
  
  body('notifications.weeklyReports')
    .optional()
    .isBoolean()
    .withMessage('Weekly reports must be a boolean value'),
  
  body('privacy.profileVisibility')
    .optional()
    .isIn(['public', 'private', 'suppliers'])
    .withMessage('Profile visibility must be public, private, or suppliers'),
  
  body('privacy.showActivity')
    .optional()
    .isBoolean()
    .withMessage('Show activity must be a boolean value'),
  
  body('privacy.allowMessages')
    .optional()
    .isBoolean()
    .withMessage('Allow messages must be a boolean value'),
  
  body('privacy.dataSharing')
    .optional()
    .isBoolean()
    .withMessage('Data sharing must be a boolean value'),
  
  body('general.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de'])
    .withMessage('Language must be en, es, fr, or de'),
  
  body('general.timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a valid timezone string'),
  
  body('general.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD'])
    .withMessage('Currency must be USD, EUR, GBP, or CAD'),
  
  body('general.dateFormat')
    .optional()
    .isIn(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'])
    .withMessage('Date format must be MM/DD/YYYY, DD/MM/YYYY, or YYYY-MM-DD'),
  
  body('general.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto')
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validatePreferencesUpdate
};
