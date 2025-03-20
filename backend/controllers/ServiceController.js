const Service = require("../models/Service");

const addService = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    const newService = new Service({
      name,
      description,
      price,
      category,
      image,
    });

    const service = await newService.save();
    return res
      .status(500)
      .json({ status: true, message: "Service added successfully", service });
  } catch (error) {
    console.log("Getting error in addService", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getService = async(req, res) => {
    try {
        
    } catch (error) {
        console.log("Getting error in getService", error);
        return res.status(500).json({ status: false, message: error.message }); 
    }
};

const getServiceById = async(req, res) => {
    try {
        
    } catch (error) {
        console.log("Getting error in getService", error);
        return res.status(500).json({ status: false, message: error.message }); 
    }
};

const updateService = async(req, res) => {
    try {
        
    } catch (error) {
        console.log("Getting error in getService", error);
        return res.status(500).json({ status: false, message: error.message }); 
    }
};

const deleteService = async(req, res) => {
    try {
        
    } catch (error) {
        console.log("Getting error in getService", error);
        return res.status(500).json({ status: false, message: error.message }); 
    }
}

module.exports = { addService, getService, getServiceById, updateService, deleteService};
