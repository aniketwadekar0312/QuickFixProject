const mongoose=require("mongoose")
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://aniketwadekar0312:quickfixapp@cluster0.k26t4.mongodb.net/")
      console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
};

module.exports=connectDB