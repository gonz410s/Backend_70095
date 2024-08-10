const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Ruta para la vista principal
router.get('/', (req, res) => {
    res.render('index', { title: 'Página Principal' });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        console.error('Error reading products file', error);
        res.status(500).send('Error loading products');
    }
});

// Ruta para la vista de productos normal
router.get('/products', async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        res.render('products', { title: 'Lista de Productos', products });
    } catch (error) {
        console.error('Error reading products file', error);
        res.status(500).send('Error loading products');
    }
});

// Ruta para la vista de carritos
router.get('/carts', async (req, res) => {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(data);
        res.render('carts', { title: 'Lista de Carritos', carts });
    } catch (error) {
        console.error('Error reading carts file', error);
        res.status(500).send('Error loading carts');
    }
});

// Ruta para la vista de un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === req.params.cid);
        if (cart) {
            res.render('cartDetails', { title: `Carrito ${cart.id}`, cart });
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        console.error('Error reading carts file', error);
        res.status(500).send('Error loading cart');
    }
});

module.exports = router;
