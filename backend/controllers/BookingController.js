const Booking = require("../models/Booking.js");
const Service = require("../models/Service.js");
const User = require("../models/User.js");
const stripe = require("stripe")(
  "sk_test_51MX036SABObgi1uhPr5bsA8HnBfDSYPa2ir3GB1FGIcsSAWDVmTQBB4aBGMRNbcni8kqEBO3kgZytKeZEJuXXXMJ00OCw6OSk0"
);
// console.log(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Convert to cents
      currency: "inr",
      payment_method_types: ["card"],
    });
    return res.status(201).json({
      message: "PaymentIntented successfully",
      paymentIntent,
    });
  } catch (error) {
    console.log("Getting error in createPaymentIntent", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      paymentIntentId,
      workerId,
      totalAmount,
      serviceId,
      date,
      timeSlot,
      address,
      paymentMethod,
    } = req.body;

    // Retrieve Payment Intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json({ status: false, message: "Payment not successful" });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({status: false, msg: "Service not found" });
    }

    // Check if worker exists
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({status: false, msg: "Worker not found" });
    }

    const booking = new Booking({
      customer: req.user._id,
      worker: workerId,
      service: serviceId,
      date,
      timeSlot,
      address,
      paymentMethod,
      payment: {
        paymentIntentId,
        status: "completed",
      },
      totalAmount,
    });

    await booking.save();


    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { bookings: booking._id } },
      {new: true}
    )
    return res
      .status(200)
      .json({ status: true, message: "Booking is created", booking });
  } catch (err) {
    console.error("create booking", err.message);
    return res.status(500).send("Server error");
  }
};


const getBookingsByCustomerId = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: String(req.user._id) }).populate(
      "worker service"
    );
  return  res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.log("Error fetching bookings", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
}



// Get bookings for a specific customer
const getBookingsByCustomer = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "customer") {
      // If customer, get their bookings
      bookings = await Booking.find({ customer: req.user._id })
        .populate("worker", "name")
        .populate("service", "name price")
        .sort({ date: -1 });
    } else if (req.user.role === "worker") {
      // If worker, get bookings assigned to them
      bookings = await Booking.find({ worker: req.user.id })
        .populate("customer", "name")
        .populate("service", "name price")
        .sort({ date: -1 });
    } else if (req.user.role === "admin") {
      // If admin, get all bookings
      bookings = await Booking.find()
        .populate("customer", "name")
        .populate("worker", "name")
        .populate("service", "name price")
        .sort({ date: -1 });
    }

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get bookings for a specific worker
const getBookingsByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const bookings = await Booking.find({ worker: workerId }).populate(
      "customer service"
    );
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching worker bookings",
      error: error.message,
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error: error.message,
    });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting booking",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  createBooking,
  getBookingsByCustomer,
  getBookingsByWorker,
  updateBookingStatus,
  deleteBooking,
  getBookingsByCustomerId
};
