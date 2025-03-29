const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/auth');
const {
  getPaymentMethods,
  createSetupIntent,
  confirmSetupIntent,
  deletePaymentMethod,
  setDefaultPaymentMethod
} = require('../controllers/PaymentMethodController');

// Apply auth middleware to all routes

// @route   GET api/payment-methods
// @desc    Get all payment methods for the current user
// @access  Private (Customers only)
router.get('/', verifyUser, getPaymentMethods);

// @route   POST api/payment-methods/setup-intent
// @desc    Create a SetupIntent for adding a new payment method
// @access  Private (Customers only)
router.post('/setup-intent', verifyUser, createSetupIntent);

// @route   POST api/payment-methods/confirm-setup
// @desc    Confirm and save the payment method after setup
// @access  Private (Customers only)
router.post('/confirm-setup', verifyUser, confirmSetupIntent);

// @route   DELETE api/payment-methods/:id
// @desc    Delete a payment method
// @access  Private (Customers only)
router.delete('/:id', verifyUser, deletePaymentMethod);

// @route   PUT api/payment-methods/:id/default
// @desc    Set default payment method
// @access  Private (Customers only)
router.put('/:id/default', verifyUser, setDefaultPaymentMethod);

module.exports = router; 