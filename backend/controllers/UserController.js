const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // "customer", "worker", "admin"]
    let data = {
      name,
      email,
      phone,
      password,
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
        password,
        role,
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

    const isPasswordMatched = user.password === password;
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

    return res
      .status(200)
      .json({
        status: true,
        message: `${role} login successfully.`,
        token,
        user,
      });
  } catch (error) {
    console.log("Getting error in login", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Fetch only workers
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    // Fetch only workers
    const user = await User.findById(req.param.id);
    return res.status(200).json({status: true, message: "User fetched successfully.",user});
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword, confirmPassword, ...updates } = req.body;

    // Prevent email & role updates
    const restrictedFields = ["email", "role"];
    restrictedFields.forEach((field) => delete updates[field]);

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Handle password update if currentPassword is provided
    if (currentPassword) {
      const isMatch=currentPassword===user.password;
       
      if (!isMatch) {
        return res.status(400).json({ status: false, message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ status: false, message: "New password and confirm password do not match" });
      }

      // Hash new password before updating
      // const salt = await bcrypt.genSalt(10);
      // updates.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

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


module.exports = { register, login, getUsers, updateUser, getUserById };
