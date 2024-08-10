const fs = require('fs').promises;
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

const readCartsFile = async () => {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading carts file', error);
    return [];
  }
};

const writeCartsFile = async (data) => {
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing carts file', error);
  }
};

const createCart = async (cart) => {
  const carts = await readCartsFile();
  carts.push(cart);
  await writeCartsFile(carts);
  return cart;
};

const getCartById = async (id) => {
  const carts = await readCartsFile();
  return carts.find(cart => cart.id === id);
};

const getCartsByUserId = async (userId) => {
  const carts = await readCartsFile();
  return carts.filter(cart => cart.userId === userId);
};

const addProductToCart = async (cartId, product) => {
  const carts = await readCartsFile();
  const cart = carts.find(c => c.id === cartId);
  if (!cart) {
    throw new Error('Cart not found');
  }

  const productIndex = cart.products.findIndex(p => p.productId === product.productId);
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += product.quantity;
  } else {
    cart.products.push(product);
  }

  await writeCartsFile(carts);
  return cart;
};

module.exports = {
  createCart,
  getCartById,
  getCartsByUserId,
  addProductToCart,
};
