const express=require("express");
const router=express.Router();
const {isAdmin} = require("../middleware/adminAuth.js");
const {verifyUser} = require("../middleware/auth.js");
const {register, login,Logout, updateUser, getUsers, getUserById}=require("../controllers/UserController.js");

router.post("/register",register);
router.post("/login",login);
router.get("/users",getUsers);
router.put("/user/:id",verifyUser,updateUser);
router.get("/user/:id",verifyUser,getUserById);
router.post("/logout",verifyUser,Logout);

module.exports=router;