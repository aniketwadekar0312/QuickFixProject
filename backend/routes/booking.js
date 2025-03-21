const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { createBooking, getBookingsByCustomer } = require('../controllers/BookingController');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, createBooking);

// @route   GET api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', auth, getBookingsByCustomer);

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
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
      booking.customer._id.toString() !== req.user.id && 
      booking.worker._id.toString() !== req.user.id
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
router.put('/:id/status', auth, async (req, res) => {
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
      booking.worker.toString() !== req.user.id &&
      !(booking.customer.toString() === req.user.id && status === 'cancelled')
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    booking.status = status;
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