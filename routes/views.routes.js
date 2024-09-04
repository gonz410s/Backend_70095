const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const CartController = require('../controllers/cartController');

// Ruta para la vista principal
router.get('/', (req, res) => {
    res.render('index', { title: 'Página Principal' });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', ProductController.getRealTimeProducts);

// Ruta para la vista de productos normal
router.get('/products', ProductController.getProducts);

// Ruta para la vista de detalles de un producto
router.get('/products/:pid', ProductController.getProductById);

// Ruta para la vista de carritos
router.get('/carts', CartController.getCarts);

// Ruta para la vista de un carrito específico
router.get('/carts/:cid', CartController.getCartById);


module.exports = router;
