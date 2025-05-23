const express=require("express");
const router=express.Router();
const {isAdmin} = require("../middleware/adminAuth.js");
const {verifyUser} = require("../middleware/auth.js");
const {register, login,Logout, updateUser, getUsers, getUserById, generateOTPAndSendEmail, verifyOTP, updateUserByEmail}=require("../controllers/UserController.js");

router.post("/register",register);
router.post("/login",login);
router.get("/users",getUsers);
router.put("/user/:id",updateUser);
router.post("/user/email",updateUserByEmail);
router.get("/user/:id",verifyUser,getUserById);
router.post("/logout",verifyUser,Logout);
router.post("/otp", generateOTPAndSendEmail);
router.post("/verify-otp", verifyOTP);

module.exports=router;