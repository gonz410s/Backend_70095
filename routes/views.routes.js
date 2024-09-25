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
// Middleware para obtener o crear carrito basado en la sesión
router.use(CartController.getCartFromSession);

// Ver el carrito actual
router.get('/carts/current', CartController.getCurrentCart);
// Ruta para mostrar el carrito actual

router.get('/cart', (req, res) => {
    const cart = req.session.cart || { products: [] }; // Obtén el carrito de la sesión
    res.render('cart', { cart }); // Pasa el carrito a la vista
});
// Agregar producto al carrito actual
router.post('/products/:pid', CartController.addProductToCart);

module.exports = router;
