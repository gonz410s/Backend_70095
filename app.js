const express = require('express');
const path = require('path');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs').promises;
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/carts');
const productRoutes = require('./routes/products');
const viewsRoutes = require('./routes/views.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/', viewsRoutes);

// Ruta del archivo de productos
const productsFilePath = path.join(__dirname, 'data', 'products.json');

async function readProducts() {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products file', error);
        return [];
    }
}

io.on('connection', (socket) => {
    console.log('New client connected');

    // Enviar la lista de productos al nuevo cliente
    readProducts().then(products => {
        socket.emit('updateProducts', products);
    });

    socket.on('createProduct', async (product) => {
        try {
            let products = await readProducts();
            product.id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
            products.push(product);
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error creating product', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            let products = await readProducts();
            products = products.filter(p => p.id !== productId);
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error deleting product', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
