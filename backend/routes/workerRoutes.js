const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/auth');
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

// All routes are protected and require worker role
router.use(verifyUser);

// Worker profile routes
router.get('/profile', getWorkerProfile);

// Worker availability routes
router.put('/availability', updateWorkerAvailability);

// Worker bookings routes
router.get('/bookings', getWorkerBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Worker earnings routes
router.get('/earnings', getWorkerEarnings);

// Worker services routes
router.get('/services', getWorkerServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

module.exports = router; 