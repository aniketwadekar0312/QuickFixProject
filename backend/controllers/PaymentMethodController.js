const PaymentMethod = require('../models/PaymentMethod');
const stripe = require('../config/stripe');
const User = require('../models/User');

// Get all payment methods for the current user
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods'
    });
  }
};

// Create a SetupIntent for adding a new payment method
exports.createSetupIntent = async (req, res) => {
  try {
    // Check if user has a Stripe customer ID
    let customerId = req.user.stripeCustomerId;
    
    if (!customerId) {
      // Create a new Stripe customer if one doesn't exist
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      
      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(req.user._id, {
        stripeCustomerId: customer.id
      });
      
      customerId = customer.id;
    }

    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: setupIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating setup intent'
    });
  }
};

// Confirm and save the payment method after setup
exports.confirmSetupIntent = async (req, res) => {
  try {
    const { setupIntentId } = req.body;

    // Retrieve the setup intent
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    
    if (setupIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Setup intent not succeeded'
      });
    }

    // Get the payment method from the setup intent
    const paymentMethodId = setupIntent.payment_method;
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const card = paymentMethod.card;

    // Get the customer ID from the user
    const user = await User.findById(req.user._id);
    if (!user.stripeCustomerId) {
      throw new Error('User has no Stripe customer ID');
    }

    // Create payment method in database
    const newPaymentMethod = await PaymentMethod.create({
      user: req.user._id,
      type: 'card',
      last4: card.last4,
      brand: card.brand,
      expiryMonth: card.exp_month,
      expiryYear: card.exp_year,
      paymentMethodId,
      customerId: user.stripeCustomerId,
      isDefault: !(await PaymentMethod.exists({ user: req.user._id }))
    });

    res.status(201).json({
      success: true,
      data: newPaymentMethod
    });
  } catch (error) {
    console.error('Error confirming setup intent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirming setup intent'
    });
  }
};

// Delete a payment method
exports.deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }

    try {
      // Try to detach payment method from customer in Stripe
      await stripe.paymentMethods.detach(paymentMethod.paymentMethodId);
    } catch (stripeError) {
      // If the error is about the payment method not being attached, we can ignore it
      // as we're going to delete it anyway
      if (stripeError.message !== 'The payment method you provided is not attached to a customer so detachment is impossible.') {
        throw stripeError;
      }
    }

    // Delete payment method from database
    await PaymentMethod.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting payment method'
    });
  }
};

// Set default payment method
exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }

    paymentMethod.isDefault = true;
    await paymentMethod.save();

    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error setting default payment method'
    });
  }
}; 