const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');
const productController = require('../controllers/productController');

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newProduct = new Product({ title, description, code, price, status, stock, category, thumbnails });
        const createdProduct = await newProduct.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        // Filtro de búsqueda
        const searchFilter = query ? { $or: [{ category: query }, { status: query }] } : {};

        // Ordenamiento
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        // Paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption
        };

        const products = await Product.paginate(searchFilter, options);

        // Construir la respuesta con paginación
        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}` : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener detalles de un producto específico
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve product details' });
    }
});

// Obtener productos con paginación, filtros, y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query } = req.query;

        // Validar sort
        const validSort = sort === 'asc' ? 1 : -1;

        // Crear opciones de paginación
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { price: validSort }
        };

        // Crear filtro de búsqueda
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: { $regex: query, $options: 'i' } },
                    { status: { $regex: query, $options: 'i' } }
                ]
            };
        }

        // Realizar consulta paginada
        const result = await Product.paginate(filter, options);

        // Generar respuesta con el formato requerido
        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch products" });
    }
});

// Crear un carrito nuevo y agregar un producto
router.post('/add-to-cart/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        // Crear un nuevo carrito
        const newCart = new Cart({
            userId: null, // Puedes ajustar esto si más tarde decides tener un usuario
            products: [{ productId: pid, quantity: 1 }]
        });
        const createdCart = await newCart.save();
        res.status(201).json({ status: 'success', payload: createdCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create cart and add product' });
    }
});



// Rutas para productos
router.get('/', productController.getProducts); // Lista de productos
router.get('/realTimeProducts', productController.getRealTimeProducts); // Productos en tiempo real
router.get('/:pid', productController.getProductById); // Detalles del producto

module.exports = router;
