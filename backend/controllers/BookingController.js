const Booking = require('../models/Booking.js');
const Service=require('../models/Service.js');
const User = require('../models/User.js');

// Create a new booking
const createBooking = async (req, res) => {
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
}

// Get all bookings (for admin or worker)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer worker service');
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};

// Get bookings for a specific customer
const getBookingsByCustomer = async (req, res) => {
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
}

// Get bookings for a specific worker
const getBookingsByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const bookings = await Booking.find({ worker: workerId }).populate('customer service');
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching worker bookings', error: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, message: 'Booking status updated', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking status', error: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
  }
};

module.exports={createBooking,getBookingsByCustomer}
