require('dotenv').config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe; 