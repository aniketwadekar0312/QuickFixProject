const bcrypt = require("bcryptjs");
const User = require('./models/User');
const Review = require("./models/Review");
const mongoose = require("mongoose")
const hash = async () => 
{
    // "customer", "worker", "admin"]
       const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash("Gulshan@123", salt);
       console.log(hashPassword)
};

hash();

// const getWorkerReviewsAndUpdateRating = async (req, res) => {
//   try {
//     // const { workerId } = req.params;
//     // workerId 
//     // if (!workerId) {
//     //   return res.status(400).json({ status: false, message: "Worker ID is required" });
//     // }

//     // Fetch all reviews for the worker
//     const reviews = await Review.find({ worker: new mongoose.Types.ObjectId("67e7a4d2d081e4f009b81a5c") });

//     if (!reviews.length) {
//       return res.status(404).json({ status: false, message: "No reviews found for this worker" });
//     }

//     // Calculate average rating
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     const averageRating = totalRating / reviews.length;

//     // Update worker document with new average rating
//     await User.findByIdAndUpdate("67e7a4d2d081e4f009b81a5c", { rating: averageRating.toFixed(1) });

//     // return res.status(200).json({
//     //   status: true,
//     //   message: "Worker rating updated successfully",
//     //   averageRating: averageRating.toFixed(1),
//     // });
//     return true
//   } catch (error) {
//     console.error("Error fetching worker reviews and updating rating:", error);
//     // return res.status(500).json({ status: false, message: error.message });
//   }
// };

// getWorkerReviewsAndUpdateRating()
