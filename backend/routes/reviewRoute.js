const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/auth');

const { createReview, getWorkerReviews, getReviewsByWorker, getCustomerReviews } = require('../controllers/ReviewController');

// Create a review (Customers only)
router.post('/reviews', verifyUser, createReview);

// Get all reviews for the logged-in worker
router.get('/worker', verifyUser, getWorkerReviews);

// Get all reviews for a specific worker (Public)
router.get('/worker/:id',getReviewsByWorker);

// @route   GET api/reviews/customer
// @desc    Get all reviews submitted by the logged in customer
// @access  Private (customers only)
router.get('/reviews/customer', verifyUser, getCustomerReviews);

module.exports = router;
