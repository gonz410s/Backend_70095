const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

// Ruta para la vista principal
router.get('/', (req, res) => {
    res.render('index', { title: 'Página Principal' });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        console.error('Error reading products from database', error);
        res.status(500).send('Error loading products');
    }
});

// Ruta para la vista de productos normal
router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort = '', query = '' } = req.query;

    try {
        const sortOrder = sort === 'asc' ? 1 : -1;
        const products = await Product.find({ title: new RegExp(query, 'i') })
            .sort({ price: sortOrder })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalProducts = await Product.countDocuments({ title: new RegExp(query, 'i') });

        res.render('products', {
            title: 'Lista de Productos',
            products,
            pagination: {
                limit: parseInt(limit),
                page: parseInt(page),
                totalPages: Math.ceil(totalProducts / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error reading products from database', error);
        res.status(500).send('Error loading products');
    }
});

// Ruta para la vista de carritos
router.get('/carts', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.productId');
        res.render('carts', { title: 'Lista de Carritos', carts });
    } catch (error) {
        console.error('Error reading carts from database', error);
        res.status(500).send('Error loading carts');
    }
});

// Ruta para la vista de un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.productId');
        if (cart) {
            res.render('cartDetails', { title: `Carrito ${cart._id}`, cart });
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        console.error('Error reading cart from database', error);
        res.status(500).send('Error loading cart');
    }
});

module.exports = router;
