const express = require("express");
const router = express.Router();

const { addCategory, getCategories} = require("../controllers/ServiceCategoryController.js");
router.post("/category", addCategory);
router.get("/category", getCategories);

module.exports = router;
