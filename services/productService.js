const Product = require('../models/product');

const createProduct = async (product) => {
  const newProduct = new Product(product);
  return await newProduct.save();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

module.exports = {
  createProduct,
  getProductById,
};
