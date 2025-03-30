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

const getService = async (req, res) => {
  try {
     const services = await Service.find().sort({ createdAt: -1 }).populate('category');
     return res.status(200).json({ status: true, message: "services fetched successfully", services });
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
    return res.status(200).json({ status: true, message: "services fetched successfully", service });
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

    await service.remove();
    return res
      .status(200)
      .json({ status: false, message: "Service deleted successfully" });
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
