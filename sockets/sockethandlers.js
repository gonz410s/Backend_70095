const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Enviar la lista de productos al nuevo cliente
        Product.find().then(products => {
            socket.emit('updateProducts', products);
        });

        // Manejar la creación de productos
        socket.on('createProduct', async (product) => {
            try {
                product.id = `PRD-${Date.now()}${Math.floor(Math.random() * 1000)}`;
                const newProduct = await Product.create(product);
                const products = await Product.find();
                io.emit('updateProducts', products);
            } catch (error) {
                console.error('Error creating product', error);
            }
        });

        // Manejar la eliminación de productos
        socket.on('deleteProduct', async (productId) => {
            try {
                await Product.findByIdAndDelete(productId);
                const products = await Product.find();
                io.emit('updateProducts', products);
            } catch (error) {
                console.error('Error deleting product', error);
            }
        });

        // Manejar la creación de usuarios
        socket.on('createUser', async (user) => {
            try {
                user.id = `USR-${Date.now()}${Math.floor(Math.random() * 1000)}`;
                const newUser = await User.create(user);
                const users = await User.find();
                io.emit('updateUsers', users);
            } catch (error) {
                console.error('Error creating user', error);
            }
        });

        // Manejar la creación de carritos
        socket.on('createCart', async (cart) => {
            try {
                cart.id = `CRT-${Date.now()}${Math.floor(Math.random() * 1000)}`;
                const newCart = await Cart.create(cart);
                const carts = await Cart.find();
                io.emit('updateCarts', carts);
            } catch (error) {
                console.error('Error creating cart', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
