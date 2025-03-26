const User = require("../models/User");
const Booking = require("../models/Booking");

const getDashboardSummary = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "customer" });
    const approvedWorkers = await User.countDocuments({ role: "worker", status: "approved" });
    const pendingWorkers = await User.countDocuments({role: "worker", status: "pending"});
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const  totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      message: "Summary fetched successfully",
      summary: {
        users,
        approvedWorkers,
        pendingWorkers,
        totalBookings,
        completedBookings,
        pendingBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Get all bookings (for admin or worker)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("customer worker service");
   return res.status(200).json({ status: true, bookings });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};


const getCustomers = async (req, res) => {
  try {
    const users = await User.find({role: "customer"}).select(
      "name email phone photoUrl createdAt"
    ).populate("bookings");

    return res.status(200).json({ status: true, users });
  } catch (error) {
    console.error("Error fetching Customers:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};


const getWorkers = async (req, res) => { 
  try {
    const workers = await User.find({ role: "worker" });

    return res.status(200).json({ status: true, workers });
  }
  catch (error) {
    console.error("Error fetching Workers:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateWorkerStatus = async (req, res) => {
  try {
    const { workerId, status } = req.body;
    const worker = await User.findByIdAndUpdate(workerId, { status }, { new: true });
    return res.status(200).json({ status: true, worker });
  }
  catch (error) {
    console.error("Error updating worker status:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = { getDashboardSummary, getAllBookings, getCustomers, getWorkers, updateWorkerStatus };
