const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const CartController = require('../controllers/cartController');

// Agregar producto al carrito actual
router.post('/current', CartController.addProductToCart);

// Agregar producto al carrito específico
router.post('/:cid/products/:pid', CartController.addProductToCart);

// Obtener un carrito específico y desglosar los productos asociados
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 1. Eliminar un producto específico de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Remover el producto
        cart.products = cart.products.filter(product => product.product.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 2. Actualizar el carrito completo con un nuevo arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 3. Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        const productInCart = cart.products.find(product => product.product.toString() === pid);
        
        if (productInCart) {
            productInCart.quantity = quantity;
            await cart.save();
            res.json({ status: 'success', cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 4. Eliminar todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        res.json({ status: 'success', message: 'All products removed from cart', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
