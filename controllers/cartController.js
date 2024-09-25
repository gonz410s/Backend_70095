const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('items.productId'); 
        res.render('carts', { carts }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los carritos');
    }
};
// Función para crear un nuevo carrito
exports.createCart = async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        req.session.cartId = newCart._id; // Guarda el cartId en la sesión
        res.status(200).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        console.error('Error creando carrito:', error);
        res.status(500).json({ error: 'Error creando carrito' });
    }
};

// Función para obtener todos los carritos
exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product'); // Asegúrate de que esto esté correctamente referenciado
        const cartsWithDetails = carts.map(cart => {
            const totalPrice = cart.products.reduce((acc, item) => {
                if (item.product && item.product.price) { // Asegúrate de que item.product esté definido
                    return acc + item.product.price * item.quantity; // Asegúrate de que item.product.price exista
                }
                return acc; // Retorna el acumulador si no está definido
            }, 0);

            return {
                id: cart._id,
                userId: cart.userId,
                totalPrice,
                items: cart.products
            };
        });

        res.json({ status: 'success', carts: cartsWithDetails });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};


// Función para obtener un carrito por ID
exports.getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid)
            .populate({
                path: 'products.product', // Ruta completa para el campo anidado
                select: 'title price'
            })
            .populate('userId', 'name email');

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Calcula totales
        const totalItems = cart.products.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalPrice = cart.products.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
        const cartWithTotals = { ...cart._doc, totalItems, totalPrice };

        res.render('cartDetails', { title: 'Detalles del Carrito', cart: cartWithTotals });
    } catch (error) {
        console.error('Error al leer el carrito:', error);
        res.status(500).send('Error cargando el carrito');
    }
};

// Función para agregar un producto al carrito
exports.addProductToCart = async (req, res) => {
    const { pid } = req.params; // ID del producto a agregar
    const userSession = req.session; // Obtén la sesión actual

    try {
        // Verifica si ya existe un carrito en la sesión
        if (!userSession.cartId) {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            userSession.cartId = newCart._id; // Guarda el ID del nuevo carrito en la sesión
        }

        // Obtiene el carrito actual
        const cart = await Cart.findById(userSession.cartId);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        // Verifica si el producto existe
        const product = await Product.findById(pid);
        console.log('Producto encontrado:', product); // Log para verificar el producto encontrado
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

        // Verifica si el producto ya está en el carrito
        const existingProduct = cart.products.find(item => item.product.toString() === pid);
        console.log('Producto existente en carrito:', existingProduct); // Log para verificar el producto existente

        if (existingProduct) {
            // Incrementa la cantidad
            existingProduct.quantity += 1;
        } else {
            // Agrega un nuevo producto al carrito
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save(); // Guarda los cambios en el carrito
        res.json({ status: 'success', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};


// Función para obtener el carrito actual de la sesión
exports.getCurrentCart = async (req, res) => {
    try {
        if (!req.session.cartId) {
            return res.status(400).json({ error: 'No hay cartId en la sesión' });
        }

        const cart = await Cart.findById(req.session.cartId).populate('products.product');
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al recuperar el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error recuperando el carrito' });
    }
};

// Función para obtener el carrito de la sesión
exports.getCartFromSession = (req, res, next) => {
    console.log('Sesión:', req.session); // Verifica qué hay en la sesión
    if (!req.session || !req.session.cartId) {
        return res.status(400).json({ error: 'No hay cartId en la sesión' });
    }
};
