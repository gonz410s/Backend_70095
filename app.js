const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;

// Inicializar Express
const app = express();
const port = 8080;

// Middleware para el logging de las solicitudes
app.use(morgan('combined'));

// Middleware para parsear cuerpos JSON
app.use(express.json());

// Definir rutas de archivos
const productsFilePath = path.join(__dirname, 'data/products.json');
const cartsFilePath = path.join(__dirname, 'data/carts.json');
const usersFilePath = path.join(__dirname, 'data/users.json');

// Auxiliar para leer archivos JSON
const readFile = async (filePath) => {
  console.log(`Reading file: ${filePath}`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(`File read successfully: ${filePath}`);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return [];
  }
};

// Auxiliar para escribir archivos JSON
const writeFile = async (filePath, data) => {
  console.log(`Writing to file: ${filePath}`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`File written successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error writing to file: ${filePath}`, error);
  }
};

// Importar y usar rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const usersRouter = require('./routes/users');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

