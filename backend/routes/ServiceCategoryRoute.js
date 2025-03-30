const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleware/auth.js");
const {isAdmin} = require("../middleware/adminAuth.js")

const { addCategory, getCategories, deleteCategory, updateCategory} = require("../controllers/ServiceCategoryController.js");
router.post("/category",verifyUser,isAdmin, addCategory);
router.put("/category/:id",verifyUser,isAdmin, updateCategory);
router.delete("/category/:id",verifyUser,isAdmin, deleteCategory);
router.get("/category", getCategories);

module.exports = router;
 