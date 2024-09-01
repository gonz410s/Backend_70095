const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Crear un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !status || !stock || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newProduct = new Product({ title, description, code, price, status, stock, category, thumbnails });
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;
