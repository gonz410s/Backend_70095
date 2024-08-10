const fs = require('fs').promises;
const path = require('path');

// Ruta del archivo de productos
const productsFilePath = path.join(__dirname, '../data/products.json'); // Asegúrate de que esta ruta sea correcta
const usersFilePath = path.join(__dirname, '../data/users.json'); // Asegúrate de que esta ruta sea correcta
const cartsFilePath = path.join(__dirname, '../data/carts.json'); // Asegúrate de que esta ruta sea correcta

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file at ${filePath}`, error);
        return []; // Retorna un array vacío en caso de error
    }
}

async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing file at ${filePath}`, error);
    }
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Enviar la lista de productos al nuevo cliente
        readFile(productsFilePath).then(products => {
            socket.emit('updateProducts', products);
        });

        // Manejar la creación de productos
        socket.on('createProduct', async (product) => {
            try {
                let products = await readFile(productsFilePath);
                product.id = `PRD-${Date.now()}${Math.floor(Math.random() * 1000)}`;
                products.push(product);
                await writeFile(productsFilePath, products);
                io.emit('updateProducts', products);
            } catch (error) {
                console.error('Error creating product', error);
            }
        });

        // Manejar la eliminación de productos
        socket.on('deleteProduct', async (productId) => {
            try {
                let products = await readFile(productsFilePath);
                products = products.filter(p => p.id !== productId);
                await writeFile(productsFilePath, products);
                io.emit('updateProducts', products);
            } catch (error) {
                console.error('Error deleting product', error);
            }
        });

        // Manejar la creación de usuarios
        socket.on('createUser', async (user) => {
            try {
                let users = await readFile(usersFilePath);
                user.id = `USR-${Date.now()}${Math.floor(Math.random() * 1000)}`;
                users.push(user);
                await writeFile(usersFilePath, users);
                io.emit('updateUsers', users);
            } catch (error) {
                console.error('Error creating user', error);
            }
        });

        // Manejar la creación de carritos
        socket.on('createCart', async (cart) => {
            try {
                let carts = await readFile(cartsFilePath);
                cart.id = `CRT-${Date.now()}${Math.floor(Math.random() * 1000)}`;
                carts.push(cart);
                await writeFile(cartsFilePath, carts);
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
