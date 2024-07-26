const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carts.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

// Funcion auxiliar para leer los archivos JSON del carrito
const readCartsFile = async () => {
  console.log(`Reading carts file: ${cartsFilePath}`);
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    console.log('Carts file read successfully');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading carts file', error);
    return [];
  }
};

// Funcion auxiliar para escribir los archivos JSON del carrito
const writeCartsFile = async (data) => {
  console.log('Writing to carts file');
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
    console.log('Carts file written successfully');
  } catch (error) {
    console.error('Error writing to carts file', error);
  }
};

// Funcion auxiliar para leer los archivos JSON de los productos
const readProductsFile = async () => {
  console.log(`Reading products file: ${productsFilePath}`);
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    console.log('Products file read successfully');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file', error);
    return [];
  }
};

// POST /api/carts/ - Crear un nuevo carrito con productos
router.post('/', async (req, res) => {
  console.log('POST /api/carts/ called with body:', req.body);
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      console.log('Invalid products format');
      return res.status(400).json({ error: 'Products should be an array' });
    }

    const validProducts = await readProductsFile();
    const invalidProducts = products.filter(p => !validProducts.find(vp => vp.id === p.product));
    
    if (invalidProducts.length > 0) {
      console.log('Invalid products:', invalidProducts);
      return res.status(400).json({ error: 'Some products are invalid' });
    }

    const carts = await readCartsFile();
    const newCart = {
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      products: products
    };

    carts.push(newCart);
    await writeCartsFile(carts);
    console.log('Cart created successfully:', newCart);
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error creating cart', error);
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

// GET /api/carts/:cid - Obtener carrito por id
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  console.log(`GET /api/carts/${cid} called`);
  try {
    const carts = await readCartsFile();
    const cart = carts.find(c => c.id === cid);
    if (cart) {
      console.log('Cart found:', cart);
      res.json(cart.products);
    } else {
      console.log('Cart not found');
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error getting cart', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  console.log(`POST /api/carts/${cid}/product/${pid} called`);
  try {
    const carts = await readCartsFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
      console.log('Cart not found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    const products = await readProductsFile();
    const product = products.find(p => p.id === pid);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await writeCartsFile(carts);
    console.log('Product added to cart:', cart);
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error adding product to cart', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

module.exports = router;
