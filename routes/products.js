const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

// Helper para leer los JSON
const readProductsFile = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

// Helper para leer los JSON
const writeProductsFile = (data) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

// Helper ID unica
const generateUniqueId = () => {
  return String(Date.now() + Math.floor(Math.random() * 1000));
};

// GET /api/products/
router.get('/', (req, res) => {
  const products = readProductsFile();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const products = readProductsFile();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});


router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || stock === undefined || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const products = readProductsFile();
  const newProduct = {
    id: generateUniqueId(), //LLama Funcion crea id unica
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  products.push(newProduct);
  writeProductsFile(products);

  res.status(201).json(newProduct);
});

// PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const products = readProductsFile();
  const index = products.findIndex(p => p.id === req.params.pid);
  if (index !== -1) {
    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    writeProductsFile(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const products = readProductsFile();
  const newProducts = products.filter(p => p.id !== req.params.pid);
  if (newProducts.length !== products.length) {
    writeProductsFile(newProducts);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
