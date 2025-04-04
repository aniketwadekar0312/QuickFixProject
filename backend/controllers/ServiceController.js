const Service = require("../models/Service");
const User = require("../models/User");
const Category = require("../models/ServiceCategory")

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
      .status(200)
      .json({ status: true, message: "Service added successfully", service });
  } catch (error) {
    console.log("Getting error in addService", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getService = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    // Add search functionality
    if (search) {
      // Create a case-insensitive search across multiple fields
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
      
      // Also search in category names
      const categoryIds = await Category.find(
        { name: { $regex: search, $options: 'i' } },
        { _id: 1 }
      );
      
      if (categoryIds.length > 0) {
        query.$or.push({ category: { $in: categoryIds.map(cat => cat._id) } });
      }
    }

    // Fetch services with the search query
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .populate("category");

    // Fetch worker counts for each service
    const servicesWithWorkerCount = await Promise.all(
      services.map(async (service) => {
        const workerCount = await User.countDocuments({
          role: "worker",
          services: service.name,
        });
        return { ...service.toObject(), workerCount };
      })
    );

    return res.status(200).json({
      status: true,
      message: "Services fetched successfully",
      services: servicesWithWorkerCount,
    });
  } catch (error) {
    console.log("Getting error in getService", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    return res
      .status(200)
      .json({
        status: true,
        message: "services fetched successfully",
        service,
      });
  } catch (error) {
    console.log("Getting error in getServiceById", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    const { name, description, price, category, image } = req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = price;
    if (category) service.category = category;
    if (image) service.image = image;

    await service.save();

    return res
      .status(200)
      .json({ status: true, message: "service updated successfully" });
  } catch (error) {
    console.log("Getting error in updateService", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ status: false, message: "Service not found" });
    }

    await Service.deleteOne({_id: req.params.id});
    return res
      .status(200)
      .json({ status: true, message: "Service deleted successfully" });
  } catch (error) {
    console.log("Getting error in deleteService", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addService,
  getService,
  getServiceById,
  updateService,
  deleteService,
};
