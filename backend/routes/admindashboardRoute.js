const express=require("express");
const router=express.Router();
const {isAdmin} = require("../middleware/adminAuth.js");
const {verifyUser} = require("../middleware/auth.js");
const { getDashboardSummary, getAllBookings}=require("../controllers/AdminDashboardController.js");

router.get("/admin/stats",verifyUser, isAdmin, getDashboardSummary);
router.get("/admin/bookings",verifyUser, isAdmin, getAllBookings);

module.exports=router;