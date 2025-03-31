const mongoose = require('mongoose');
const Service = require('./models/Service'); // Adjust the path as needed

const MONGO_URI = "mongodb+srv://aniketwadekar0312:quickfixapp@cluster0.k26t4.mongodb.net/"; // Update this


const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB ✅");
//1) Home Repair
    // const services = await Service.find({category: "67e8ed5a94a75c0b36b2af10"});
    // const id = services.map(s => s._id)
    // console.log(id)
    const service = await Service.findOne({_id: "67e8f8f0cc29605bede64fd3"});
        console.log(service);

    console.log("Mock services added successfully 🚀");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
seedDB();
