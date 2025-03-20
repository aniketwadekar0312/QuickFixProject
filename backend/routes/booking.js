const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { workerId, serviceId, date, timeSlot, address, paymentMethod } = req.body;
    
    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Check if worker exists
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ msg: 'Worker not found' });
    }
    
    // Calculate total amount
    const platformFee = 49; // Example platform fee
    const totalAmount = service.price + platformFee;
    
    const newBooking = new Booking({
      customer: req.user.id,
      worker: workerId,
      service: serviceId,
      date,
      timeSlot,
      address,
      paymentMethod,
      totalAmount
    });
    
    const booking = await newBooking.save();
    
    // Populate booking with related data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email')
      .populate('worker', 'name email')
      .populate('service', 'name price');
      
    res.json(populatedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', auth, async (req, res) => {
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