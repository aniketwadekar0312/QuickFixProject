const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/auth');

const { createReview, getWorkerReviews, getReviewsByWorker, getCustomerReviews,updateReview,deleteReview } = require('../controllers/ReviewController');

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

// @route   PUT api/reviews/:id
// @desc    Update a review
// @access  Private (Customers only)
router.put('/reviews/:id', verifyUser, updateReview);

// @route   DELETE api/reviews/:id
// @desc    Delete a review
// @access  Private (Customers only)
router.delete('/reviews/:id', verifyUser, deleteReview);

module.exports = router;
