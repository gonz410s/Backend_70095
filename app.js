const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const viewsRoutes = require('./routes/views.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const hbs = exphbs.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
});


mongoose.connect('mongodb://localhost:27017/apiDB', {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

// Rutas de vistas
app.use('/', viewsRoutes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON format:', err);
        return res.status(400).send({ message: 'Invalid JSON' });
    }
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

require('./sockets/sockethandlers')(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
