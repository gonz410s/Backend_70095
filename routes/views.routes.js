const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

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


module.exports = router;
