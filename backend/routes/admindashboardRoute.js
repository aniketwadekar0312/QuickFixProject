const express=require("express");
const router=express.Router();
const {isAdmin} = require("../middleware/adminAuth.js");
const {verifyUser} = require("../middleware/auth.js");
const { getDashboardSummary, getAllBookings, getCustomers, getWorkers, updateWorkerStatus}=require("../controllers/AdminDashboardController.js");

router.get("/admin/stats",verifyUser, isAdmin, getDashboardSummary);
router.get("/admin/bookings",verifyUser, isAdmin, getAllBookings);
router.get("/admin/customers",verifyUser, isAdmin, getCustomers);
router.get("/admin/workers",verifyUser, isAdmin, getWorkers);
router.put("/admin/workers",verifyUser, isAdmin, updateWorkerStatus);

module.exports=router;