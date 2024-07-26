const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Helper para leer los JSON
const readCartsFile = () => {
  const data = fs.readFileSync(cartsFilePath);
  return JSON.parse(data);
};

// Helper para leer los JSON
const writeCartsFile = (data) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
};

// Helper Para el unique ID
const generateUniqueId = () => {
  return String(Date.now() + Math.floor(Math.random() * 1000));
};

// POST /api/carts/
router.post('/', (req, res) => {
  const carts = readCartsFile();
  const newCart = {
    id: generateUniqueId(), // Generacion ID unica
    products: []
  };

  carts.push(newCart);
  writeCartsFile(carts);

  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find(c => c.id === req.params.cid);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeCartsFile(carts);
  res.status(201).json(cart);
});

module.exports = router;
