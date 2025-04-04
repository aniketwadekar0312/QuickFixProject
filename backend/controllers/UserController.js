const User = require("../models/User.js");
const OTP = require("../models/OTP.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/Email.js");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // "customer", "worker", "admin"]
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    let data = {
      name,
      email,
      phone,
      verified: true,
      password: hashPassword,
      role,
    };
    if (role === "worker") {
      const {
        services,
        specializations,
        documents,
        location,
        pricing,
        description,
        available,
        photoUrl,
      } = req.body;
      data = {
        name,
        email,
        phone,
        password: hashPassword,
        role,
        verified: true,
        photoUrl,
        available,
        services,
        specializations,
        documents,
        location,
        pricing,
        description,
      };
    }

    // Create new user
    const newuser = new User(data);
    // Save user to database
    await newuser.save();

    return res.status(200).json({
      status: true,
      message: `${role} registered successfully.`,
      newuser,
    });
  } catch (error) {
    console.log("Getting error in register", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: `User does not Exists` });
    }
    if (user.role !== role) {
      return res
        .status(400)
        .json({ status: false, message: `User role does not match` });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ status: false, message: `Check your credentials` });
    }
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access for security
      secure: process.env.NODE_ENV === "production", // Ensures secure cookie in HTTPS
      sameSite: "Strict", // Helps against CSRF attacks
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    });

    return res.status(200).json({
      status: true,
      message: `${role} login successfully.`,
      user,
    });
  } catch (error) {
    console.log("Getting error in login", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const Logout = async (req, res) => {
  try {
    // Clear the JWT token from the cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
    });
    return res.status(200).json({ status: true, message: "Logged out" });
  } catch (error) {
    console.log("Getting error in logout", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Fetch only workers
    const users = await User.find({verified: true});

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    // Fetch only workers
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    return res
      .status(200)
      .json({ status: true, message: "User fetched successfully.", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      currentPassword,
      newPassword,
      confirmPassword,
      name,
      phone,
      photoUrl,
    } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Prepare update fields
    let updates = { name, phone, photoUrl };

    // Handle password update if currentPassword is provided
    if (currentPassword) {
      // const isMatch = currentPassword === user.password;
      const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatched) {
        return res
          .status(400)
          .json({ status: false, message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "New password and confirm password do not match",
        });
      }
      // Hash new password before updating
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      status: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

const generateOTPAndSendEmail = async (req, res) => {
  try {
    const { OtpType, email, name } = req.body;

    if (!OtpType || !email || !name) {
      return res.status(400).json({
        status: false,
        message: "Name, email, and OTP type are required.",
      });
    }

    // If OTP is for account verification, check if the user already exists
    if (OtpType === "verifyAccount") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          status: false,
          message: "User already exists.",
        });
      }
    }

    // Generate a 6-digit random OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Send OTP email based on the OTP type
    const emailSent = await sendEmail(name, email, otp, OtpType);
    if (!emailSent) {
      return res.status(500).json({
        status: false,
        message: "Failed to send OTP email.",
      });
    }

    // Save OTP in the database
    await OTP.create({ name, email, OTP: otp });

    return res.status(200).json({
      status: true,
      message: "OTP generated successfully.",
    });

  } catch (error) {
    console.error("Error in generateOTPAndSendEmail:", error);
    return res.status(500).json({
      status: false,
      message: "Server error. Please try again later.",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "User ID, email, and OTP are required" });
    }

    // Find the OTP in the database
    const otpRecord = await OTP.findOne({ email, OTP: otp });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired OTP" });
    }

    // OTP is valid, delete it after verification (optional)
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      status: true,
      message: "OTP Verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  Logout,
  getUsers,
  updateUser,
  getUserById,
  generateOTPAndSendEmail,
  verifyOTP,
};
