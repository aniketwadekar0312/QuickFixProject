const express = require('express');
const router = express.Router();
const {
  getWorkerBookings,
  updateWorkerAvailability,
  updateBookingStatus,
  getWorkerProfile,
  getWorkerEarnings,
  getWorkerServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/workerController');
const { verifyUser } = require('../middleware/auth');


// Booking routes
router.get('/bookings', getWorkerBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Profile and availability routes
router.get('/profile', getWorkerProfile);
router.put('/availability', updateWorkerAvailability);

// Earnings route
router.get('/earnings', getWorkerEarnings);

// Service management routes
router.route('/services')
  .get(getWorkerServices)
  .post(createService);

router.route('/services/:id')
  .put(updateService)
  .delete(deleteService);

module.exports = router; 