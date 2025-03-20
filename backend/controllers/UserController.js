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
      } = req.body;
      data = {
        name,
        email,
        phone,
        password,
        role,
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
    // const payload = {
    //   user: {
    //     id: newuser._id,
    //     role: newuser.role,
    //   },
    // };

    // const token=jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" });
    return res
      .status(200)
      .json({
        status: true,
        message: `${role} registered successfully.`,
        newuser,
        // token
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
    console.log(user);
    console.log(password);
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

    const token=jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" });
    return res
      .status(200)
      .json({ status: true, message: `${role} login successfully.`,token,user });
  } catch (error) {
    console.log("Getting error in login", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { register, login };
