class Product {
  constructor(title, description, code, price, status, stock, category, thumbnails = []) {
    this.id = `PRD-${Date.now()}${Math.floor(Math.random() * 1000)}`;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
    this.createdAt = new Date();
  }
}

module.exports = Product;
