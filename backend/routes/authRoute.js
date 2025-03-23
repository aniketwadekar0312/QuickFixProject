// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { check, validationResult } = require('express-validator');

// // @route   POST api/auth/login
// // @desc    Authenticate user & get token
// // @access  Public
// router.post('/login', [
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Password is required').exists()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Create and return JWT token
//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role
//       }
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ 
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//           } 
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
