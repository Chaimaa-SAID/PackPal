const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const Category = require("../models/category");

const calculateTotlal = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    const userCount = users.length;

    const product = await Product.find();
    const productCount = product.length;

    const order = await Order.find();
    const orderCount = order.length;

    const category = await Category.find();
    const categoryCount = category.length;


    res.json({ userCount, productCount, orderCount, categoryCount });

    return userCount;
  } catch (error) {
    // Handle any errors
    console.error("Error calculating user count:", error);
    return null;
  }
};

module.exports = {
  calculateTotlal,
};
