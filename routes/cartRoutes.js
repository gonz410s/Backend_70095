const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Agregar producto al carrito
router.post('/:cid/products/:pid', CartController.addProductToCart);

// Obtener un carrito específico y desglosar los productos asociados
router.get('/:cid', CartController.getCartById);

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to remove product from cart' });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; // [{ product, quantity }]
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = products;
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update cart' });
    }
});

// Actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        const product = cart.products.find(p => p.product.toString() === pid);
        if (product) {
            product.quantity = quantity;
        }
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update product quantity' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = [];
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to clear cart' });
    }
});

module.exports = router;
