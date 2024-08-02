class Cart {
    constructor(userId, products = []) {
      this.id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
      this.userId = userId;
      this.products = products;
    }
  }
  
  module.exports = Cart;
  