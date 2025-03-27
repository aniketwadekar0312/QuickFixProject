const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth");
const {
  createBooking,
  createPaymentIntent,
  getBookingsByCustomer,
  getBookingsByWorker,
  updateBookingStatus,
  getBookingsByCustomerId,
  deleteBooking,
  getBookingById,
} = require("../controllers/BookingController");

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post("/payment-intent", verifyUser, createPaymentIntent);
router.post("/book", verifyUser, createBooking);

// @route   GET api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get("/customer/bookings", verifyUser, getBookingsByCustomerId);


// router.get("/booking", verifyUser, getBookingsByCustomerId);
router.get("/booking/:id",verifyUser, getBookingById);

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put("/:id/status");

module.exports = router;
