const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth.js");
const  sendConatctEmail  = require("../controllers/SendContactEmail.js");

router.post("/send-email", verifyUser, sendConatctEmail);

module.exports = router;
