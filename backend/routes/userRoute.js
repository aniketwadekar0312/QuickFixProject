const express=require("express");
const router=express.Router();
const {register, login, updateUser, getUsers, getUserById}=require("../controllers/UserController.js");

router.post("/register",register);
router.post("/login",login);
router.get("/users",getUsers);
router.put("/user/:id",updateUser);
router.get("/user/:id",getUserById);


module.exports=router;