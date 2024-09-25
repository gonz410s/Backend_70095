const Product = require('../models/product');


exports.getProducts = async (req, res) => {
    const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
    const pageLimit = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const sortOrder = sort === 'asc' ? 1 : -1;

    try {
        const products = await Product.find({ title: new RegExp(query, 'i') })
            .sort({ price: sortOrder })
            .limit(pageLimit)
            .skip((pageNumber - 1) * pageLimit);

        const totalProducts = await Product.countDocuments({ title: new RegExp(query, 'i') });
        const totalPages = Math.ceil(totalProducts / pageLimit);

        // Calcular URLs de paginación
        const prevPage = pageNumber > 1 ? `/products?limit=${pageLimit}&page=${pageNumber - 1}&sort=${sortOrder}` : null;
        const nextPage = pageNumber < totalPages ? `/products?limit=${pageLimit}&page=${pageNumber + 1}&sort=${sortOrder}` : null;

        res.render('products', {
            title: 'Lista de Productos',
            products,
            pagination: {
                limit: pageLimit,
                page: pageNumber,
                totalPages,
                prevPage,
                nextPage
            }
        });
    } catch (error) {
        console.error('Error reading products from database', error);
        res.status(500).send('Error loading products');
    }
};




// Obtener productos en tiempo real y renderizar vista
exports.getRealTimeProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        console.error('Error reading products from database', error);
        res.status(500).send('Error loading products');
    }
};

// Obtener detalles de un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.render('productDetails', { product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve product details', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    try {
        const newProduct = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        });

        await newProduct.save();
        res.json({ status: 'success', product: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
