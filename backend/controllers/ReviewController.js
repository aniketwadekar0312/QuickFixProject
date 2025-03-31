const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Validate customer role
    if (req.user.role !== 'customer') {
      return res.status(403).json({ status: false, message: 'Only customers can submit reviews' });
    }

    // Check if booking exists and belongs to customer
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ status: false, message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(401).json({ status: false, message: 'Not authorized to review this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ status: false, message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ status: false, message: 'You have already reviewed this booking' });
    }

    const newReview = new Review({
      customer: req.user.id,
      worker: booking.worker,
      booking: bookingId,
      rating,
      comment
    });

    const review = await newReview.save();

    // Populate review with customer and worker info
    const populatedReview = await Review.findById(review._id)
      .populate('customer', 'name')
      .populate('worker', 'name')
      .populate('booking', 'service date');

    res.status(201).json({ status: true, message: 'Review added successfully', data: populatedReview });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

exports.getWorkerReviews = async (req, res) => {
  try {
    // Validate worker role
    if (req.user.role !== 'worker') {
      return res.status(403).json({ status: false, message: 'Access denied' });
    }

    const reviews = await Review.find({ worker: req.user.id })
      .populate('customer', 'name')
      .populate('booking', 'service date')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, message: 'Worker reviews fetched successfully', reviews });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

exports.getReviewsByWorker = async (req, res) => {
  try {
    const workerId = req.params.id;

    // Verify user is a worker
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ status: false, message: 'Worker not found' });
    }

    const reviews = await Review.find({ worker: workerId })
      .populate('customer', 'name')
      .populate('booking', 'service date')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, message: 'Worker reviews fetched successfully', data: reviews });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ status: false, message: 'Worker not found' });
    }
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

exports.getCustomerReviews = async (req, res) => {
  try {
    // Validate customer or admin role
    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
      return res.status(403).json({ status: false, message: 'Access denied' });
    }

    const reviews = await Review.find({ customer: req.user.id })
      .populate('worker', 'name')
      .populate({
        path: 'booking',
        populate: {
          path: 'service',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.json({ status: true, message: 'Customer reviews retrieved successfully', reviews });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ status: false, message: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ status: false, message: 'Not authorized to update this review' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Populate the updated review
    const updatedReview = await Review.findById(reviewId)
      .populate('customer', 'name')
      .populate('worker', 'name')
      .populate('booking', 'service date');

    res.status(200).json({ 
      status: true, 
      message: 'Review updated successfully', 
      data: updatedReview 
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ status: false, message: 'Review not found' });
    }
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ status: false, message: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ status: false, message: 'Not authorized to delete this review' });
    }

    // Delete the review using findByIdAndDelete
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ 
      status: true, 
      message: 'Review deleted successfully' 
    });
  } catch (err) {
    console.error('Delete review error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ status: false, message: 'Review not found' });
    }
    res.status(500).json({ status: false, message: 'Server error' });
  }
};