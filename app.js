const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/carts');
const productRoutes = require('./routes/products');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
