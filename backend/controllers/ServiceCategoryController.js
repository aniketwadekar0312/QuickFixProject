const Category = require("../models/ServiceCategory.js");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let category = await Category.findOne();

    if (!category) {
      category = new Category({ name: [name] });
    } else {
      category.name.push(name);
    }

    const updatedCategory = await category.save();

    res
      .status(201)
      .json({
        message: "Category added successfully",
        updatedCategory,
      });
  } catch (error) {
    console.log("Getting error in addCategory", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getCategories = async(req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(201)
      .json({
        message: "Category fetched successfully",
        categories,
      });
  } catch (error) {
    console.log("Getting error in getCategories", error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = { addCategory, getCategories};
