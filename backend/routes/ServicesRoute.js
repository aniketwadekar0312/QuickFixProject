const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {addService, getService, getServiceById, updateService, deleteService} = require('../controllers/ServiceController');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/service', getService);

// @route   GET api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/service/:id', getServiceById);

// @route   POST api/services
// @desc    Create a service
// @access  Private (Admin only)
router.post('/service', [auth, adminAuth], addService);

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private (Admin only)
router.put('/service/:id', [auth, adminAuth], updateService);

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Admin only)
router.delete('/service/:id', [auth, adminAuth], deleteService);

module.exports = router;