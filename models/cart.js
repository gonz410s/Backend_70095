// Cart.js
class Cart {
  constructor(userId, products = []) {
    this.id = `CRT-${Date.now()}${Math.floor(Math.random() * 1000)}`;
    this.userId = userId;
    this.products = products;
    this.createdAt = new Date();
  }

  // Método para agregar productos al carrito
  addProduct(productId, quantity = 1) {
    const existingProductIndex = this.products.findIndex(p => p.productId === productId);
    if (existingProductIndex !== -1) {
      this.products[existingProductIndex].quantity += quantity;
    } else {
      this.products.push({ productId, quantity });
    }
  }
}

module.exports = Cart;