const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate('userId', 'name email') 
            .populate('products.product'); 
        res.render('carts', { title: 'Lista de Carritos', carts });
    } catch (error) {
        console.error('Error reading carts from database', error);
        res.status(500).send('Error loading carts');
    }
};

exports.getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findOne({ _id: cid })
            .populate('userId', 'name email') 
            .populate('products.product'); 
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        res.render('cartDetails', { title: 'Cart Details', cart });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ _id: cid });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        const product = await Product.findOne({ id: pid });
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.status(200).send('Product added to cart');
    } catch (error) {
        res.status(500).send('Server error');
    }
};
