const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const verifyUser = async(req, res, next) => {
  try {
    // Check if Authorization header exists
    // if (!req.headers.authorization) {
    //   return res.status(401).json({ msg: "No token, authorization denied" });
    // }

    // const authHeader = req.headers.authorization;

    // // Ensure the format is "Bearer TOKEN"
    // if (!authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ msg: "Invalid token format" });
    // }

    // // Extract token after "Bearer "
    // const token = authHeader.split(" ")[1];

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "Token not found, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.user.id });
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message); 
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = { verifyUser };
