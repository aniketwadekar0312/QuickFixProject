const mongoose = require('mongoose');
const Service = require('./models/Service'); // Adjust the path as needed

const mockServices = [
  {
    name: "Plumbing",
    description: "Professional plumbing services for all your needs",
    image: "/placeholder.svg",
    category: "Home Repair",
    price: 500
  },
  {
    name: "Electrical",
    description: "Expert electrical services for residential and commercial properties",
    image: "/placeholder.svg",
    category: "Home Repair",
    price: 600
  },
  {
    name: "Cleaning",
    description: "Comprehensive cleaning services for homes and offices",
    image: "/placeholder.svg",
    category: "Home Maintenance",
    price: 400
  },
  {
    name: "Carpentry",
    description: "Skilled carpentry services for all your woodworking needs",
    image: "/placeholder.svg",
    category: "Home Improvement",
    price: 600
  },
  {
    name: "Painting",
    description: "Professional painting services for interior and exterior surfaces",
    image: "/placeholder.svg",
    category: "Home Improvement",
    price: 450
  },
  {
    name: "Air Conditioning",
    description: "AC installation, repair, and maintenance services",
    image: "/placeholder.svg",
    category: "Home Repair",
    price: 800
  },
  {
    name: "Housekeeping",
    description: "Regular housekeeping services for residential properties",
    image: "/placeholder.svg",
    category: "Home Maintenance",
    price: 450
  },
  {
    name: "Furniture Assembly",
    description: "Expert furniture assembly services for your convenience",
    image: "/placeholder.svg",
    category: "Home Improvement",
    price: 500
  }
];

const seedDB = async () => {
  try {
   //
    
    await Service.deleteMany(); // Clears existing data
    console.log('Existing services removed');
    
    await Service.insertMany(mockServices);
    console.log('Mock services added successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDB();
