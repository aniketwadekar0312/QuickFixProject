const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB=require("./db");
const path = require('path');
const userRouter=require("./routes/userRoute.js");
const categoryRouter = require("./routes/ServiceCategoryRoute.js");
const servicesRouter = require("./routes/ServicesRoute.js");
const bookingRouter = require("../backend/routes/bookingRoute.js");
const adminDashboardRouter = require("../backend/routes/admindashboardRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// API Routes
app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', servicesRouter);
app.use('/api/v1', bookingRouter);
app.use('/api/v1', adminDashboardRouter);
app.use('/api/v1/', reviewRouter);


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Connect to MongoDB
connectDB()

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));