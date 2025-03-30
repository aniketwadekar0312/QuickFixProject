const Category = require("../models/ServiceCategory.js");

const addCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ message: "Category name and imageUrl are required" });
    }

    // Check if category with the same name exists
    let existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category
    const newCategory = new Category({ name, imageUrl });

    await newCategory.save();

    res.status(201).json({
      status: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error in addCategory:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("services"); // Populate services if needed

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateCategory = async(req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.name, imageUrl: req.body.imageUrl },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
}


const deleteCategory = async(req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = { addCategory, getCategories, deleteCategory, updateCategory};
