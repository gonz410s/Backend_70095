const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Product = require('../models/product');
const { createProduct, getProductById } = require('../services/productService');

router.post('/', upload.array('thumbnails', 5), async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  const thumbnails = req.files.map(file => `/uploads/${file.filename}`);
  
  if (!title || !description || !code || !price || !status || !stock || !category || thumbnails.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = new Product(`${Date.now()}${Math.floor(Math.random() * 1000)}`, title, description, code, price, status, stock, category, thumbnails);
  try {
    const createdProduct = await createProduct(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;
