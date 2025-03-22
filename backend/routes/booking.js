const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');
const Service = require('../models/Service.js');
const User = require('../models/User.js');

const stripe = require('stripe')("sk_test_51MX036SABObgi1uhPr5bsA8HnBfDSYPa2ir3GB1FGIcsSAWDVmTQBB4aBGMRNbcni8kqEBO3kgZytKeZEJuXXXMJ00OCw6OSk0");
console.log(process.env.STRIPE_SECRET_KEY);

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { 
      workerId, 
      serviceId, 
      date, 
      timeSlot, 
      address, 
      paymentMethod,
      // paymentId,
      totalAmount
    } = req.body;
    
    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Check if worker exists if workerId provided
    if (workerId) {
      const worker = await User.findById(workerId);
      if (!worker || worker.role !== 'worker') {
        return res.status(404).json({ msg: 'Worker not found' });
      }
    }
    
    // Calculate total amount
    const platformFee = 49; // Example platform fee
    const calculatedTotalAmount = service.price + platformFee;
    
    let paymentIntent = null;
    
    // Create payment intent if online payment
    if (paymentMethod === 'online') {
      // Create a payment intent with Stripe
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: calculatedTotalAmount * 100, // Stripe uses cents
          currency: 'inr',
          payment_method_types: ['card'],
          description: `Booking for ${service.name}`,
          metadata: {
            serviceId: serviceId,
            customerId: req.user.id
          }
        });
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return res.status(500).json({ 
          msg: 'Payment processing error', 
          error: stripeError.message 
        });
      }
    }
    
    const newBooking = new Booking({
      customer: req.user.id,
      worker: workerId || null,
      service: serviceId,
      date,
      timeSlot,
      address,
      paymentMethod,
      totalAmount: calculatedTotalAmount,
      payment: paymentMethod === 'online' ? {
        paymentIntentId: paymentIntent ? paymentIntent.id : null,
        status: 'pending'
      } : null
    });
    
    const booking = await newBooking.save();
    
    // Populate booking with related data
    const populatedBooking = await Booking.findById(booking.id)
      .populate('customer', 'name email')
      .populate('worker', 'name email')
      .populate('service', 'name price');
      
    res.json({
      booking: populatedBooking,
      clientSecret: paymentIntent ? paymentIntent.client_secret : null
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/bookings/:id/payment-confirm
// @desc    Confirm payment for a booking
// @access  Private
router.post('/:id/payment-confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Verify user is the booking customer
    if (booking.customer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update booking payment status
      booking.payment.status = 'completed';
      booking.status = 'confirmed';
      await booking.save();
      
      res.json({ success: true, booking });
    } else {
      return res.status(400).json({ msg: 'Payment has not been completed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'customer') {
      // If customer, get their bookings
      bookings = await Booking.find({ customer: req.user.id })
        .populate('worker', 'name')
        .populate('service', 'name price')
        .sort({ date: -1 });
    } else if (req.user.role === 'worker') {
      // If worker, get bookings assigned to them
      bookings = await Booking.find({ worker: req.user.id })
        .populate('customer', 'name')
        .populate('service', 'name price')
        .sort({ date: -1 });
    } else if (req.user.role === 'admin') {
      // If admin, get all bookings
      bookings = await Booking.find()
        .populate('customer', 'name')
        .populate('worker', 'name')
        .populate('service', 'name price')
        .sort({ date: -1 });
    }
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('worker', 'name email phone')
      .populate('service', 'name description price');
      
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (
      req.user.role !== 'admin' && 
      booking.customer.id.toString() !== req.user.id && 
      (booking.worker && booking.worker.id.toString() !== req.user.id)
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user is authorized to update this booking
    if (
      req.user.role !== 'admin' && 
      (booking.worker && booking.worker.toString() !== req.user.id) &&
      !(booking.customer.toString() === req.user.id && status === 'cancelled')
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    booking.status = status;
    
    // If cancelling, handle refund for online payments
    if (status === 'cancelled' && booking.paymentMethod === 'online' && 
        booking.payment && booking.payment.status === 'completed') {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: booking.payment.paymentIntentId,
        });
        booking.payment.refundId = refund.id;
        booking.payment.status = 'refunded';
      } catch (error) {
        console.error('Refund error:', error);
        return res.status(500).json({ msg: 'Error processing refund' });
      }
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;