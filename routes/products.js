const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

// Funcion auxiliar para leer el JSON de products
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

// Funcion auxiliar para escribir el JSON de products
const writeProductsFile = async (data) => {
  console.log('Writing to products file');
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
    console.log('Products file written successfully');
  } catch (error) {
    console.error('Error writing to products file', error);
  }
};

// GET /api/products/ - Listar todos los productos
router.get('/', async (req, res) => {
  console.log('GET /api/products/ called');
  try {
    const products = await readProductsFile();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    console.log(`Returning ${limit} products`);
    res.json(products.slice(0, limit));
  } catch (error) {
    console.error('Error listing products', error);
    res.status(500).json({ error: 'Failed to read products data' });
  }
});

// GET /api/products/:pid - Obtener Productos por id
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  console.log(`GET /api/products/${pid} called`);
  try {
    const products = await readProductsFile();
    const product = products.find(p => p.id === pid);
    if (product) {
      console.log('Product found:', product);
      res.json(product);
    } else {
      console.log('Product not found');
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error getting product by ID', error);
    res.status(500).json({ error: 'Failed to read products data' });
  }
});

// POST /api/products/ - Agregar nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  console.log('POST /api/products/ called with body:', req.body);
  if (!title || !description || !code || !price || !stock || !category) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const products = await readProductsFile();
    const newProduct = {
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      title,
      description,
      code,
      price,
      status: status !== undefined ? status : true,
      stock,
      category,
      thumbnails: thumbnails || []
    };
    products.push(newProduct);
    await writeProductsFile(products);
    console.log('Product added successfully:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:pid - Actualizar un producto
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  console.log(`PUT /api/products/${pid} called with body:`, req.body);
  try {
    const products = await readProductsFile();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex !== -1) {
      const product = products[productIndex];
      products[productIndex] = {
        ...product,
        title: title !== undefined ? title : product.title,
        description: description !== undefined ? description : product.description,
        code: code !== undefined ? code : product.code,
        price: price !== undefined ? price : product.price,
        status: status !== undefined ? status : product.status,
        stock: stock !== undefined ? stock : product.stock,
        category: category !== undefined ? category : product.category,
        thumbnails: thumbnails !== undefined ? thumbnails : product.thumbnails
      };
      await writeProductsFile(products);
      console.log('Product updated successfully:', products[productIndex]);
      res.json(products[productIndex]);
    } else {
      console.log('Product not found');
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:pid - Borrar un producto
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  console.log(`DELETE /api/products/${pid} called`);
  try {
    const products = await readProductsFile();
    const newProducts = products.filter(p => p.id !== pid);
    if (products.length === newProducts.length) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }
    await writeProductsFile(newProducts);
    console.log('Product deleted successfully');
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
