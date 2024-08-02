const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { createCart, getCartById, getCartsByUserId, addProductToCart } = require('../services/cartService');
const { getProductById } = require('../services/productService');
const { getUserById } = require('../services/userService');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const { userId, products } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newCart = new Cart(`${Date.now()}${Math.floor(Math.random() * 1000)}`, userId, products || []);
    const createdCart = await createCart(newCart);
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

// Obtener carrito por id
router.get('/:cid', async (req, res) => {
  try {
    const cart = await getCartById(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Obtener carritos por usuario
router.get('/user/:uid', async (req, res) => {
  try {
    const carts = await getCartsByUserId(req.params.uid);
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get carts for user' });
  }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const product = await getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedCart = await addProductToCart(req.params.cid, { product: req.params.pid, quantity: 1 });
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

module.exports = router;
