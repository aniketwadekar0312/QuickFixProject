const express=require("express");
const router=express.Router();
const {register, login, updateUser, getUsers}=require("../controllers/UserController.js");

router.post("/register",register);
router.post("/login",login);
router.get("/users",getUsers);
router.put("/user/:id",updateUser);


module.exports=router;