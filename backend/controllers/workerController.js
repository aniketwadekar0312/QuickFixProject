const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

// @desc    Get worker's bookings
// @route   GET /api/v1/worker/bookings
// @access  Private
const getWorkerBookings = asyncHandler(async (req, res) => {
  try {
    console.log('Getting bookings for worker:', req.user._id);
    const bookings = await Booking.find({ worker: req.user._id })
      .populate('customer', 'name email')
      .populate('service', 'name price')
      .sort('-createdAt');

    console.log('Found bookings:', bookings.length);
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error in getWorkerBookings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookings'
    });
  }
});

// @desc    Update worker's availability
// @route   PUT /api/v1/worker/availability
// @access  Private
const updateWorkerAvailability = asyncHandler(async (req, res) => {
  try {
    const { isAvailable } = req.body;
    console.log('Updating availability for worker:', req.user._id, 'to:', isAvailable);

    const worker = await User.findByIdAndUpdate(
      req.user._id,
      { isAvailable },
      { new: true, runValidators: true }
    );

    if (!worker) {
      res.status(404);
      throw new Error('Worker not found');
    }

    res.json({
      success: true,
      data: worker
    });
  } catch (error) {
    console.error('Error in updateWorkerAvailability:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating availability'
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/v1/worker/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    console.log('Updating booking status:', req.params.id, 'to:', status);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check if the booking belongs to the worker
    if (booking.worker.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this booking');
    }

    // Validate status
    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating booking status'
    });
  }
});

// @desc    Get worker's profile
// @route   GET /api/v1/worker/profile
// @access  Private
const getWorkerProfile = asyncHandler(async (req, res) => {
  try {
    console.log('Getting profile for worker:', req.user._id);
    const worker = await User.findById(req.user._id)
      .select('-password');

    if (!worker) {
      res.status(404);
      throw new Error('Worker not found');
    }

    // Calculate average rating
    const bookings = await Booking.find({ worker: worker._id, status: 'completed' });
    
    const totalRating = bookings.reduce((acc, booking) => acc + (booking.review?.rating || 0), 0);
    const averageRating = bookings.length > 0 ? totalRating / bookings.length : 0;

    console.log('Found worker profile with rating:', averageRating);
    res.json({
      success: true,
      data: {
        ...worker.toObject(),
        rating: averageRating
      }
    });
  } catch (error) {
    console.error('Error in getWorkerProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching worker profile'
    });
  }
});

// @desc    Get worker's earnings
// @route   GET /api/v1/worker/earnings
// @access  Private
const getWorkerEarnings = asyncHandler(async (req, res) => {
  try {
    console.log('Getting earnings for worker:', req.user._id);
    const completedBookings = await Booking.find({
      worker: req.user._id,
      status: 'completed'
    }).select('totalAmount createdAt');

    const totalEarnings = completedBookings.reduce((acc, booking) => acc + booking.totalAmount, 0);

    // Get earnings by month for the last 6 months
    const monthlyEarnings = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthBookings = completedBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= month && bookingDate <= monthEnd;
      });

      const monthTotal = monthBookings.reduce((acc, booking) => acc + booking.totalAmount, 0);

      monthlyEarnings.push({
        month: month.toLocaleString('default', { month: 'short', year: 'numeric' }),
        amount: monthTotal
      });
    }

    console.log('Found earnings:', { totalEarnings, monthlyEarningsCount: monthlyEarnings.length });
    res.json({
      success: true,
      data: {
        totalEarnings,
        monthlyEarnings
      }
    });
  } catch (error) {
    console.error('Error in getWorkerEarnings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching earnings'
    });
  }
});

// @desc    Get worker's services
// @route   GET /api/v1/worker/services
// @access  Private
const getWorkerServices = asyncHandler(async (req, res) => {
  try {
    console.log('Getting services for worker:', req.user._id);
    const services = await Service.find({ worker: req.user._id });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error in getWorkerServices:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching services'
    });
  }
});

// @desc    Create a new service
// @route   POST /api/v1/worker/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, responseTime } = req.body;
    
    const service = await Service.create({
      name,
      description,
      price,
      category,
      responseTime,
      worker: req.user._id,
      active: true
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error in createService:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating service'
    });
  }
});

// @desc    Update a service
// @route   PUT /api/v1/worker/services/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    // Check if the service belongs to the worker
    if (service.worker.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this service');
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    console.error('Error in updateService:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating service'
    });
  }
});

// @desc    Delete a service
// @route   DELETE /api/v1/worker/services/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    // Check if the service belongs to the worker
    if (service.worker.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this service');
    }

    await service.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteService:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting service'
    });
  }
});

module.exports = {
  getWorkerBookings,
  updateWorkerAvailability,
  updateBookingStatus,
  getWorkerProfile,
  getWorkerEarnings,
  getWorkerServices,
  createService,
  updateService,
  deleteService
}; 