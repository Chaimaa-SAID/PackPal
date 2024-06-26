const Category = require('../models/category');
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: 'Categories not found' });
  }
};
exports.getOneCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving category' });
  }
};
exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      media: req.body.media,
    });
    await category.save();
    res.status(201).json({ message: 'Category created successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.name = req.body.name 
    category.media = req.body.media 
    await category.save();
    res.status(200).json({ message: 'Category updated successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating category' });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting category' });
  }
};