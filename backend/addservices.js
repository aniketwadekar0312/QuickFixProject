const mongoose = require('mongoose');
const Service = require('./models/Service'); // Adjust the path as needed

const MONGO_URI = "mongodb+srv://aniketwadekar0312:quickfixapp@cluster0.k26t4.mongodb.net/"; // Update this

const mockServices = [
  {
    name: "Plumbing",
    description: "Professional plumbing services for all your needs",
    image: "/placeholder.svg",
    category: "67e8e96394a75c0b36b2ae6f",
    price: 500
  },
  {
    name: "Electrical",
    description: "Expert electrical services for residential and commercial properties",
    image: "/placeholder.svg",
    category: "67e8e96394a75c0b36b2ae6f",
    price: 600
  },
  {
    name: "Cleaning",
    description: "Comprehensive cleaning services for homes and offices",
    image: "/placeholder.svg",
    category: "67e8ecf094a75c0b36b2af06",
    price: 400
  },
  {
    name: "Carpentry",
    description: "Skilled carpentry services for all your woodworking needs",
    image: "/placeholder.svg",
    category: "67e8ed3994a75c0b36b2af0b",
    price: 600
  },
  {
    name: "Painting",
    description: "Professional painting services for interior and exterior surfaces",
    image: "/placeholder.svg",
    category: "67e8ed3994a75c0b36b2af0b",
    price: 450
  },
  {
    name: "Air Conditioning",
    description: "AC installation, repair, and maintenance services",
    image: "/placeholder.svg",
    category: "67e8e96394a75c0b36b2ae6f",
    price: 800
  },
  {
    name: "Housekeeping",
    description: "Regular housekeeping services for residential properties",
    image: "/placeholder.svg",
    category: "67e8ecf094a75c0b36b2af06",
    price: 450
  },
  {
    name: "Furniture Assembly",
    description: "Expert furniture assembly services for your convenience",
    image: "/placeholder.svg",
    category: "67e8ed3994a75c0b36b2af0b",
    price: 500
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB ✅");

    // Remove existing services
    await Service.deleteMany({});
    console.log("Existing services removed");

    // Insert new services
    await Service.insertMany(mockServices);
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
