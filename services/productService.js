const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const readProductsFile = async () => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file', error);
    return [];
  }
};

const writeProductsFile = async (data) => {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing products file', error);
  }
};

const createProduct = async (product) => {
  const products = await readProductsFile();
  products.push(product);
  await writeProductsFile(products);
  return product;
};

const getProductById = async (id) => {
  const products = await readProductsFile();
  return products.find(product => product.id === id);
};

module.exports = {
  createProduct,
  getProductById,
};
