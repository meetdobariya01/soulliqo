const Product = require('../Models/Product');

// @desc    Get all available products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    // Optionally only fetch available products
    const products = await Product.find({ isAvailable: true }).select('name price image category slug weight');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch products' });
  }
};

// @desc    Get unique categories for the Collections Page
// @route   GET /api/products/categories
exports.getUniqueCategories = async (req, res) => {
  try {
    // Use MongoDB's distinct function to get unique values for the 'category' field
    const categories = await Product.distinct('category');
    
    // In a real app, you'd fetch images and details from a separate Category model.
    // Here we return just the names.
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch categories' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryName
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.categoryName;
    const products = await Product.find({ category: category, isAvailable: true });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found in category: ${category}` });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch products by category' });
  }
};