const express = require('express');
const router = express.Router();
const {isAdmin} = require('../middleware/adminAuth');
const {addService, getService, getServiceById, updateService, deleteService} = require('../controllers/ServiceController');
const {verifyUser} = require('../middleware/auth');

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
router.post('/service', verifyUser, isAdmin, addService);

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private (Admin only)
router.put('/service/:id', verifyUser, isAdmin, updateService);

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Admin only)
router.delete('/service/:id', verifyUser, isAdmin, deleteService);

module.exports = router;