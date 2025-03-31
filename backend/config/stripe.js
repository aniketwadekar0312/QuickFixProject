// require('dotenv').config();

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
// }

const stripe = require("stripe")(
  "sk_test_51MX036SABObgi1uhPr5bsA8HnBfDSYPa2ir3GB1FGIcsSAWDVmTQBB4aBGMRNbcni8kqEBO3kgZytKeZEJuXXXMJ00OCw6OSk0"
);

module.exports = stripe; 